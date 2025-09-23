import { auth, db } from "../firebaseConfig";
import React, { useState, useRef } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { FirebaseApp } from "firebase/app";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, setDoc } from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';

type LoginMethod = 'phone' | 'email';

interface AreaOption {
  id: string;
  label: string;
}

const areaOptions: AreaOption[] = [
  { id: '1', label: 'Empaquetamiento de alimentos' },
  { id: '2', label: 'Clasificación de donaciones' },
  { id: '3', label: 'Atención al público' },
  { id: '4', label: 'Distribución de despensas' },
  { id: '5', label: 'Actividades recreativas' },
  { id: '6', label: 'Mantenimiento' },
];

const RegisterScreen: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    fullName: '',
    curp: '',
    ine: '',
    emergencyContact: '',
    bloodType: '',
    medicalCondition: '',
  });
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAreaSelect = (area: AreaOption) => {
    setSelectedArea(area.label);
    setShowAreaModal(false);
  };

  const saveUserData = async (uid: string) => {
    await setDoc(doc(db, "volunteers", uid), {
      fullName: formData.fullName,
      email: loginMethod === "email" ? formData.email : null,
      phoneNumber: loginMethod === "phone" ? formData.phoneNumber : null,
      curp: formData.curp,
      ine: formData.ine,
      emergencyContact: formData.emergencyContact,
      bloodType: formData.bloodType,
      medicalCondition: formData.medicalCondition,
      area: selectedArea,
      createdAt: new Date(),
      isApproved: false,
    });
  };

  const handleRegister = async () => {
    try {
      if (loginMethod === "email") {
        if (!formData.email || !formData.password) {
          alert("Por favor ingresa correo y contraseña");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth, formData.email, formData.password
        );
        await saveUserData(userCredential.user.uid);
        alert("Registro exitoso, te notificaremos cuando seas aprobado");
      } else if (loginMethod === "phone") {
        if (!formData.phoneNumber) {
          alert("Por favor ingresa tu número de teléfono");
          return;
        }
        const confirmation = await signInWithPhoneNumber(
          auth, formData.phoneNumber, recaptchaVerifier.current!
        );
        setConfirmationResult(confirmation);
        setShowOtpModal(true);
      }
    } catch (error: any) {
      console.error("Error en registro:", error.message);
      alert("Error: " + error.message);
    }
  };

  const confirmOTP = async () => {
    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const user = userCredential.user;

      await saveUserData(user.uid);
      setShowOtpModal(false);
      alert("Registro exitoso, te notificaremos cuando seas aprobado");
    } catch (error: any) {
      console.log("Error OTP:", error.message);
      alert("Código incorrecto. Intenta de nuevo.");
    }
  };

  const renderAreaItem = ({ item }: { item: AreaOption }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleAreaSelect(item)}
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Recaptcha invisible */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options as any}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Regístrate</Text>
            <Text style={styles.subtitle}>¡Únete como voluntario!</Text>
          </View>

          {/* Method Selector */}
          <View style={styles.methodSelector}>
            <View style={styles.methodSelectorBackground}>
              <TouchableOpacity
                style={[
                  styles.methodOption,
                  styles.leftOption,
                  loginMethod === 'phone' && styles.activeMethodOption,
                ]}
                onPress={() => setLoginMethod('phone')}
              >
                <Text
                  style={[
                    styles.methodText,
                    loginMethod === 'phone' && styles.activeMethodText,
                  ]}
                >
                  Número telefónico
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.methodOption,
                  styles.rightOption,
                  loginMethod === 'email' && styles.activeMethodOption,
                ]}
                onPress={() => setLoginMethod('email')}
              >
                <Text
                  style={[
                    styles.methodText,
                    loginMethod === 'email' && styles.activeMethodText,
                  ]}
                >
                  Correo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Email or Phone Field */}
            {loginMethod === 'email' ? (
              <View style={styles.inputRow}>
                <Image 
                  source={require('../../assets/correoIcon.png')} 
                  style={styles.inputIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Correo"
                  placeholderTextColor="#595959"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <View style={styles.inputRow}>
                <Image 
                  source={require('../../assets/telefonoIcon.png')} 
                  style={styles.inputIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Número telefónico"
                  placeholderTextColor="#595959"
                  value={formData.phoneNumber}
                  onChangeText={(value) => {
                    const formatted = value.startsWith('+') ? value : `+52${value}`;
                    handleInputChange('phoneNumber', formatted);
                  }}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            {/* Password Field - Only show for email registration */}
            {loginMethod === 'email' && (
              <View style={styles.inputRow}>
                <Image 
                  source={require('../../assets/contrasenaIcon.png')} 
                  style={styles.inputIcon}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Contraseña"
                  placeholderTextColor="#595959"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
              </View>
            )}

            {/* Full Name Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/keyboard.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Nombre completo"
                placeholderTextColor="#595959"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
            </View>

            {/* CURP Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/keyboard.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="CURP"
                placeholderTextColor="#595959"
                value={formData.curp}
                onChangeText={(value) => handleInputChange('curp', value)}
                autoCapitalize="characters"
              />
            </View>

            {/* Area Dropdown */}
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => setShowAreaModal(true)}
            >
              <Image 
                source={require('../../assets/dropdown.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <Text style={[styles.textInput, styles.dropdownText]}>
                {selectedArea || 'Área en la que te gustaría aportar'}
              </Text>
            </TouchableOpacity>

            {/* INE Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/archive.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="INE"
                placeholderTextColor="#595959"
                value={formData.ine}
                onChangeText={(value) => handleInputChange('ine', value)}
              />
            </View>

            {/* Emergency Contact Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/account_circle.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Contacto de emergencia"
                placeholderTextColor="#595959"
                value={formData.emergencyContact}
                onChangeText={(value) => handleInputChange('emergencyContact', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Blood Type Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/accessibility.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Tipo de sangre"
                placeholderTextColor="#595959"
                value={formData.bloodType}
                onChangeText={(value) => handleInputChange('bloodType', value)}
                autoCapitalize="characters"
              />
            </View>

            {/* Medical Condition Field */}
            <View style={styles.inputRow}>
              <Image 
                source={require('../../assets/archive.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Constancia Médica"
                placeholderTextColor="#595959"
                value={formData.medicalCondition}
                onChangeText={(value) => handleInputChange('medicalCondition', value)}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Area Selection Modal */}
      <Modal
        visible={showAreaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAreaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un área</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowAreaModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={areaOptions}
              renderItem={renderAreaItem}
              keyExtractor={(item) => item.id}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal OTP */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Te enviamos un código por SMS</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ingresa el código aquí"
              keyboardType="number-pad"
              value={otpCode}
              onChangeText={setOtpCode}
            />
            <TouchableOpacity style={styles.registerButton} onPress={confirmOTP}>
              <Text style={styles.registerButtonText}>Confirmar código</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles moved outside the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#595959',
    textAlign: 'left',
  },
  methodSelector: {
    marginBottom: 40,
  },
  methodSelectorBackground: {
    backgroundColor: '#ededed',
    borderRadius: 15,
    height: 56,
    flexDirection: 'row',
    padding: 6,
  },
  methodOption: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  leftOption: {},
  rightOption: {},
  activeMethodOption: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f4f4f',
  },
  activeMethodText: {
    color: '#000000',
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 25,
  },
  inputIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  dropdownText: {
    color: '#595959',
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    tintColor: '#595959',
  },
  registerButton: {
    backgroundColor: '#ff6b35',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '85%',
    maxHeight: '70%',
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: '#595959',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default RegisterScreen;