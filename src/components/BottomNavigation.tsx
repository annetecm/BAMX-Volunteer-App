import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { bottomNavStyles } from '../styles/BottomNavStyles';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={bottomNavStyles.bottomNav}>
      <TouchableOpacity 
        style={bottomNavStyles.navItem}
        onPress={() => onTabPress('menu')}
      >
        <Text style={bottomNavStyles.navIcon}>☰</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={bottomNavStyles.navItem}
        onPress={() => onTabPress('add')}
      >
        <Text style={bottomNavStyles.navIcon}>+</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[bottomNavStyles.navItem, bottomNavStyles.centerNavItem]}
        onPress={() => onTabPress('home')}
      >
        <View style={bottomNavStyles.centerIcon}>
          <Text style={bottomNavStyles.centerIconText}>🍎</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={bottomNavStyles.navItem}
        onPress={() => onTabPress('tasks')}
      >
        <Text style={bottomNavStyles.navIcon}>📋</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={bottomNavStyles.navItem}
        onPress={() => onTabPress('settings')}
      >
        <Text style={bottomNavStyles.navIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};