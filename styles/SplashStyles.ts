import { StyleSheet } from 'react-native';

export const SplashStyles = StyleSheet.create({
  // 'container' wraps the whole screen
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  // 'logoContainer' groups the hearts and the Lynk text together
  logoContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    position: 'relative',
  },
  // 'logoText' styles the main "Lynk" title
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  // 'leftHeartIcon' styles the tilted heart on the left
  leftHeartIcon: {
    position: 'absolute',
    left: -40,
    top: -10,
    transform: [{ rotate: '-15deg' }],
    opacity: 0.9,
  },
  // 'rightHeartIcon' styles the tilted heart on the right
  rightHeartIcon: {
    position: 'absolute',
    right: -30,
    bottom: 5,
    transform: [{ rotate: '15deg' }],
    opacity: 0.9,
  },
  // 'subtitleText' styles the "Online Dating App" text below the logo
  subtitleText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9, 
  },
});
