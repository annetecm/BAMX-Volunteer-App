import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VolunteerScreen from './src/screens/VolunteersScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Login from './src/screens/Login';
import RegisterScreen from './src/screens/RegisterScreen';
import { MainScreen } from './src/screens/MainScreen';

export default function App() {
    return <MainScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
