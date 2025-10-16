import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { Task } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';
import { StatusBar } from 'expo-status-bar';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  TaskDetails: { task: any };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminTasks'>;

export const AdminTasksScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('mailbox');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Obtener tareas desde Firebase
  useEffect(() => {
    const taskRef = collection(db, "tasks");
    const unsubscribe = onSnapshot(taskRef, (querySnapshot) => {
      const dataArray = querySnapshot.docs.map((doc) => {
        const d = doc.data() as { 
          deadline?: any; [key: string]: any; title: any; type: any; description: any; completed: any; assistants: any; neededAssistants: any; 
        };
        let formattedDeadline = "";
        if (d.deadline && typeof d.deadline === "object" && "seconds" in d.deadline) {
          formattedDeadline = new Date((d.deadline as { seconds: number }).seconds * 1000).toLocaleDateString();
        }
        return { 
          id: doc.id,
          ...d, 
          deadline: formattedDeadline || "Sin fecha", 
         };
      });
      setTasks(dataArray);
    });

    return () => unsubscribe();
  }, []);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'settings') navigation.navigate('Settings');
    else if (tab === 'menu') navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header userName="Andrea" title="Administrador de tareas" />

      <View style={screenStyles.adminContent}>
        <View style={screenStyles.adminTaskSection}>
          <Text style={screenStyles.adminSectionTitle}>Tareas</Text>

          <ScrollView
            style={screenStyles.adminTaskList}
            contentContainerStyle={screenStyles.adminScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                onPress={() => navigation.navigate('TaskDetails', { task })}
                style={{
                  padding: 15,
                  marginVertical: 8,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#777' }}>{task.type}</Text>
                <Text style={{ color: '#777' }}>{task.deadline}</Text>
              </TouchableOpacity>
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
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};
