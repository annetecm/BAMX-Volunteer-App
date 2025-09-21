import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';
import { TaskFilter, TaskItem, AdminTaskItem, VolunteerItem, Task, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

// Volunteer Tasks Screen (Left screen)
export const VolunteerTasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'pendientes' | 'listo'>('pendientes');
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Separar los bienes', deadline: 'Mar 13, 2022', completed: false },
    { id: '2', title: 'Empaquetar despensas', deadline: 'Mar 13, 2022', completed: false },
    { id: '3', title: 'Limpieza del área', deadline: 'Mar 13, 2022', completed: true },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const filteredTasks = tasks.filter(task => 
    activeFilter === 'pendientes' ? !task.completed : task.completed
  );

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header 
        userName="Juan"
        title="Explorador de tareas"
        showProgress
        progressPercentage={Math.round((completedTasks / tasks.length) * 100)}
        showCalendar
      />
      
      <ScrollView style={screenStyles.content}>
        <Calendar />
        
        <View style={screenStyles.whiteSection}>
          <TaskFilter 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            completedCount={completedTasks}
            totalCount={tasks.length}
          />
          
          <View style={screenStyles.taskList}>
            {filteredTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// Admin Tasks Screen (Middle screen)
export const AdminTasksScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Separar los bienes', deadline: 'Mar 13, 2022', completed: false, assistants: 1 },
    { id: '2', title: 'Empaquetar despensas', deadline: 'Mar 13, 2022', completed: false, assistants: 2 },
    { id: '3', title: 'Limpieza de área', deadline: 'Mar 13, 2022', completed: false, assistants: 2 },
    { id: '4', title: 'Hacer inventario', deadline: 'Mar 13, 2022', completed: false, assistants: 5 },
    { id: '5', title: 'Kilo de manzanas', deadline: 'Mar 13, 2022', completed: false, assistants: 5 },
  ]);

  const handleTaskPress = (taskId: string) => {
    console.log('Task pressed:', taskId);
    // Navigate to task details or handle task interaction
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <View style={screenStyles.adminHeader}>
        <Header 
          userName="Andrea"
          title="Administrador de tareas"
        />
      </View>
      
      <View style={screenStyles.adminContent}>
        <View style={screenStyles.adminTaskSection}>
          <Text style={screenStyles.adminSectionTitle}>Tareas</Text>
          
          <ScrollView style={screenStyles.adminTaskList} showsVerticalScrollIndicator={false}>
            {tasks.map(task => (
              <AdminTaskItem 
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// Volunteers Screen (Right screen)
export const VolunteersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [volunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Juan Luna Morales' },
    { id: '2', name: 'Fernanda Barragán' },
    { id: '3', name: 'Montserrat Chafufu' },
    { id: '4', name: 'Sarah Martínez' },
    { id: '5', name: 'Héctor Bellarín' },
  ]);

  const handleVolunteerPress = (volunteerId: string) => {
    console.log('Volunteer pressed:', volunteerId);
    // Navigate to volunteer details or handle volunteer interaction
  };

  const handleAddVolunteer = () => {
    console.log('Add volunteer pressed');
    // Navigate to add volunteer screen or show modal
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <View style={screenStyles.adminHeader}>
        <Header 
          userName="Andrea"
          title="Administrador de tareas"
          showAddButton
          onAddPress={handleAddVolunteer}
        />
      </View>
      
      <View style={screenStyles.adminContent}>
        <View style={screenStyles.volunteersSection}>
          <View style={screenStyles.volunteersSectionHeader}>
            <TouchableOpacity style={screenStyles.backButton}>
              <Text style={screenStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={screenStyles.adminSectionTitle}>Voluntarios</Text>
          </View>
          
          <ScrollView style={screenStyles.volunteersList} showsVerticalScrollIndicator={false}>
            {volunteers.map(volunteer => (
              <VolunteerItem 
                key={volunteer.id}
                volunteer={volunteer}
                onPress={() => handleVolunteerPress(volunteer.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// Main App Component to demonstrate all screens
export const MainScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'volunteer' | 'admin' | 'volunteers'>('volunteer');

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'volunteer':
        return <VolunteerTasksScreen />;
      case 'admin':
        return <AdminTasksScreen />;
      case 'volunteers':
        return <VolunteersScreen />;
      default:
        return <VolunteerTasksScreen />;
    }
  };

  return (
    <View style={screenStyles.mainContainer}>
      {/* Development navigation buttons - remove in production */}
      <View style={screenStyles.devNavigation}>
        <TouchableOpacity 
          style={[screenStyles.devButton, currentScreen === 'volunteer' && screenStyles.devButtonActive]}
          onPress={() => setCurrentScreen('volunteer')}
        >
          <Text style={screenStyles.devButtonText}>Volunteer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[screenStyles.devButton, currentScreen === 'admin' && screenStyles.devButtonActive]}
          onPress={() => setCurrentScreen('admin')}
        >
          <Text style={screenStyles.devButtonText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[screenStyles.devButton, currentScreen === 'volunteers' && screenStyles.devButtonActive]}
          onPress={() => setCurrentScreen('volunteers')}
        >
          <Text style={screenStyles.devButtonText}>Volunteers</Text>
        </TouchableOpacity>
      </View>
      
      {renderCurrentScreen()}
    </View>
  );
};