import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../components/Header";
import { VolunteerItem, Volunteer } from "../components/Task";
import { BottomNavigation } from "../components/BottomNavigation";
import { screenStyles } from "../styles/ScreenStyles";
import { db, auth } from "../firebaseConfig";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";

// 🔹 Navigation stack types
type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerManager: undefined;
  RegisterScreen: undefined;
  VolunteerDetails: { volunteer: Volunteer };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VolunteerManager"
>;

export const VolunteerManager: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState("mailbox");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [userName, setUserName] = useState<string>("Usuario");
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // 🔹 Load admin user info
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoadingUser(false);
      return;
    }

    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as {
            fullName?: string;
            phone_number?: string | null;
            email?: string | null;
          };
          const name =
            (data.fullName && data.fullName.trim()) ||
            (data.phone_number && data.phone_number.trim()) ||
            (data.email && data.email.split("@")[0]) ||
            "Usuario";
          setUserName(name);
        } else {
          const fallback =
            (user.displayName && user.displayName.trim()) ||
            (user.phoneNumber && user.phoneNumber.trim()) ||
            (user.email ? user.email.split("@")[0] : "Usuario");
          setUserName(fallback);
        }
      } catch (e: any) {
        Alert.alert(
          "Error al cargar usuario",
          e?.message ?? "Intenta nuevamente."
        );
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  // 🔹 Listen for volunteers collection
  useEffect(() => {
    const volunteerRef = collection(db, "volunteers");
    const unsubscribe = onSnapshot(volunteerRef, (querySnapshot) => {
      const dataArray: Volunteer[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          fullName: data.fullName || "Sin nombre",
          correo: data.correo || "Sin información",
          emergency_phone: data.emergency_phone || "Sin información",
          selected: data.selected ?? false,
          blood_type: data.blood_type,
          area: data.area,
          curp: data.curp,
          ine: data.ine,
          medical_certificate: data.medical_certificate, // ✅ important!
        };
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

  const handleBackPress = () => navigation.navigate("AdminTasks");

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === "settings") navigation.navigate("Settings");
    else if (tab === "menu") navigation.navigate("Main");
  };

  if (loadingUser) {
    return (
      <SafeAreaView style={screenStyles.adminContainer}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.adminContainer}>
      <Header userName={userName} title="Administrador de tareas" />

      <View style={screenStyles.adminContent}>
        <View style={screenStyles.volunteersSection}>
          <View style={screenStyles.volunteersSectionHeader}>
            <TouchableOpacity
              style={screenStyles.backButton}
              onPress={handleBackPress}
            >
              <Text style={screenStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={screenStyles.adminSectionVTitle}>Voluntarios</Text>
          </View>

          <ScrollView
            style={screenStyles.volunteersList}
            contentContainerStyle={screenStyles.volunteersScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {volunteers.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 20 }}
              >
                No hay voluntarios registrados.
              </Text>
            ) : (
              volunteers.map((volunteer) => (
                <VolunteerItem
                  key={volunteer.id}
                  volunteer={volunteer}
                  onPress={() => handleVolunteerPress(volunteer.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onNavigateToAddTask={() => navigation.navigate("AddTask")}
        onNavigateToAdminTasks={() => navigation.navigate("AdminTasks")}
        onNavigateToVolunteerAdmin={() => navigation.navigate("VolunteerAdmin")}
        onNavigateToVolunteerManager={() =>
          navigation.navigate("VolunteerManager")
        }
      />
    </SafeAreaView>
  );
};
