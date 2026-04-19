import { StyleSheet } from 'react-native';

export const EmailAuthStyles = StyleSheet.create({
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
    marginBottom: 30,
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
  // Tab Switcher
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 4,
    marginBottom: 30,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  // Input Fields
  inputWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  passwordToggle: {
    padding: 5,
  },
  // Button
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF4D6D',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)',
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4D6D',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  }
});
