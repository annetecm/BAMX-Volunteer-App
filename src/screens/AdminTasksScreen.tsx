import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { AdminTaskItem, Task } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminTasks'>;

export const AdminTasksScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('mailbox');
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Separar los bienes', deadline: 'Mar 13, 2022', completed: false, assistants: 1 },
    { id: '2', title: 'Empaquetar despensas', deadline: 'Mar 13, 2022', completed: false, assistants: 2 },
    { id: '3', title: 'Limpieza de área', deadline: 'Mar 13, 2022', completed: false, assistants: 2 },
    { id: '4', title: 'Hacer inventario', deadline: 'Mar 13, 2022', completed: false, assistants: 5 },
    { id: '5', title: 'Kilo de manzanas', deadline: 'Mar 13, 2022', completed: false, assistants: 5 },
  ]);

  const handleTaskPress = (taskId: string) => {
    console.log('Task pressed:', taskId);
    // ✅ Navegar a VolunteerAdmin al tocar una tarea
    navigation.navigate('VolunteerAdmin');
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'settings') {
      navigation.navigate('Settings');
    } else if (tab === 'menu') {
      navigation.navigate('Main');
    }
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
                onArrowPress={() => handleTaskPress(task.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        onNavigateToAddTask={() => navigation.navigate('AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')}
      />
    </SafeAreaView>
  );
};