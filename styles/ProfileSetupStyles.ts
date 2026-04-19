import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ProfileSetupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  // Progress Bar
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF4D6D',
    borderRadius: 3,
  },
  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 30,
    lineHeight: 22,
  },
  // Inputs
  inputWrapper: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
  },
  textInput: {
    fontSize: 16,
    color: '#333333',
    width: '100%',
  },
  // Option Selectors (Gender / Interested In)
  optionButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionButtonActive: {
    borderColor: '#FF4D6D',
    backgroundColor: '#FFF0F3',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  optionTextActive: {
    color: '#FF4D6D',
  },
  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoBox: {
    width: (width - 48 - 15) / 2, // 2 columns with 15px gap
    height: (width - 48 - 15) / 2,
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  addPhotoIcon: {
    backgroundColor: '#FF4D6D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 5px rgba(255, 77, 109, 0.3)',
  },
  deletePhotoIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Buttons
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    height: 60,
    marginLeft: 15,
    backgroundColor: '#FF4D6D',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.3)',
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: '#FFB3C1',
    boxShadow: '0px 4px 10px rgba(255, 77, 109, 0.1)',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
