import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';
import { TaskFilter, TaskItem, Task } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

export const MainScreen: React.FC = () => {
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
    // Aquí puedes manejar la navegación entre pantallas
    console.log('Navegando a:', tab);
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
      
      <ScrollView 
        style={screenStyles.content}
        contentContainerStyle={screenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        userType="volunteer" 
      />
    </SafeAreaView>
  );
};