import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const RegisterAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
  if (!formData.email || !formData.password || !formData.fullName) {
    Alert.alert("Error", "Por favor completa todos los campos");
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    Alert.alert(
      "Contraseña no válida",
      "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial."
    );
    return;
  }

  if (!acceptedTerms) {
    Alert.alert("Error", "Debes aceptar los términos y condiciones");
    return;
  }

  try {
    setLoading(true);

    const cred = await createUserWithEmailAndPassword(
      auth,
      formData.email.trim(),
      formData.password
    );
    const u = cred.user;

    const userData = {
      id: u.uid,
      fullName: formData.fullName,
      email: formData.email.trim(),
      phone_number: null,
      role: "supervisor",       
      state: "pendiente",       
      createdAt: serverTimestamp() 
    };

    const batch = writeBatch(db);
    batch.set(doc(db, "users", u.uid), userData);
    batch.set(doc(db, "supervisors", u.uid), userData);
    await batch.commit();

    setLoading(false);
    setFormData({ email: "", password: "", fullName: "" });
    setAcceptedTerms(false);
  } catch (e: any) {
    setLoading(false);
    console.error(e);
    Alert.alert("Error", e?.message ?? "No se pudo registrar el usuario");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Regístrate</Text>
            <Text style={styles.subtitle}>¡Únete como encargado!</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Image
                source={require("../../assets/keyboard.png")}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Nombre completo"
                placeholderTextColor="#595959"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
              />
            </View>

            <View style={styles.inputRow}>
              <Image
                source={require("../../assets/correoIcon.png")}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Correo"
                placeholderTextColor="#595959"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputRow}>
              <Image
                source={require("../../assets/contrasenaIcon.png")}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Contraseña"
                placeholderTextColor="#595959"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>Aquí va el disclaimer</Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
              >
                {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Acepto los términos y condiciones
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Registrando..." : "Regístrate"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 36, paddingTop: 60, paddingBottom: 30 },
  header: { marginBottom: 40 },
  title: { fontSize: 20, fontWeight: "600", color: "#000000", marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: "600", color: "#595959" },
  inputContainer: { marginBottom: 30 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 12,
    marginBottom: 25,
  },
  inputIcon: { width: 16, height: 16, marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: "#000000", paddingVertical: 8 },
  disclaimerContainer: {
    backgroundColor: "#fff5f2",
    borderWidth: 1,
    borderColor: "#ffe0d6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  disclaimerText: { fontSize: 14, color: "#595959", lineHeight: 20, marginBottom: 16 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ff6b35",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#ff6b35" },
  checkmark: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
  checkboxLabel: { fontSize: 14, color: "#000000", flex: 1 },
  registerButton: {
    backgroundColor: "#ff6b35",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  registerButtonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },
});

export default RegisterAdmin;