import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { VolunteerItem, Volunteer } from '../components/Task';
import { BottomNavigation } from '../components/BottomNavigation';
import { screenStyles } from '../styles/ScreenStyles';

export const VolunteerAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('volunteers');
  const [volunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Juan Luna Morales' },
    { id: '2', name: 'Fernanda Barragán' },
    { id: '3', name: 'Montserrat Chafufu' },
    { id: '4', name: 'Sarah Martínez' },
    { id: '5', name: 'Héctor Bellarín' },
  ]);

  const handleVolunteerPress = (volunteerId: string) => {
    console.log('Volunteer pressed:', volunteerId);
    // Navegar a los detalles del voluntario
  };

  const handleAddVolunteer = () => {
    console.log('Add volunteer pressed');
    // Navegar a la pantalla de agregar voluntario o mostrar modal
  };

  const handleBackPress = () => {
    console.log('Back pressed');
    // Navegar hacia atrás (a la pantalla de admin tasks)
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    console.log('Navegando a:', tab);
  };

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header 
        userName="Andrea"
        title="Administrador de tareas"
        // Removido showAddButton y onAddPress
      />
      
      <View style={screenStyles.adminContent}>
        <View style={screenStyles.volunteersSection}>
          <View style={screenStyles.volunteersSectionHeader}>
            <TouchableOpacity style={screenStyles.backButton} onPress={handleBackPress}>
              <Text style={screenStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={screenStyles.adminSectionVTitle}>Voluntarios</Text>
          </View>
          
          {/* Botón añadir voluntario movido aquí */}
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
        userType="admin" 
      />
    </SafeAreaView>
  );
};