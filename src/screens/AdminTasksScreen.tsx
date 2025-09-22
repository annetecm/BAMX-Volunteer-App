import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { Header } from '../components/Header';
import { AdminTaskItem, Task } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

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
    // Navegar a los detalles de la tarea o mostrar voluntarios asignados
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Aquí puedes manejar la navegación entre pantallas
    console.log('Navegando a:', tab);
  };

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header 
        userName="Andrea"
        title="Administrador de tareas"
      />
      
      <View style={screenStyles.adminContent}>
        <View style={screenStyles.adminTaskSection}>
          <Text style={screenStyles.adminSectionTitle}>Tareas</Text>
          
          <ScrollView 
            style={screenStyles.adminTaskList} 
            contentContainerStyle={screenStyles.adminScrollContent}
            showsVerticalScrollIndicator={false}
          >
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
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        userType="admin" 
      />
    </SafeAreaView>
  );
};