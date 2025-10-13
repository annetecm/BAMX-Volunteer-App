import { StyleSheet } from 'react-native';

export const taskStyles = StyleSheet.create({
  // Task Filter
  taskFilter: {
    marginBottom: 20,
  },
  taskInfo: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 13,
    color: '#666666',
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 3,
    alignSelf: 'flex-start',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
  },
  activeFilterButton: {
    backgroundColor: '#000000',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },

  // Task Item
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioInnerSelected: {
    backgroundColor: '#4CAF50',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginRight: 6,
  },
  deadlineText: {
    fontSize: 12,
    color: '#666666',
  },
  deadlineDate: {
    fontWeight: '600',
  },
  assistantsText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  taskAction: {
    padding: 8,
  },
  actionIcon: {
    fontSize: 20,
    color: '#666666',
  },

  // Admin Task Item
  adminTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminTaskIconText: {
    fontSize: 20,
    color: '#666666',
  },
  adminTaskContent: {
    flex: 1,
  },
  adminTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  adminTaskAssistants: {
    fontSize: 12,
    color: '#666666',
  },
  adminTaskAction: {
    padding: 8,
  },
  adminActionIcon: {
    fontSize: 20,
    color: '#666666',
  },

  // Volunteer Item
  volunteerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  volunteerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  volunteerIconText: {
    fontSize: 20,
    color: '#666666',
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
});