import { StyleSheet } from 'react-native';

export const PhoneAuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  // Small Logo at the top (re-used design)
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  headerLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E82B73',
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

  // Main Content
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 40,
    width: '80%',
  },

  // Input Field
  inputWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    // Add shadow to make it pop out like a physical card
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: 10,
    marginRight: 10,
  },
  flagText: {
    fontSize: 20,
    marginRight: 5,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },

  // Primary Button
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF4D6D',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)',
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999999',
    fontSize: 14,
    fontWeight: '600',
  },

  // Social Buttons
  socialButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  socialButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 15,
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
