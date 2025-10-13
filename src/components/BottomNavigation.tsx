import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { bottomNavStyles } from '../styles/BottomNavStyles';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onNavigateToAddTask?: () => void;
  onNavigateToAdminTasks?: () => void; // ✅ Nueva prop para ir a AdminTasks
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onTabPress,
  onNavigateToAddTask,
  onNavigateToAdminTasks
}) => {
  
  const navItems = [
    {
      key: 'menu',
      icon: require('../../assets/menu.png'),
      activeIcon: require('../../assets/active.png'),
    },
    {
      key: 'tasks',
      icon: require('../../assets/add.png'),
      activeIcon: require('../../assets/active.png'),
      action: 'addTask',
    },
    {
      key: 'home',
      icon: require('../../assets/apple.png'),
      isCenter: true,
    },
    {
      key: 'mailbox', // ✅ Buzón para ir a AdminTasks
      icon: require('../../assets/box.png'),
      activeIcon: require('../../assets/active.png'),
      action: 'adminTasks',
    },
    {
      key: 'settings',
      icon: require('../../assets/settings.png'),
      activeIcon: require('../../assets/active.png'),
    },
  ];

  const handlePress = (item: any) => {
    if (item.action === 'addTask' && onNavigateToAddTask) {
      onNavigateToAddTask();
    } else if (item.action === 'adminTasks' && onNavigateToAdminTasks) {
      onNavigateToAdminTasks(); // ✅ Navegar a AdminTasks
    } else {
      onTabPress(item.key);
    }
  };

  return (
    <View style={bottomNavStyles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        const iconSource = isActive ? item.activeIcon : item.icon;
        
        if (item.isCenter) {
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

        return (
          <TouchableOpacity
            key={item.key}
            style={[
              bottomNavStyles.navItem,
              isActive && bottomNavStyles.navItemActive
            ]}
            onPress={() => handlePress(item)}
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