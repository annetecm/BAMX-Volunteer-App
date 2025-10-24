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
  VolunteerManager: undefined;
  VolunteerParticipation: { volunteerName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeFilter, setActiveFilter] = useState<'asistieron' | 'no-asistieron'>('asistieron');
  const [activeTab, setActiveTab] = useState('home');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [userName, setUserName] = useState<string>('Voluntario');
  const [userRole, setUserRole] = useState<string>('volunteer'); 
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as { fullName?: string; role?: string; phone_number?: string | null; email?: string | null };
          setUserName(data.fullName || user.displayName || 'Voluntario');
          setUserRole(data.role || 'volunteer');
        } else {
          setUserName(user.displayName || 'Voluntario');
          setUserRole('volunteer');
        }
      } catch (e: any) {
        Alert.alert('Error al cargar usuario', e?.message ?? 'Intenta nuevamente.');
        setUserRole('volunteer');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();
  }, []);

  const fetchVolunteersForDate = useCallback(async (date: Date) => {
  try {
    setLoading(true);
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    const volunteersNames = new Set<string>();

    for (const docSnap of tasksSnapshot.docs) {
      const data = docSnap.data();
      if (data.deadline?.toDate) {
        const taskDate = data.deadline.toDate();
        const sameDay =
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getDate() === today.getDate();

        if (sameDay) {
          const taskVolunteers: string[] = data.volunteers || [];

          for (const v of taskVolunteers) {
            const trimmed = v.trim();

            // Si contiene un espacio, lo tomamos tal cual (es un nombre)
            if (trimmed.includes(" ")) {
              volunteersNames.add(trimmed);
            } else {
              // Si NO tiene espacios, lo tratamos como un ID de la colección "volunteers"
              try {
                const volunteerDoc = await getDoc(doc(db, "volunteers", trimmed));
                if (volunteerDoc.exists()) {
                  const volunteerData = volunteerDoc.data();
                  const name = volunteerData?.fullName || trimmed;
                  volunteersNames.add(name);
                } else {
                  volunteersNames.add(trimmed); // En caso de no existir el doc
                }
              } catch (error) {
                console.warn("Error al buscar voluntario:", trimmed, error);
                volunteersNames.add(trimmed);
              }
            }
          }
        }
      }
    }

    const loadedVolunteers: Volunteer[] = Array.from(volunteersNames).map((name, index) => ({
      id: (index + 1).toString(),
      fullName: name,
      attended: true,
    }));

    setVolunteers(loadedVolunteers);
  } catch (e) {
    console.error("Error recargando voluntarios:", e);
    Alert.alert('Error', 'No se pudieron cargar los voluntarios.');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchVolunteersForDate(selectedDate);
  }, [selectedDate, fetchVolunteersForDate]);

  const handleDaySelect = (date: Date) => setSelectedDate(date);

  const attendedVolunteers = volunteers.filter(v => v.attended).length;
  const attendancePercentage = volunteers.length > 0 ? Math.round((attendedVolunteers / volunteers.length) * 100) : 0;
  const filteredVolunteers = volunteers.filter(v =>
    activeFilter === 'asistieron' ? v.attended : !v.attended
  );

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'settings') navigation.navigate('Settings');
    else if (tab === 'menu') navigation.navigate('Main');
  };

  if (loading) {
    return (
      <SafeAreaView style={screenStyles.container}>
        <View style={[screenStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#FF7A00" />
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
                onPress={() => navigation.navigate('VolunteerParticipation', { volunteerName: volunteer.fullName })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onNavigateToAddTask={() => navigation.navigate('AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')}
        onNavigateToVolunteerAdmin={() => navigation.navigate('VolunteerAdmin')}
        onNavigateToVolunteerManager={() => navigation.navigate('VolunteerManager')}
      />
    </SafeAreaView>
  );
};