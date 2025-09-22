import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VolunteerScreen from './src/screens/VolunteersScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Login from './src/screens/Login';
import RegisterScreen from './src/screens/RegisterScreen';
import {MainScreen} from './src/screens/MainScreen';
import {VolunteerAdmin} from './src/screens/VolunteerAdmin';
import {AdminTasksScreen} from './src/screens/AdminTasksScreen';

export default function App() {
    return <AdminTasksScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
