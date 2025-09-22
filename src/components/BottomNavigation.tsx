import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { bottomNavStyles } from '../styles/BottomNavStyles';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  userType: 'volunteer' | 'admin'; // Nueva prop para tipo de usuario
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onTabPress, 
  userType 
}) => {
  
  // Configuración de iconos según el tipo de usuario
  const getNavConfig = () => {
    if (userType === 'admin') {
      return [
        {
          key: 'menu',
          icon: require('../../assets/menu.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'tasks',
          icon: require('../../assets/add.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'home',
          icon: require('../../assets/apple.png'),
          isCenter: true,
        },
        {
          key: 'volunteers',
          icon: require('../../assets/box.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'settings',
          icon: require('../../assets/settings.png'),
          activeIcon: require('../../assets/active.png'),
        },
      ];
    } else {
      // Configuración para voluntarios
      return [
        {
          key: 'menu',
          icon: require('../../assets/menu.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'qr',
          icon: require('../../assets/qr.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'home',
          icon: require('../../assets/apple.png'),
          isCenter: true,
        },
        {
          key: 'rewards',
          icon: require('../../assets/rewards.png'),
          activeIcon: require('../../assets/active.png'),
        },
        {
          key: 'settings',
          icon: require('../../assets/settings.png'),
          activeIcon: require('../../assets/active.png'),
        },
      ];
    }
  };

  const navItems = getNavConfig();

  return (
    <View style={bottomNavStyles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        const iconSource = isActive ? item.activeIcon : item.icon;
        
        if (item.isCenter) {
          // Botón central especial (solo decorativo, no funcional)
          return (
            <View
              key={item.key}
              style={[bottomNavStyles.navItem, bottomNavStyles.centerNavItem]}
            >
              <View style={bottomNavStyles.centerIcon}>
                <Image 
                  source={item.icon}
                  style={[bottomNavStyles.centerIconImage]}
                  resizeMode="contain"
                />
              </View>
            </View>
          );
        }

        // Botones laterales normales
        return (
          <TouchableOpacity
            key={item.key}
            style={[
              bottomNavStyles.navItem,
              isActive && bottomNavStyles.navItemActive
            ]}
            onPress={() => onTabPress(item.key)}
          >
            <Image 
              source={iconSource}
              style={[
                bottomNavStyles.navIcon,
                isActive && bottomNavStyles.navIconActive
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};