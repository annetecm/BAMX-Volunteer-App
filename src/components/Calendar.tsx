import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { calendarStyles } from '../styles/CalendarStyles';

interface CalendarDay {
  day: number;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
}

export const Calendar: React.FC = () => {
  const [calendarDays] = useState<CalendarDay[]>([
    { day: 13, dayName: 'Mar', isSelected: false, isToday: false },
    { day: 14, dayName: 'Mie', isSelected: false, isToday: false },
    { day: 15, dayName: 'Jue', isSelected: true, isToday: true },
    { day: 16, dayName: 'Vie', isSelected: false, isToday: false },
    { day: 17, dayName: 'Sab', isSelected: false, isToday: false },
  ]);

  return (
    <View style={calendarStyles.calendar}>
      <FlatList
        data={calendarDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.day.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              calendarStyles.calendarDay,
              item.isSelected && calendarStyles.selectedDay,
              item.isToday && calendarStyles.todayDay,
            ]}
          >
            <Text style={[
              calendarStyles.dayNumber,
              item.isSelected && calendarStyles.selectedDayText,
            ]}>
              {item.day}
            </Text>
            <Text style={[
              calendarStyles.dayName,
              item.isSelected && calendarStyles.selectedDayText,
            ]}>
              {item.dayName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};