import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { VolunteerItem, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  RegisterScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VolunteerAdmin'>;

export const VolunteerAdmin: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('mailbox');
  const [volunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Juan Luna Morales' },
    { id: '2', name: 'Fernanda Barragán' },
    { id: '3', name: 'Montserrat Chafufu' },
    { id: '4', name: 'Sarah Martínez' },
    { id: '5', name: 'Héctor Bellarín' },
  ]);

  const handleVolunteerPress = (volunteerId: string) => {
    console.log('Volunteer pressed:', volunteerId);
  };

  const handleAddVolunteer = () => {
    navigation.navigate('RegisterScreen');
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
      <Header 
        userName="Andrea"
        title="Administrador de tareas"
      />
      
      <View style={screenStyles.adminContent}>
        <View style={screenStyles.volunteersSection}>
          <View style={screenStyles.volunteersSectionHeader}>
            <TouchableOpacity style={screenStyles.backButton} onPress={handleBackPress}>
              <Text style={screenStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={screenStyles.adminSectionVTitle}>Voluntarios</Text>
          </View>
          
          <TouchableOpacity style={screenStyles.addVolunteerButton} onPress={handleAddVolunteer}>
            <Text style={screenStyles.addVolunteerButtonText}>Añadir voluntario +</Text>
          </TouchableOpacity>
          
          <ScrollView 
            style={screenStyles.volunteersList} 
            contentContainerStyle={screenStyles.volunteersScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {volunteers.map(volunteer => (
              <VolunteerItem 
                key={volunteer.id}
                volunteer={volunteer}
                onPress={() => handleVolunteerPress(volunteer.id)}
              />
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
    </SafeAreaView>
  );
};