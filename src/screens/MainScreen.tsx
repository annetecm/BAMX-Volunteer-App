import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';
import { TaskFilter, VolunteerItem, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerParticipation: { volunteerName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeFilter, setActiveFilter] = useState<'asistieron' | 'no-asistieron'>('asistieron');
  const [activeTab, setActiveTab] = useState('home');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [userName, setUserName] = useState<string>('Voluntario');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingVolunteers, setLoadingVolunteers] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setLoadingUser(false); return; }

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as { fullName?: string; phone_number?: string | null; email?: string | null; };
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

  const fetchVolunteersForDate = useCallback(async (date: Date) => {
    try {
      setLoadingVolunteers(true);
      const today = new Date(date);
      today.setHours(0, 0, 0, 0);

      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const volunteersNames = new Set<string>();

      tasksSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.deadline?.toDate) {
          const taskDate = data.deadline.toDate();
          const sameDay =
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getDate() === today.getDate();

          if (sameDay) {
            (data.volunteers || []).forEach((name: string) =>
              volunteersNames.add(name.trim())
            );
          }
        }
      });

      const loadedVolunteers: Volunteer[] = Array.from(volunteersNames).map((name, index) => ({
        id: (index + 1).toString(),
        name,
        attended: true,
      }));

      setVolunteers(loadedVolunteers);
    } catch (e) {
      console.error("Error recargando voluntarios:", e);
      Alert.alert('Error', 'No se pudieron cargar los voluntarios.');
    } finally {
      setLoadingVolunteers(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteersForDate(selectedDate);
  }, [selectedDate, fetchVolunteersForDate]);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  const attendedVolunteers = volunteers.filter(v => v.attended).length;
  const attendancePercentage = Math.round((attendedVolunteers / volunteers.length) * 100);
  const filteredVolunteers = volunteers.filter(v =>
    activeFilter === 'asistieron' ? v.attended : !v.attended
  );

  if (loadingUser || loadingVolunteers) {
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
        <Calendar onDaySelect={handleDaySelect} selectedDate={selectedDate} />

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
                onPress={() => navigation.navigate('VolunteerParticipation', { volunteerName: volunteer.name })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab === 'settings') navigation.navigate('Settings');
          setActiveTab(tab);
        }}
        onNavigateToAddTask={() => navigation.navigate('AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')}
      />
    </SafeAreaView>
  );
};