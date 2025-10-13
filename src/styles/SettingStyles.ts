import { StyleSheet, Platform, StatusBar } from 'react-native';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9b63', // Match header color so no white gap shows
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ff9b63',
    borderBottomRightRadius: 47,
    borderBottomLeftRadius: 44,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 30 : 60,
    paddingBottom: 35,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Remove the transform rotate - it's causing issues
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff', // White background for content area
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  logoutButton: {
    backgroundColor: '#FFB3A3',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    textAlign: 'center',
  },
  infoSection: {
    gap: 40,
  },
  infoItem: {
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  infoNumber: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    width: 30,
  },
  infoIconImage: {
    width: 24,
    height: 24,
    // Remove tintColor to show original icon colors
    // If icons still appear black, your PNG files might have transparency issues
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginLeft: 66,
    marginBottom: 15,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
});