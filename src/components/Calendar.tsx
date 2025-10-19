import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { calendarStyles } from '../styles/CalendarStyles';

interface CalendarDay {
  day: number;
  dayName: string;
  date: Date;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarProps {
  onDaySelect?: (date: Date) => void;
  selectedDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ onDaySelect, selectedDate }) => {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const today = new Date();
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const generatedDays: CalendarDay[] = [];

    for (let offset = -2; offset <= 2; offset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);

      const day = date.getDate();
      const dayName = daysOfWeek[date.getDay()];

      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate
        ? date.toDateString() === selectedDate.toDateString()
        : isToday;

      generatedDays.push({ day, dayName, date, isToday, isSelected });
    }

    setCalendarDays(generatedDays);
  }, [selectedDate]);

  const handleDayPress = (date: Date) => {
    setCalendarDays(prev =>
      prev.map(d => ({ ...d, isSelected: d.date.toDateString() === date.toDateString() }))
    );
    if (onDaySelect) onDaySelect(date);
  };

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
              item.isToday && calendarStyles.todayDay,       
              item.isSelected && calendarStyles.selectedDay, 
            ]}
            onPress={() => handleDayPress(item.date)}
          >
            <Text
              style={[
                calendarStyles.dayNumber,
                (item.isSelected || item.isToday) && calendarStyles.selectedDayText,
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                calendarStyles.dayName,
                (item.isSelected || item.isToday) && calendarStyles.selectedDayText,
              ]}
            >
              {item.dayName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};