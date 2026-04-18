import { StyleSheet } from 'react-native';

export const OTPVerifyStyles = StyleSheet.create({
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
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  phoneNumberText: {
    fontWeight: 'bold',
    color: '#333333',
  },

  // Code Input Area
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  // We use 6 digits because Firebase SMS codes are always 6 digits
  digitBox: {
    width: 45,
    height: 55,
    borderRadius: 28, // High border radius to make them circular/oval
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  digitBoxActive: {
    borderColor: '#FF4D6D',
    borderWidth: 2,
    backgroundColor: '#FFF0F3', // Very light pink tint
  },
  digitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  // Resend Code
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  resendText: {
    color: '#666666',
    fontSize: 14,
  },
  resendLink: {
    color: '#FF4D6D',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  // Primary Button
  verifyButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF4D6D',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  verifyButtonDisabled: {
    backgroundColor: '#FFB3C1', // Lighter pink when disabled
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
