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
  progressLabel?: string; // Nueva prop para personalizar la etiqueta
}

export const Header: React.FC<HeaderProps> = ({ 
  userName, 
  title, 
  subtitle,
  showProgress = false, 
  progressPercentage = 0,
  showCalendar = false,
  showAddButton = false,
  onAddPress,
  progressLabel // Por defecto será "Tareas\nCompletadas"
}) => {
  // Determinar la etiqueta basada en el título o la prop personalizada
  const getProgressLabel = () => {
    if (progressLabel) return progressLabel;
    if (title.toLowerCase().includes('asistencia')) {
      return 'Porcentaje de\nAsistencia';
    }
    return 'Tareas\nCompletadas';
  };

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerContent}>
        <Image 
          source={require('../../assets/bamx-logo.png')} 
          style={headerStyles.logo}
          resizeMode="contain"
        />
        <View style={headerStyles.headerTextContainer}>
          <Text style={headerStyles.welcomeText}>Bienvenido {userName}!</Text>
          <Text style={headerStyles.headerTitle}>{title}</Text>
          {subtitle && <Text style={headerStyles.headerSubtitle}>{subtitle}</Text>}
        </View>
        
        {showAddButton && (
          <TouchableOpacity style={headerStyles.addButton} onPress={onAddPress}>
            <Text style={headerStyles.addButtonText}>Añadir voluntario +</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={headerStyles.secondRow}>
        {showProgress && (
          <View style={headerStyles.progressSection}>
            <View style={headerStyles.progressCircle}>
              <Text style={headerStyles.progressText}>{progressPercentage}%</Text>
            </View>
            <Text style={headerStyles.progressLabel}>{getProgressLabel()}</Text>
          </View>
        )}
        
        {showCalendar && (
          <View style={headerStyles.calendarWidget}>
            <Text style={headerStyles.calendarDate}>📅 Mar 25</Text>
          </View>
        )}
      </View>
    </View>
  );
};