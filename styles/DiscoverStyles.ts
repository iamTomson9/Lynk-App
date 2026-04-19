import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const CARD_WIDTH = width * 0.88;
export const CARD_HEIGHT = height * 0.62;

export const DiscoverStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },

  // ─── Header ───────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: '#F8F4FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  headerTitleAccent: {
    color: '#FF4D6D',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
  },

  // ─── Card Stack ───────────────────────────────────
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
    boxShadow: '0px 8px 32px rgba(0,0,0,0.15)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  cardName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardAge: {
    fontSize: 22,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  cardUniversity: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    fontWeight: '500',
  },

  // ─── Like / Pass Badges on card ──────────────────
  likeBadge: {
    position: 'absolute',
    top: 36,
    left: 20,
    borderWidth: 3,
    borderColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    transform: [{ rotate: '-12deg' }],
    backgroundColor: 'rgba(0,200,83,0.12)',
  },
  likeBadgeText: {
    color: '#00C853',
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 2,
  },
  passBadge: {
    position: 'absolute',
    top: 36,
    right: 20,
    borderWidth: 3,
    borderColor: '#FF4D6D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    transform: [{ rotate: '12deg' }],
    backgroundColor: 'rgba(255,77,109,0.12)',
  },
  passBadgeText: {
    color: '#FF4D6D',
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 2,
  },

  // ─── Action Buttons ───────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  actionBtnPass: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(255,77,109,0.2)',
  },
  actionBtnSuperLike: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(90,120,255,0.2)',
  },
  actionBtnLike: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(0,200,83,0.2)',
  },

  // ─── Empty State ─────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.3,
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

  // ─── Match Overlay ────────────────────────────────
  matchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  matchCard: {
    width: width * 0.85,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 16px 48px rgba(0,0,0,0.3)',
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  matchSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 28,
  },
  matchAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  matchAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  matchHeart: {
    marginHorizontal: 4,
  },
  matchBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  matchBtnText: {
    color: '#FF4D6D',
    fontWeight: '700',
    fontSize: 16,
  },
  matchBtnSecondary: {
    padding: 12,
  },
  matchBtnSecondaryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },

  // ─── Loading ──────────────────────────────────────
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
