import { StyleSheet } from 'react-native';

export const taskStyles = StyleSheet.create({
  // Task Filter Styles
  taskFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Poppins-Bold',
  },
  taskCount: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 2,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 25,
    padding: 4,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: '#ffffff',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000000',
  },
  
  // Task Item Styles
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 10,
  },
  taskCheckbox: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioInnerSelected: {
    backgroundColor: '#4CAF50',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  deadlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
    marginRight: 8,
  },
  deadlineText: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  deadlineDate: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '400',
  },
  assistantsText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 2,
  },
  taskAction: {
    padding: 10,
  },
  actionIcon: {
    fontSize: 18,
    color: '#666',
  },
  
  // Admin Task Styles
  adminTaskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  adminTaskIconText: {
    fontSize: 20,
    color: '#666',
  },
  adminTaskContent: {
    flex: 1,
  },
  adminTaskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  adminTaskAssistants: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  adminTaskAction: {
    padding: 10,
  },
  adminActionIcon: {
    fontSize: 18,
    color: '#666',
  },
  
  // Volunteer Styles
  volunteerItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  volunteerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  volunteerIconText: {
    fontSize: 20,
    color: '#666',
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
});