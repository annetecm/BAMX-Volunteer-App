import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import VolunteerScreen from './src/screens/VolunteersScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Login from './src/screens/Login';
import RegisterScreen from './src/screens/RegisterScreen';
import { MainScreen } from './src/screens/MainScreen';
import { VolunteerAdmin } from './src/screens/VolunteerAdmin';
import { AdminTasksScreen } from './src/screens/AdminTasksScreen';
import { AddTaskScreen } from './src/screens/AddTaskScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import RegisterAdmin from './src/screens/RegisterAdmin'; 

import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './src/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  Register: undefined;
  AddTask: undefined;
  Settings: undefined;

  AdminTasks: undefined;  
  VolunteerAdmin: undefined;  
  RegisterScreen: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthGate() {
  const [init, setInit] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

React.useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    setUser(u);

    try {
      if (!u) { setInit(false); return; }

      // 1) Detecta admin por UID o por email como ID (ajusta según tu BD)
      let isAdmin = false;
      const adminByUid = await getDoc(doc(db, 'admins', u.uid));
      if (adminByUid.exists()) isAdmin = true;

      if (!isAdmin && u.email) {
        const adminByEmail = await getDoc(doc(db, 'admins', u.email.toLowerCase()));
        if (adminByEmail.exists()) isAdmin = true;
      }

      if (isAdmin) {
        // Admin: no crear/editar nada en "users"
        setInit(false);
        return;
      }

      // 2) Usuarios NO admin: solo verifica que exista el doc (no lo crees aquí)
      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);

      // Si necesitas crear por primera vez, hazlo SOLO en el flujo de registro,
      // no aquí. Aquí solo deja pasar o saca al usuario.
      if (!snap.exists()) {
        // Opcional: puedes desloguear y avisar
        // await signOut(auth);
        // Alert.alert('Cuenta no registrada', 'Contacta al administrador o regístrate.');
      }
    } catch (e) {
      // si hay error, no hagas nada destructivo aquí
      console.log(e);
    } finally {
      setInit(false);
    }
  });

  return unsub;
}, []);


  if (init) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AdminTasks" component={AdminTasksScreen} />
            <Stack.Screen name="VolunteerAdmin" component={VolunteerAdmin} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

            
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={RegisterAdmin} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <AuthGate />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});