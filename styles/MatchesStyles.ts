import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const MatchesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
    fontWeight: '500',
  },

  // ─── Section Label ────────────────────────────────
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF4D6D',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 14,
    marginTop: 8,
  },

  // ─── New Matches horizontal scroll ───────────────
  newMatchesScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 16,
  },
  newMatchItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  newMatchAvatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#FF4D6D',
    padding: 2,
    marginBottom: 8,
  },
  newMatchAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  newMatchName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
  },

  // ─── Conversation Cards ────────────────────────────
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
  },
  conversationAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  conversationPreview: {
    fontSize: 13,
    color: '#888888',
    marginTop: 3,
  },
  conversationTime: {
    fontSize: 12,
    color: '#BBBBBB',
    fontWeight: '500',
  },

  // ─── Empty State ─────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.25,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
