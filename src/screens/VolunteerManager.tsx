import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { VolunteerItem, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerManager: undefined;
  RegisterScreen: undefined;
  VolunteerDetails: { volunteer: Volunteer };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VolunteerManager'>;

export const VolunteerManager: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('mailbox');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

useEffect(() => {
  const volunteerRef = collection(db, 'volunteers');
  const unsubscribe = onSnapshot(volunteerRef, (querySnapshot) => {
    const dataArray: Volunteer[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        fullName: data.fullName || 'Sin nombre',
        correo: data.correo || 'Sin información',
        emergency_phone: data.emergency_phone || 'Sin información',
        selected: data.selected ?? false,
        blood_type: data.blood_type,
        area: data.area,
        curp: data.curp,
        ine: data.ine

      };
    });
    setVolunteers(dataArray);
  });

  return () => unsubscribe();
}, []);

  const handleVolunteerPress = (volunteerId: string) => {
    const selected = volunteers.find((v) => v.id === volunteerId);
    if (selected) {
      navigation.navigate('VolunteerDetails', { volunteer: selected });
    }
  };

  const handleBackPress = () => {
    navigation.navigate('AdminTasks');
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
      <Header userName="Andrea" title="Administrador de tareas" />

      <View style={screenStyles.adminContent}>
        <View style={screenStyles.volunteersSection}>
          <View style={screenStyles.volunteersSectionHeader}>
            <TouchableOpacity style={screenStyles.backButton} onPress={handleBackPress}>
              <Text style={screenStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={screenStyles.adminSectionVTitle}>Voluntarios</Text>
          </View>

          <ScrollView
            style={screenStyles.volunteersList}
            contentContainerStyle={screenStyles.volunteersScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {volunteers.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                No hay voluntarios registrados.
              </Text>
            ) : (
              volunteers.map((volunteer) => (
                <VolunteerItem
                  key={volunteer.id}
                  volunteer={volunteer}
                  onPress={() => handleVolunteerPress(volunteer.id)}
                />
              ))
            )}
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
