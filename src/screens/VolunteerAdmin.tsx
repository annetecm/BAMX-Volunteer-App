import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../components/Header";
import { VolunteerItem, Volunteer } from "../components/Task";
import { BottomNavigation } from "../components/BottomNavigation";
import { screenStyles } from "../styles/ScreenStyles";
import { StatusBar } from "expo-status-bar";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  RegisterScreen: undefined;
  VolunteerDetails: { volunteer: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "VolunteerAdmin">;

export const VolunteerAdmin: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState("mailbox");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const volunteerRef = collection(db, "volunteers");
    const unsubscribe = onSnapshot(volunteerRef, (querySnapshot) => {
      const dataArray = querySnapshot.docs.map((doc) => {
        const d = doc.data() as any;
        return { id: doc.id, name: d.fullName || "Sin nombre" };
      });
      setVolunteers(dataArray);
    });

    return () => unsubscribe();
  }, []);

  const handleVolunteerPress = (volunteerId: string) => {
    const selected = volunteers.find((v) => v.id === volunteerId);
    if (selected) {
      navigation.navigate("VolunteerDetails", { volunteer: selected });
    }
  };

  const handleAddVolunteer = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleBackPress = () => {
    navigation.navigate("AdminTasks");
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === "settings") navigation.navigate("Settings");
    else if (tab === "menu") navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={[screenStyles.adminContainer, styles.container]}>
      <Header userName="Andrea" title="Administrador de tareas" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/TMlVuEdvrh/ihk3pw34_expires_30_days.png",
          }}
          resizeMode="stretch"
          style={styles.mainImage}
        />

        <View style={styles.volunteersSectionHeader}>
          <TouchableOpacity style={screenStyles.backButton} onPress={handleBackPress}>
            <Text style={screenStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Voluntarios</Text>
        </View>

        <TouchableOpacity style={styles.addVolunteerButton} onPress={handleAddVolunteer}>
          <Text style={styles.addVolunteerButtonText}>Añadir voluntario +</Text>
        </TouchableOpacity>

        <View style={styles.volunteerList}>
          {volunteers.map((volunteer) => (
            <TouchableOpacity
              key={volunteer.id}
              style={styles.volunteerItem}
              onPress={() => handleVolunteerPress(volunteer.id)}
            >
              <Text style={styles.volunteerName}>{volunteer.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/TMlVuEdvrh/lpro584x_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={styles.icon}
          />
          <Text style={styles.footerText}>{`${volunteers.length} voluntarios`}</Text>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onNavigateToAddTask={() => navigation.navigate("AddTask")}
        onNavigateToAdminTasks={() => navigation.navigate("AdminTasks")}
      />

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9B63",
  },
  scrollContent: {
    paddingHorizontal: 50,
    paddingBottom: 100,
  },
  mainImage: {
    height: 260,
    marginTop: 200,
    marginBottom: 30,
    alignSelf: "stretch",
  },
  volunteersSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addVolunteerButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10,
    width: "80%",
  },
  addVolunteerButtonText: {
    color: "#FF9B63",
    textAlign: "center",
    fontWeight: "700",
  },
  volunteerList: {
    marginTop: 10,
    marginBottom: 250,
  },
  volunteerItem: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  volunteerName: {
    color: "#FF9B63",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: 50,
  },
  icon: {
    width: 21,
    height: 10,
    marginBottom: 4,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
