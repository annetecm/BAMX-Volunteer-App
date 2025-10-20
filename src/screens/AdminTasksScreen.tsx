import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, getDoc, Timestamp } from "firebase/firestore";
import { auth } from '../firebaseConfig';
import { taskStyles } from '../styles/TaskStyles';

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
  VolunteerManager: undefined;
  TaskDetails: { task: any };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminTasks'>;

export const AdminTasksScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('mailbox');
  const [tasks, setTasks] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('Usuario');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

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
            'Usuario';
          setUserName(name);
        } else {
          const fallback =
            (user.displayName && user.displayName.trim()) ||
            (user.phoneNumber && user.phoneNumber.trim()) ||
            (user.email ? user.email.split('@')[0] : 'Usuario');
          setUserName(fallback);
        }
      } catch (e: any) {
        Alert.alert('Error al cargar usuario', e?.message ?? 'Intenta nuevamente.');
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  useEffect(() => {
    const taskRef = collection(db, "tasks");
    const unsubscribe = onSnapshot(taskRef, (querySnapshot) => {
      const dataArray = querySnapshot.docs
        .map((doc) => {
          const d = doc.data() as any;

          if (d.completed) return null; 

          let deadlineDate: Date | null = null;
          if (d.deadline) {
            if (typeof d.deadline === "object" && "seconds" in d.deadline) {
              deadlineDate = new Date(d.deadline.seconds * 1000);
            } else if (typeof d.deadline === "string") {
              const parsedDate = new Date(d.deadline);
              if (!isNaN(parsedDate.getTime())) {
                deadlineDate = parsedDate;
              }
            }
          }

          return {
            id: doc.id,
            title: d.title || "Sin título",
            type: d.type || "Sin tipo",
            description: d.description || "Sin descripción",
            completed: d.completed ?? false,
            neededAssistants: d.neededAssistants ?? 0,
            deadline: deadlineDate ? deadlineDate.toLocaleString() : "Sin fecha",
            rawDeadline: deadlineDate,
          };
        })
        .filter(Boolean) as any[];

      dataArray.sort((a, b) => {
        if (!a.rawDeadline) return 1;
        if (!b.rawDeadline) return -1;
        return a.rawDeadline.getTime() - b.rawDeadline.getTime();
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

  if (loadingUser) {
    return (
      <SafeAreaView style={screenStyles.adminContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header userName={userName} title="Administrador de tareas" />

      <View style={screenStyles.adminContent}>
        <View style={screenStyles.adminTaskSection}>
          <Text style={screenStyles.adminSectionTitle}>Tareas pendientes</Text>

          <ScrollView
            style={screenStyles.adminTaskList}
            contentContainerStyle={screenStyles.adminScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                onPress={() => navigation.navigate('TaskDetails', { task })}
                style={taskStyles.adminTaskItem}
              >
                <Text style={taskStyles.adminTaskTitle}>{task.type}</Text>
                <Text style={{ color: '#777' }}>  {task.deadline}</Text>
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
        onNavigateToVolunteerAdmin={() => navigation.navigate('VolunteerAdmin')}
        onNavigateToVolunteerManager={() => navigation.navigate('VolunteerManager')}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};
