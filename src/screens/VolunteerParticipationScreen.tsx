import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
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

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header userName="AdministradorTEMPORAL" title={`Participaciones de ${volunteerName}`} />

      <View style={screenStyles.adminContent}>
        <ScrollView
          style={screenStyles.adminTaskList}
          contentContainerStyle={screenStyles.adminScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 30 }} />
          ) : records.length === 0 ? (
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