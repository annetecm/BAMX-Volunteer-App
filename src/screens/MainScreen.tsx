import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';
import { TaskFilter, TaskItem, Task } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const MainScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'pendientes' | 'listo'>('pendientes');
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Separar los bienes', deadline: 'Mar 13, 2022', completed: false },
    { id: '2', title: 'Empaquetar despensas', deadline: 'Mar 13, 2022', completed: false },
    { id: '3', title: 'Limpieza del área', deadline: 'Mar 13, 2022', completed: true },
  ]);

  const [userName, setUserName] = useState<string>('Voluntario');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setLoadingUser(false); return; }

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as {
            fullName?: string;
            phone_number?: string | null;
            email?: string | null;
          };
          const name =
            (data.fullName && data.fullName.trim()) ||
            (data.phone_number && data.phone_number.trim()) ||
            (data.email && data.email.split('@')[0]) ||
            'Voluntario';
          setUserName(name);
        } else {
          const fallback =
            (user.displayName && user.displayName.trim()) ||
            (user.phoneNumber && user.phoneNumber.trim()) ||
            (user.email ? user.email.split('@')[0] : 'Voluntario');
          setUserName(fallback);
        }
      } catch (e: any) {
        Alert.alert('Error al cargar usuario', e?.message ?? 'Intenta nuevamente.');
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const filteredTasks = tasks.filter(t => (activeFilter === 'pendientes' ? !t.completed : t.completed));

  if (loadingUser) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <View style={[screenStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <Header
        userName={userName}
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
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
        userType="volunteer"
      />
    </SafeAreaView>
  );
};
