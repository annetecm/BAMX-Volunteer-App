import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import { bottomNavStyles } from '../styles/BottomNavStyles';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onNavigateToAddTask?: () => void;
  onNavigateToAdminTasks?: () => void;
  onNavigateToVolunteerAdmin?: () => void;
  onNavigateToVolunteerManager?: () => void;
  onNavigateToMain?: () => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onTabPress,
  onNavigateToAddTask,
  onNavigateToAdminTasks,
  onNavigateToVolunteerAdmin,
  onNavigateToVolunteerManager,
  onNavigateToMain
}) => {

  const [userRole, setUserRole] = useState<'admin' | 'volunteer' | 'supervisor'>('volunteer');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as { role?: string };
          setUserRole(data.role === 'admin' ? 'admin' : 'volunteer');
        }
      } catch (e: any) {
        Alert.alert('Error', 'No se pudo obtener el rol del usuario.');
      }
    };

    fetchUserRole();
  }, []);

  const navItems = [
    {
      key: 'menu',
      icon: require('../../assets/menu.png'),
      activeIcon: require('../../assets/active.png'),
      action: 'menu',
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
      activeIcon: require('../../assets/apple.png'),
      isCenter: true,
      action: 'home',
    },
    {
      key: 'mailbox',
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
    switch (item.action) {
      case 'menu':
        if (userRole === 'admin') onNavigateToVolunteerAdmin && onNavigateToVolunteerAdmin();
        else onNavigateToVolunteerManager && onNavigateToVolunteerManager();
        break;
      case 'addTask':
        onNavigateToAddTask && onNavigateToAddTask();
        break;
      case 'adminTasks':
        onNavigateToAdminTasks && onNavigateToAdminTasks();
        break;
      case 'home':
        onNavigateToMain && onNavigateToMain();
        break;
      default:
        onTabPress(item.key);
        break;
    }
  };

  return (
    <View style={bottomNavStyles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        const iconSource = isActive ? item.activeIcon : item.icon;

        if (item.isCenter) {
          return (
            <TouchableOpacity
              key={item.key}
              style={[bottomNavStyles.navItem, bottomNavStyles.centerNavItem]}
              onPress={() => handlePress(item)}
            >
              <View style={bottomNavStyles.centerIcon}>
                <Image 
                  source={iconSource}
                  style={bottomNavStyles.centerIconImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.key}
            style={[bottomNavStyles.navItem, isActive && bottomNavStyles.navItemActive]}
            onPress={() => handlePress(item)}
          >
            <Image 
              source={iconSource}
              style={[bottomNavStyles.navIcon, isActive && bottomNavStyles.navIconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};