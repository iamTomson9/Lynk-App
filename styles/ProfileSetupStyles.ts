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
  intentCard: {
    width: '100%',
    minHeight: 118,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECE7F8',
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  intentCardActive: {
    backgroundColor: '#FF4D6D',
    borderColor: '#FF4D6D',
  },
  intentTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  intentTitleActive: {
    color: '#FFFFFF',
  },
  intentBody: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 19,
  },
  intentBodyActive: {
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E0EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#FFF0F3',
    borderColor: '#FF4D6D',
  },
  chipText: {
    color: '#5F586A',
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FF4D6D',
  },
  counterText: {
    color: '#777777',
    fontWeight: '700',
    textAlign: 'center',
  },
  summaryBox: {
    borderRadius: 18,
    backgroundColor: '#F8F4FF',
    borderWidth: 1,
    borderColor: '#E9DFFF',
    padding: 18,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#251047',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#51465F',
    lineHeight: 22,
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
