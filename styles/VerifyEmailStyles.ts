import { StyleSheet } from 'react-native';

export const VerifyEmailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
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
  // Icon Container
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  // Main Content
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitleText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#E82B73',
  },
  // Button
  verifyButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF4D6D',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)',
    elevation: 5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Resend Link
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    color: '#666666',
    fontSize: 15,
  },
  resendLink: {
    color: '#FF4D6D',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  errorText: {
    color: '#FF4D6D',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  }
});
