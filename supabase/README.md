# Lynk Supabase Prototype

Target project: `my-app` (`flilkciffyaxdtpucsru`)

New project creation was blocked by the Supabase free active-project limit, so the existing empty Lynk-like `my-app` project was upgraded in place for the investor prototype.

Applied remote migrations:

- `lynk_core_v2_secure_schema`
- `lynk_security_advisor_cleanup`
- `lynk_revoke_trigger_rpc_execute`

The remote database now includes RLS-enabled tables for profiles, profile photos, discovery preferences, swipes, matches, messages, clubs, club events, RSVPs, subscriptions, profile visits, blocks, reports, and ice breakers. It also has public storage buckets for `profile-photos` and `club-assets`.

Frontend env:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Local `.env.local` is configured and intentionally git-ignored.
