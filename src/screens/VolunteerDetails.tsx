import React from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Alert,            
  Platform,        
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from "../styles/TaskDetailsScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomNavigation } from "../components/BottomNavigation";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";   

type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  Settings: undefined;
  AdminTasks: undefined;
  VolunteerAdmin: undefined;
  VolunteerManager: undefined;
  RegisterScreen: undefined;
  VolunteerDetails: { volunteer: any };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VolunteerDetails"
>;


const openPDF = async (base64Data?: string) => {
  try {
    if (!base64Data) {
      Alert.alert("Error", "No hay datos de PDF.");
      return;
    }

    const cleanData = base64Data.startsWith("data:")
      ? base64Data.split(",")[1]
      : base64Data;

    
const fileUri =
  `${((FileSystem as unknown) as any).documentDirectory ||
    ((FileSystem as unknown) as any).cacheDirectory}temp.pdf`;

    await FileSystem.writeAsStringAsync(fileUri, cleanData, {
      encoding: "base64" as any, 
    });

    if (Platform.OS === "ios") {
      await Sharing.shareAsync(fileUri);
    } else {
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: fileUri,
        flags: 1,
        type: "application/pdf",
      });
    }
  } catch (error) {
    console.error("Error opening PDF:", error);
    Alert.alert("Error", "No se pudo abrir el documento PDF.");
  }
};


export const VolunteerDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { volunteer }: any = route.params || {};

  const handleBackPress = () => {
    navigation.navigate("AdminTasks");
  };

  const renderDocument = (docInput: any) => {
  // 🔹 No hay documento
  if (!docInput) return <Text style={styles.cardValue}>Sin documento</Text>;

  const data =
    typeof docInput === "string"
      ? docInput
      : docInput.data || docInput.base64 || null;

  if (!data) return <Text style={styles.cardValue}>Sin documento</Text>;


  const cleanData = data.trim();


  const prefixedData = cleanData.startsWith("data:")
    ? cleanData
    : `data:application/pdf;base64,${cleanData}`;


  const isImage = prefixedData.startsWith("data:image");
  const isPDF = prefixedData.startsWith("data:application/pdf");


  if (isImage) {
    return (
      <Image
        source={{ uri: prefixedData }}
        style={{
          width: 250,
          height: 160,
          borderRadius: 10,
          marginTop: 5,
        }}
        resizeMode="contain"
      />
    );
  }

  
  if (isPDF) {
    return (
      <TouchableOpacity onPress={() => openPDF(prefixedData)}>
        <Text style={{ color: "blue", marginTop: 5 }}>Ver documento PDF</Text>
      </TouchableOpacity>
    );
  }


  return <Text style={styles.cardValue}>Documento guardado (tipo desconocido)</Text>;
};

  return (
    <View style={{ flex: 1, backgroundColor: "#ff9b63" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ff9b63" }}>
        <View style={styles.view}>
          <View style={styles.headerBackground} />
          <Text style={styles.mainTitle}>Detalles del Voluntario</Text>

          <View
            style={{
              position: "absolute",
              top: 140,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#ebfff4",
            }}
          />

          <View style={styles.greenContainer}>
            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {[
                { label: "Nombre", value: volunteer?.fullName },
                { label: "Área", value: volunteer?.area },
                { label: "Tipo de Sangre", value: volunteer?.blood_type },
                { label: "Correo", value: volunteer?.correo },
                { label: "CURP", value: volunteer?.curp },
                { label: "Teléfono", value: volunteer?.emergency_phone },
              ].map((item, index) => (
                <View style={styles.card} key={index}>
                  <View style={styles.cardInner}>
                    <View style={styles.iconPlaceholder}>
                      <MaterialIcons name="person" size={20} color="#1d1b20" />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardLabel}>{item.label}:</Text>
                      <Text style={styles.cardValue}>
                        {item.value || "Sin información"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* INE */}
              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons
                      name="credit-card"
                      size={20}
                      color="#1d1b20"
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>INE:</Text>
                    {renderDocument(volunteer?.ine)}
                  </View>
                </View>
              </View>

              {/* Certificado Médico */}
              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons
                      name="medical-services"
                      size={20}
                      color="#1d1b20"
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>Certificado Médico:</Text>
                    {renderDocument(volunteer?.medical_certificate)}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      <BottomNavigation activeTab="mailbox" onTabPress={() => {}} />
    </View>
  );
};
