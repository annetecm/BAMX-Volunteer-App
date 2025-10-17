import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomNavigation } from '../components/BottomNavigation';
import { addTaskStyles } from '../styles/AddTaskStyles';
import * as Yup from 'yup';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc } from "firebase/firestore";

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

interface Volunteer {
  id: string;
  name: string;
  selected: boolean;
}

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerManager: undefined;
  RegisterScreen: undefined;
  VolunteerDetails: { volunteer: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

const taskSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(5, 'El nombre de la tarea es demasiado corto')
    .max(50, 'El nombre de la tarea es demasiado largo'),
  description: Yup.string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(150, 'La descripción es demasiado larga'),
  neededAssistants: Yup.number()
    .required('Debes indicar la cantidad de voluntarios necesarios')
    .min(1, 'Debe ser al menos 1')
});

// Función para sanitizar texto
function sanitizeText(text: string, maxLen = 150) {
  if (!text) return '';
  const normalized = text.normalize ? text.normalize('NFC') : text;
  return normalized.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü\s\.,()]/g, '').trim().slice(0, maxLen);
}

export const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('tasks');

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [neededAssistants, setNeededAssistants] = useState('');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const volunteerRef = collection(db, 'volunteers');
    const unsubscribe = onSnapshot(volunteerRef, (querySnapshot) => {
      const dataArray: Volunteer[] = querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as any;
          return { 
            id: doc.id, 
            name: data.fullName || 'Sin nombre',
            selected: data.selected ?? false 
          };
        })
        .filter(v => !v.selected); 
      setVolunteers(dataArray);
    });
    return () => unsubscribe();
  }, []);

  const selectedCount = volunteers.filter(v => v.selected).length;

  const toggleVolunteer = (volunteerId: string) => {
    setVolunteers(prev =>
      prev.map(v => {
        if (v.id === volunteerId) {
          if (!v.selected && selectedCount >= Number(neededAssistants || 0)) {
            Alert.alert('Límite alcanzado', 'No puedes seleccionar más voluntarios que los necesarios.');
            return v;
          }
          return { ...v, selected: !v.selected };
        }
        return v;
      })
    );
  };

  const handleCreateTask = async () => {
    const safeName = sanitizeText(taskName, 50);
    const safeDescription = sanitizeText(taskDescription, 150);
    const safeAssistants = Number(neededAssistants);

    try {
      await taskSchema.validate({
        name: safeName,
        description: safeDescription,
        neededAssistants: safeAssistants,
      }, { abortEarly: false });
    } catch (err: any) {
      const msg = err.errors ? err.errors.join('\n') : err.message;
      Alert.alert('Errores en el formulario', msg);
      return;
    }

    const selectedVolunteers = volunteers.filter(v => v.selected);
    if (selectedVolunteers.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un voluntario');
      return;
    }

    try {
      const tasksCollection = collection(db, 'tasks');
      const newTask = {
        type: safeName,
        description: safeDescription,
        neededAssistants: safeAssistants,
        deadline: null,
        completed: false,
        volunteers: selectedVolunteers.map(v => v.id)
      };

      const docRef = await addDoc(tasksCollection, newTask);

      for (const volunteer of selectedVolunteers) {
        const volunteerRef = doc(db, 'volunteers', volunteer.id);
        await updateDoc(volunteerRef, { selected: true });
      }

      console.log('Tarea creada con ID: ', docRef.id);
      Alert.alert('Éxito', 'La tarea fue creada correctamente');

      setTaskName('');
      setTaskDescription('');
      setNeededAssistants('');
      setVolunteers(prev => prev.map(v => ({ ...v, selected: false })));

      navigation.navigate('Main');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', 'No se pudo crear la tarea: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={addTaskStyles.container}>
      <ScrollView
        style={addTaskStyles.scrollView}
        contentContainerStyle={addTaskStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={addTaskStyles.mainTitle}>Nueva Tarea</Text>

        <View style={addTaskStyles.orangeContainer}>
          <View style={addTaskStyles.inputRow}>
            <TextInput
              style={addTaskStyles.input}
              placeholder="Nombre de la tarea"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          <View style={[addTaskStyles.inputRow, { height: 80 }]}>
            <TextInput
              style={[addTaskStyles.input, { height: 80 }]}
              placeholder="Descripción de la tarea"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              multiline
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
          </View>

          <View style={addTaskStyles.inputRow}>
            <TextInput
              style={addTaskStyles.input}
              placeholder="Voluntarios necesarios"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              keyboardType="numeric"
              value={neededAssistants}
              onChangeText={setNeededAssistants}
            />
          </View>
        </View>

        <Text style={addTaskStyles.volunteersTitle}>
          Voluntarios disponibles ({selectedCount}/{neededAssistants || 0})
        </Text>

        <View style={addTaskStyles.volunteersContainer}>
          {volunteers.length === 0 ? (
            <Text style={{ color: '#777', textAlign: 'center' }}>
              No hay voluntarios disponibles.
            </Text>
          ) : (
            volunteers.map(volunteer => (
              <TouchableOpacity 
                key={volunteer.id} 
                style={[
                  addTaskStyles.volunteerCard,
                  volunteer.selected && addTaskStyles.volunteerCardSelected
                ]}
                onPress={() => toggleVolunteer(volunteer.id)}
              >
                <View style={addTaskStyles.avatar}>
                  <Text style={addTaskStyles.avatarText}>
                    {volunteer.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={addTaskStyles.volunteerName}>{volunteer.name}</Text>
                <View style={addTaskStyles.plusButton}>
                  <Text style={addTaskStyles.plusText}>
                    {volunteer.selected ? '−' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity 
          style={addTaskStyles.createButton}
          onPress={handleCreateTask}
        >
          <Text style={addTaskStyles.createButtonText}>Crear Tarea</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab === 'settings') navigation.navigate('Settings');
          else if (tab === 'menu') navigation.navigate('Main');
          setActiveTab(tab);
        }}
        onNavigateToAddTask={() => console.log('Ya estás en AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')} 
      />
    </SafeAreaView>
  );
};
