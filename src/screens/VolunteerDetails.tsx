import React from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity, Image, Alert, Linking} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from "../styles/TaskDetailsScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomNavigation } from '../components/BottomNavigation';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VolunteerDetails'>;

const openPDF = (base64Data?: string) => {
  if (!base64Data) return;
  const url = `data:application/pdf;base64,${base64Data}`;
  Linking.openURL(url).catch(err => console.error('Error opening PDF', err));
};

export const VolunteerDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { volunteer }: any = route.params || {};

  const handleBackPress = () => {
    navigation.navigate('AdminTasks');
  };

  const isImage = (data: string) => {
    return typeof data === "string" && data.startsWith("data:image");
  };

  const isPDF = (data: string) => {
    return typeof data === "string" && data.startsWith("data:application/pdf");
  };

  const renderDocument = (doc: string | undefined) => {
    if (!doc) return <Text style={styles.cardValue}>Sin documento</Text>;

    if (isImage(doc)) {
      return (
        <Image
          source={{ uri: doc }}
          style={{ width: 250, height: 160, borderRadius: 10, marginTop: 5 }}
          resizeMode="contain"
        />
      );
    }

    if (isPDF(doc)) {
      return (
        <TouchableOpacity onPress={() => openPDF(volunteer?.medical_certificate?.data)}>
            <Text style={{ color: 'blue', marginTop: 5 }}>Ver documento PDF</Text>
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

          {/* Título principal */}
          <Text style={styles.mainTitle}>Detalles del Voluntario</Text>

          {/* Fondo claro */}
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

          {/* Contenedor verde */}
          <View style={styles.greenContainer}>
            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {/* Campos de texto */}
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

              {/* Imagen del INE */}
              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons name="credit-card" size={20} color="#1d1b20" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>INE:</Text>
                    {renderDocument(volunteer?.ine?.data)}
                  </View>
                </View>
              </View>

              {/* Imagen del Certificado Médico */}
              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons name="medical-services" size={20} color="#1d1b20" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>Certificado Médico:</Text>
                    {renderDocument(volunteer?.medical_certificate?.data)}
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
