import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';
import { TaskFilter, VolunteerItem, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined; // ✅ Agregada
  VolunteerAdmin: undefined; // ✅ Agregada
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeFilter, setActiveFilter] = useState<'asistieron' | 'no-asistieron'>('asistieron');
  const [activeTab, setActiveTab] = useState('home');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Juan Pérez', attended: true },
    { id: '2', name: 'María González', attended: true },
    { id: '3', name: 'Carlos Rodríguez', attended: false },
    { id: '4', name: 'Ana Martínez', attended: true },
    { id: '5', name: 'Luis Hernández', attended: false },
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

  const handleVolunteerPress = (volunteerId: string) => {
    console.log('Voluntario seleccionado:', volunteerId);
  };

  const attendedVolunteers = volunteers.filter(v => v.attended).length;
  const attendancePercentage = Math.round((attendedVolunteers / volunteers.length) * 100);
  const filteredVolunteers = volunteers.filter(v => 
    activeFilter === 'asistieron' ? v.attended : !v.attended
  );

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
        title="Registro de asistencias"
        showProgress
        progressPercentage={attendancePercentage}
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
            completedCount={attendedVolunteers}
            totalCount={volunteers.length}
          />

          <View style={screenStyles.taskList}>
            {filteredVolunteers.map(volunteer => (
              <VolunteerItem 
                key={volunteer.id} 
                volunteer={volunteer} 
                onPress={() => handleVolunteerPress(volunteer.id)} 
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab === 'settings') {
            navigation.navigate('Settings');
          }
          setActiveTab(tab);
        }}
        onNavigateToAddTask={() => navigation.navigate('AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')} // ✅ Buzón a AdminTasks
      />
    </SafeAreaView>
  );
};