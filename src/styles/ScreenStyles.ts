import { StyleSheet } from 'react-native';

export const screenStyles = StyleSheet.create({
  // Main container styles
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#ff9456', // Orange background for volunteer screen
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // White section for task content
  whiteSection: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
    marginTop: 20,
    flex: 1,
    minHeight: 400,
  },
  
  // Task list container
  taskList: {
    marginTop: 15,
    paddingBottom: 100, // Space for bottom navigation
  },
  
  // Admin screen specific styles
  adminHeader: {
    backgroundColor: '#ff9456', // Orange background
    paddingBottom: 10,
  },
  
  adminContent: {
    flex: 1,
    backgroundColor: '#e8f4f8', // Light blue background
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  
  adminTaskSection: {
    flex: 1,
  },
  
  adminSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  
  adminTaskList: {
    flex: 1,
    paddingBottom: 100, // Space for bottom navigation
  },
  
  // Volunteers screen specific styles
  volunteersSection: {
    flex: 1,
  },
  
  volunteersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  
  volunteersList: {
    flex: 1,
    paddingBottom: 100, // Space for bottom navigation
  },
  
  // Development navigation (remove in production)
  devNavigation: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  
  devButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#666',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  
  devButtonActive: {
    backgroundColor: '#ff9456',
  },
  
  devButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});