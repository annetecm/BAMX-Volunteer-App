import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomNavigation } from '../components/BottomNavigation';
import { settingsStyles } from '../styles/SettingStyles';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined; // ✅ Agregada
  VolunteerAdmin: undefined; // ✅ Agregada
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('settings');
  const [userName, setUserName] = useState<string>('Usuario');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const icons = {
    person: require('../../assets/accessibility.png'),
    email: require('../../assets/correoIcon.png'),  
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as {
            fullName?: string;
            email?: string | null;
            phone_number?: string | null;
          };
          
          const name = data.fullName?.trim() || 'Usuario';
          const email = data.email || user.email || '';
          
          setUserName(name);
          setUserEmail(email);
        } else {
          setUserName(user.displayName || 'Usuario');
          setUserEmail(user.email || '');
        }
      } catch (e: any) {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={settingsStyles.container}>
        <View style={settingsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff9b63" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={settingsStyles.container}>
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.headerTitle}>Perfil</Text>
        <Text style={settingsStyles.headerSubtitle}>{userName}</Text>
      </View>

      <ScrollView
        style={settingsStyles.content}
        contentContainerStyle={settingsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={settingsStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={settingsStyles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={settingsStyles.infoSection}>
          <View style={settingsStyles.infoItem}>
            <View style={settingsStyles.infoRow}>
              <Text style={settingsStyles.infoNumber}>01</Text>
              <Image 
                source={icons.person} 
                style={settingsStyles.infoIconImage}
                resizeMode="contain"
              />
              <Text style={settingsStyles.infoLabel}>Nombre</Text>
            </View>
            <Text style={settingsStyles.infoValue}>{userName}</Text>
            <View style={settingsStyles.dividerLine} />
          </View>

          <View style={settingsStyles.infoItem}>
            <View style={settingsStyles.infoRow}>
              <Text style={settingsStyles.infoNumber}>02</Text>
              <Image 
                source={icons.email} 
                style={settingsStyles.infoIconImage}
                resizeMode="contain"
              />
              <Text style={settingsStyles.infoLabel}>Correo</Text>
            </View>
            <Text style={settingsStyles.infoValue}>{userEmail || 'No disponible'}</Text>
            <View style={settingsStyles.dividerLine} />
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => {
          if (tab !== 'settings') {
            navigation.navigate('Main');
          }
          setActiveTab(tab);
        }}
        onNavigateToAddTask={() => navigation.navigate('AddTask')}
        onNavigateToAdminTasks={() => navigation.navigate('AdminTasks')} // ✅ Buzón a AdminTasks
      />
    </SafeAreaView>
  );
};