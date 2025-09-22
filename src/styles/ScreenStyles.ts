import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const screenStyles = StyleSheet.create({
  // Volunteer screen container
  container: {
    flex: 1,
    backgroundColor: '#ff9456', // Orange background for volunteer screen
  },
  
  // Admin/Volunteers screen container
  adminContainer: {
    flex: 1,
    backgroundColor: '#ff9456', // Orange background for header
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Scroll content styles
  scrollContent: {
    paddingBottom: 120, // Ajustado para la nueva altura de navegación (100px)
  },
  
  // White section for task content
  whiteSection: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
    marginTop: 20,
    minHeight: screenHeight * 0.5, // Responsive height
  },
  
  // Task list container
  taskList: {
    marginTop: 15,
  },
  
  // Admin content area
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
    marginBottom:30,
  },

  adminSectionVTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom:5,
  },
  
  adminTaskList: {
    flex: 1,
  },
  
  adminScrollContent: {
    paddingBottom: 120, // Ajustado para la nueva altura de navegación (100px)
  },
  
  // Volunteers section styles
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
  },
  
  backButtonText: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },
  
  volunteersList: {
    flex: 1,
  },
  
  volunteersScrollContent: {
    paddingBottom: 120, // Ajustado para la nueva altura de navegación (100px)
  },
  
  // Nuevo estilo para el botón añadir voluntario
  addVolunteerButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  
  addVolunteerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});