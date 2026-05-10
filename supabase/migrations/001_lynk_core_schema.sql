-- Lynk prototype schema for Supabase.
-- Apply from the Supabase SQL editor or convert into a CLI migration.

create extension if not exists pgcrypto;
create extension if not exists cube;
create extension if not exists earthdistance;

create type public.user_intent as enum ('friends', 'dating');
create type public.relationship_goal as enum ('relationship', 'casual', 'unsure', 'prefer_not_to_say');
create type public.swipe_action as enum ('like', 'pass', 'super_like');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.subscription_status as enum ('free', 'premium', 'past_due', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  display_name text not null,
  email text,
  phone text,
  date_of_birth date not null,
  gender text not null,
  intent public.user_intent not null,
  bio text default '',
  interests text[] not null default '{}',
  hobbies text[] not null default '{}',
  profile_photo_url text,
  university text default 'University of Botswana',
  manual_location text,
  location_lat numeric(9,6),
  location_lng numeric(9,6),
  location_updated_at timestamptz,
  discovery_radius_km integer not null default 25 check (discovery_radius_km between 1 and 100),
  preferred_genders text[] not null default '{}',
  preferred_min_age integer check (preferred_min_age between 18 and 80),
  preferred_max_age integer check (preferred_max_age between 18 and 80),
  sexual_orientation text,
  relationship_goal public.relationship_goal,
  is_paused boolean not null default false,
  is_deleted boolean not null default false,
  is_profile_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dating_users_are_adults check (
    intent <> 'dating' or date_of_birth <= (current_date - interval '18 years')
  ),
  constraint interests_limit check (array_length(interests, 1) is null or array_length(interests, 1) <= 3),
  constraint location_precision check (
    location_lat is null or round(location_lat::numeric, 3) = location_lat
  )
);

create table public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_id, storage_path)
);

create table public.discovery_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  age_min integer not null default 18 check (age_min between 18 and 80),
  age_max integer not null default 30 check (age_max between 18 and 80),
  genders text[] not null default '{}',
  radius_km integer not null default 25 check (radius_km between 1 and 100),
  show_me_to jsonb not null default '{"friends": true, "dating": true}',
  updated_at timestamptz not null default now(),
  constraint valid_age_range check (age_min <= age_max)
);

create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  action public.swipe_action not null,
  created_at timestamptz not null default now(),
  unique (actor_id, target_id),
  constraint no_self_swipe check (actor_id <> target_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_one_id uuid not null references public.profiles(id) on delete cascade,
  user_two_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unmatched_at timestamptz,
  unique (user_one_id, user_two_id),
  constraint ordered_match_users check (user_one_id < user_two_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  message_type text not null default 'text' check (message_type in ('text', 'emoji', 'icebreaker')),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  meeting_day text,
  cover_url text,
  is_approved boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.club_events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  location text not null,
  capacity integer,
  created_at timestamptz not null default now()
);

create table public.event_rsvps (
  event_id uuid not null references public.club_events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

create table public.subscriptions (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  status public.subscription_status not null default 'free',
  provider text,
  provider_customer_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.profile_visits (
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_id uuid not null references public.profiles(id) on delete cascade,
  visit_count integer not null default 1,
  last_viewed_at timestamptz not null default now(),
  primary key (viewer_id, viewed_id),
  constraint no_self_visit check (viewer_id <> viewed_id)
);

create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid references public.profiles(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index profiles_intent_idx on public.profiles(intent) where is_deleted = false and is_paused = false;
create index profiles_location_idx on public.profiles using gist (ll_to_earth(location_lat::float8, location_lng::float8))
  where location_lat is not null and location_lng is not null and is_deleted = false and is_paused = false;
create index swipes_actor_idx on public.swipes(actor_id);
create index swipes_target_idx on public.swipes(target_id) where action in ('like', 'super_like');
create index messages_match_created_idx on public.messages(match_id, created_at desc);
create index reports_status_created_idx on public.reports(status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create schema if not exists private;

create or replace function private.create_match_from_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  first_user uuid;
  second_user uuid;
begin
  if new.action not in ('like', 'super_like') then
    return new;
  end if;

  if exists (
    select 1 from public.swipes
    where actor_id = new.target_id
      and target_id = new.actor_id
      and action in ('like', 'super_like')
  ) then
    first_user := least(new.actor_id, new.target_id);
    second_user := greatest(new.actor_id, new.target_id);

    insert into public.matches (user_one_id, user_two_id)
    values (first_user, second_user)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger swipes_create_match
after insert or update of action on public.swipes
for each row execute function private.create_match_from_like();

alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.discovery_preferences enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.clubs enable row level security;
alter table public.club_events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.subscriptions enable row level security;
alter table public.profile_visits enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

create policy "profiles can be read by signed in users"
on public.profiles for select to authenticated
using (
  is_deleted = false
  and id not in (select blocked_id from public.blocks where blocker_id = (select auth.uid()))
  and id not in (select blocker_id from public.blocks where blocked_id = (select auth.uid()))
);

create policy "users insert own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

create policy "users update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "users manage own photos"
on public.profile_photos for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

create policy "users manage own preferences"
on public.discovery_preferences for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

create policy "users create own swipes"
on public.swipes for insert to authenticated
with check ((select auth.uid()) = actor_id);

create policy "users read own swipes"
on public.swipes for select to authenticated
using ((select auth.uid()) = actor_id or (select auth.uid()) = target_id);

create policy "participants read matches"
on public.matches for select to authenticated
using ((select auth.uid()) in (user_one_id, user_two_id));

create policy "participants read messages"
on public.messages for select to authenticated
using (
  exists (
    select 1 from public.matches m
    where m.id = match_id
      and (select auth.uid()) in (m.user_one_id, m.user_two_id)
  )
);

create policy "participants send messages"
on public.messages for insert to authenticated
with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1 from public.matches m
    where m.id = match_id
      and (select auth.uid()) in (m.user_one_id, m.user_two_id)
  )
);

create policy "approved clubs are readable"
on public.clubs for select to authenticated, anon
using (is_approved = true);

create policy "approved club events are readable"
on public.club_events for select to authenticated, anon
using (exists (select 1 from public.clubs c where c.id = club_id and c.is_approved = true));

create policy "users manage own rsvps"
on public.event_rsvps for all to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

create policy "users read own subscription"
on public.subscriptions for select to authenticated
using ((select auth.uid()) = profile_id);

create policy "premium users read repeated profile visits to them"
on public.profile_visits for select to authenticated
using (
  viewed_id = (select auth.uid())
  and visit_count > 3
  and exists (
    select 1 from public.subscriptions s
    where s.profile_id = (select auth.uid())
      and s.status = 'premium'
  )
);

create policy "users create visits"
on public.profile_visits for insert to authenticated
with check ((select auth.uid()) = viewer_id);

create policy "users manage own blocks"
on public.blocks for all to authenticated
using ((select auth.uid()) = blocker_id)
with check ((select auth.uid()) = blocker_id);

create policy "users read blocks involving them"
on public.blocks for select to authenticated
using ((select auth.uid()) in (blocker_id, blocked_id));

create policy "users create reports"
on public.reports for insert to authenticated
with check ((select auth.uid()) = reporter_id);

create policy "users read own reports"
on public.reports for select to authenticated
using ((select auth.uid()) = reporter_id);

grant usage on schema public to anon, authenticated;
grant select on public.clubs, public.club_events to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
