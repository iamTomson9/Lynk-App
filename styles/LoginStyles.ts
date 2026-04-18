import { StyleSheet } from 'react-native';

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
    paddingHorizontal: 24,
    paddingTop: 60, // Safe area for top notch
    alignItems: 'center',
  },
  // Small Logo at the top
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerLogoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E82B73', // A strong pink color for the logo on white background
    letterSpacing: 1,
  },
  headerLeftHeart: {
    marginRight: 5,
    transform: [{ rotate: '-15deg' }],
  },
  headerRightHeart: {
    marginLeft: 5,
    transform: [{ rotate: '15deg' }],
  },
  
  // The center illustration (3 avatars)
  illustrationContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE6F0', // Light pink placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  avatarTopLeft: {
    top: 10,
    left: '20%',
  },
  avatarBottomLeft: {
    bottom: 10,
    left: '25%',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarRight: {
    top: '30%',
    right: '20%',
  },

  // Text content
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A', // Very dark gray, almost black
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666', // Medium gray for readability
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Button
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF4D6D', // Lynk primary pink
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10, // Space between icon and text
  },

  // Footer
  footerContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: 30,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF4D6D',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  }
});
