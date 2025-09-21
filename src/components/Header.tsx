import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { headerStyles } from '../styles/HeaderStyles';

interface HeaderProps {
  userName: string;
  title: string;
  subtitle?: string;
  showProgress?: boolean;
  progressPercentage?: number;
  showCalendar?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  userName, 
  title, 
  subtitle,
  showProgress = false, 
  progressPercentage = 0,
  showCalendar = false,
  showAddButton = false,
  onAddPress 
}) => {
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerContent}>
        <Image 
          source={require('../../assets/bamx-logo.png')} 
          style={headerStyles.logo}
          resizeMode="contain"
        />
        <View style={headerStyles.headerText}>
          <Text style={headerStyles.welcomeText}>Bienvenido {userName}!</Text>
          <Text style={headerStyles.headerTitle}>{title}</Text>
          {subtitle && <Text style={headerStyles.headerSubtitle}>{subtitle}</Text>}
        </View>
        
        {showAddButton && (
          <TouchableOpacity style={headerStyles.addButton} onPress={onAddPress}>
            <Text style={headerStyles.addButtonText}>Añadir voluntario +</Text>
          </TouchableOpacity>
        )}
        
        {showCalendar && (
          <View style={headerStyles.calendarWidget}>
            <Text style={headerStyles.calendarDate}>📅 Mar 25</Text>
          </View>
        )}
      </View>
      
      {showProgress && (
        <View style={headerStyles.progressSection}>
          <View style={headerStyles.progressCircle}>
            <Text style={headerStyles.progressText}>{progressPercentage}%</Text>
          </View>
          <Text style={headerStyles.progressLabel}>Tareas{'\n'}Completadas</Text>
        </View>
      )}
    </View>
  );
};