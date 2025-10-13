import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomNavigation } from '../components/BottomNavigation';
import { addTaskStyles } from '../styles/AddTaskStyles';

interface Volunteer {
  id: string;
  name: string;
  selected: boolean;
}

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined; 
  VolunteerAdmin: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

export const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskName, setTaskName] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Miguel Mendoza', selected: false },
    { id: '2', name: 'Flor Gutiérrez', selected: false },
    { id: '3', name: 'Daniel Wynter', selected: false },
    { id: '4', name: 'Anett Zepeda', selected: false },
  ]);

  const toggleVolunteer = (volunteerId: string) => {
    setVolunteers(prev =>
      prev.map(v => (v.id === volunteerId ? { ...v, selected: !v.selected } : v))
    );
  };

  const handleCreateTask = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la tarea');
      return;
    }
    if (!timeInterval.trim()) {
      Alert.alert('Error', 'Por favor ingresa el intervalo de tiempo');
      return;
    }
    
    const selectedVolunteers = volunteers.filter(v => v.selected);
    if (selectedVolunteers.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un voluntario');
      return;
    }

    Alert.alert('Éxito', 'Tarea creada correctamente');
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={addTaskStyles.container}>
      <ScrollView
        style={addTaskStyles.scrollView}
        contentContainerStyle={addTaskStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={addTaskStyles.mainTitle}>Nueva Tarea</Text>

        <View style={addTaskStyles.orangeContainer}>
          <View style={addTaskStyles.inputRow}>
            <Text style={addTaskStyles.inputIcon}>📋</Text>
            <TextInput
              style={addTaskStyles.input}
              placeholder="Nombre"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          <View style={addTaskStyles.inputRow}>
            <Text style={addTaskStyles.inputIcon}>⏰</Text>
            <TextInput
              style={addTaskStyles.input}
              placeholder="Intervalo de tiempo para finalización"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={timeInterval}
              onChangeText={setTimeInterval}
            />
          </View>
        </View>

        <View style={addTaskStyles.volunteersContainer}>
          <Text style={addTaskStyles.volunteersTitle}>Voluntarios participantes:</Text>

          {volunteers.map(volunteer => (
            <TouchableOpacity 
              key={volunteer.id} 
              style={[
                addTaskStyles.volunteerCard,
                volunteer.selected && addTaskStyles.volunteerCardSelected
              ]}
              onPress={() => toggleVolunteer(volunteer.id)}
            >
              <View style={addTaskStyles.avatar}>
                <Text style={addTaskStyles.avatarText}>
                  {volunteer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={addTaskStyles.volunteerName}>{volunteer.name}</Text>
              <View style={addTaskStyles.plusButton}>
                <Text style={addTaskStyles.plusText}>
                  {volunteer.selected ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={addTaskStyles.createButton}
          onPress={handleCreateTask}
        >
          <Text style={addTaskStyles.createButtonText}>Crear Tarea</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab === 'settings') {
            navigation.navigate('Settings');
          } else if (tab === 'menu') {
            navigation.navigate('Main');
          }
          setActiveTab(tab);
        }}
        onNavigateToAddTask={() => {
          console.log('Ya estás en AddTask');
        }}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')} 
      />
    </SafeAreaView>
  );
};