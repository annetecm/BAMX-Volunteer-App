import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  calendar: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  calendarDay: {
    backgroundColor: '#a2cc72',
    borderRadius: 25,
    width: 50,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedDay: {
    backgroundColor: '#ffffff',
    height: 100,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  todayDay: {
    backgroundColor: '#ffffff',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dayName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  selectedDayText: {
    color: '#000000',
  },
});