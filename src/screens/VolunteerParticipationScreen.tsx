import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerManager: undefined;
  VolunteerParticipation: { volunteerName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VolunteerParticipation'>;

interface Attendance {
  id: string;
  name: string;
  date: string;
}

export const VolunteerParticipationScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { volunteerName } = route.params as { volunteerName: string };

  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mailbox');

  // --- Cargar participaciones ---
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const q = query(collection(db, 'attendance'), where('name', '==', volunteerName));
        const snapshot = await getDocs(q);
        const data: Attendance[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '',
          date: doc.data().date || '',
        }));
        setRecords(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        Alert.alert('Error', 'No se pudieron cargar las participaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [volunteerName]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'settings') navigation.navigate('Settings');
    else if (tab === 'menu') navigation.navigate('Main');
  };

  if (loading) {
    return (
      <SafeAreaView style={screenStyles.adminContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF7A00" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header
        userName={volunteerName} // Mostrar nombre del voluntario en lugar de usuario actual
        title={`Participaciones de ${volunteerName}`}
      />

      <View style={screenStyles.adminContent}>
        <ScrollView
          style={screenStyles.adminTaskList}
          contentContainerStyle={screenStyles.adminScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {records.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>
              No se encontraron participaciones.
            </Text>
          ) : (
            records.map((r) => (
              <View
                key={r.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  marginVertical: 6,
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{r.name}</Text>
                <Text style={{ color: '#555', marginTop: 4 }}>Fecha: {r.date}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Ya no enviamos role: BottomNavigation lo obtiene desde Firebase */}
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
