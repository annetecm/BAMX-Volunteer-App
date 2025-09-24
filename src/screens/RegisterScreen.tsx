import { auth, db } from "../firebaseConfig";
import React, { useState, useRef } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, setDoc } from "firebase/firestore";
import * as DocumentPicker from 'expo-document-picker';

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
  Alert,
} from 'react-native';

type LoginMethod = 'phone' | 'email';

interface AreaOption {
  id: string;
  label: string;
}

interface DocumentFile {
  uri: string;
  name: string;
  type: string;
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
    emergencyContact: '',
    bloodType: '',
  });
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // Estados para documentos
  const [ineDocument, setIneDocument] = useState<DocumentFile | null>(null);
  const [medicalDocument, setMedicalDocument] = useState<DocumentFile | null>(null);
  const [uploading, setUploading] = useState(false);

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

  // Función para seleccionar documento
  const pickDocument = async (documentType: 'ine' | 'medical') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const documentFile: DocumentFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        };

        if (documentType === 'ine') {
          setIneDocument(documentFile);
        } else {
          setMedicalDocument(documentFile);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };

  // Función para sanitizar nombres de archivo
  const sanitizeFilename = (filename: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const extension = filename.split('.').pop()?.toLowerCase() || 'pdf';
    return `doc_${timestamp}_${random}.${extension}`;
  };

  const convertFileToBase64 = async (document: DocumentFile): Promise<string> => {
    try {
      const response = await fetch(document.uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert to base64'));
          }
        };
        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Error converting file: ${error}`);
    }
  };

  
  // Función para guardar datos del usuario y del voluntario en tablas separadas
  const saveUserData = async (uid: string) => {
    try {
      setUploading(true);
      
      let ineBase64 = null;
      let medicalBase64 = null;
      let ineMetadata = null;
      let medicalMetadata = null;

      // Convertir INE a base64 si existe y es < 1MB
      if (ineDocument) {
        const response = await fetch(ineDocument.uri);
        const blob = await response.blob();
        
        if (blob.size > 1024 * 1024) { // 1MB
          throw new Error("El archivo INE es demasiado grande (máximo 1MB)");
        }
        
        console.log("📄 Convirtiendo INE a base64...");
        ineBase64 = await convertFileToBase64(ineDocument);
        ineMetadata = {
          name: ineDocument.name,
          type: ineDocument.type,
          size: blob.size
        };
        console.log("INE convertido a b64 exitosamente");
      }

      // Convertir constancia médica a base64 si existe y es < 1MB
      if (medicalDocument) {
        const response = await fetch(medicalDocument.uri);
        const blob = await response.blob();
        
        if (blob.size > 1024 * 1024) { // 1MB
          throw new Error("La constancia medica es demasiado grande (máximo 1MB)");
        }
        
        console.log("Convirtiendo constancia médica a base64...");
        medicalBase64 = await convertFileToBase64(medicalDocument);
        medicalMetadata = {
          name: medicalDocument.name,
          type: medicalDocument.type,
          size: blob.size
        };
        console.log("Constancia médica convertida a b64 exitosamente");
      }

      // Guardar datos en tabla Users
      await setDoc(doc(db, "users", uid), {
        id: uid,
        fullName: formData.fullName,
        email: loginMethod === "email" ? formData.email : null,
        phone_number: loginMethod === "phone" ? formData.phoneNumber : null,
        // No incluimos el campo password para mayor seguridad
        role: "volunteer", // Rol por defecto para registros desde esta pantalla
        state: "pendiente", // Estado inicial pendiente de aprobación (pendiente/aprobado)
        createdAt: new Date(),
      });

      // Guardar datos en tabla Volunteers
      await setDoc(doc(db, "volunteers", uid), {
        id_volunteer: uid,
        correo: loginMethod === "email" ? formData.email : null,
  
        curp: formData.curp,
        
        // Documentos como base64
        ine: ineBase64 ? {
          data: ineBase64,
          metadata: ineMetadata
        } : null,
        
        emergency_phone: formData.emergencyContact,
        blood_type: formData.bloodType,
        
        medical_certificate: medicalBase64 ? {
          data: medicalBase64,
          metadata: medicalMetadata
        } : null,
        
        total_accredited_hr: 0, // Inicializar en 0
        week_accredited_hr: 0,  // Inicializar en 0
        area: selectedArea, // Área seleccionada por el voluntario
        createdAt: new Date(),
      });

      console.log("Datos guardados exitosamente en ambas colecciones");
      setUploading(false);
      
    } catch (error) {
      console.error("Error guardando datos:", error);
      setUploading(false);
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      if (loginMethod === "email") {
        if (!formData.email || !formData.password) {
          Alert.alert("Error", "Por favor ingresa correo y contraseña");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth, formData.email, formData.password
        );
        await saveUserData(userCredential.user.uid);
        Alert.alert("¡Gracias!", "Solicitud de egistro exitosa, te notificaremos cuando seas aprobado");
      } else if (loginMethod === "phone") {
        if (!formData.phoneNumber) {
          Alert.alert("Error", "Por favor ingresa tu número de teléfono");
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
      Alert.alert("Error", error.message);
    }
  };

  const confirmOTP = async () => {
    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const user = userCredential.user;

      await saveUserData(user.uid);
      setShowOtpModal(false);
      Alert.alert("¡Gracias!", "Solicitud de egistro exitosa, te notificaremos cuando seas aprobado");
    } catch (error: any) {
      console.log("Error OTP:", error.message);
      Alert.alert("Error", "Código incorrecto. Intenta de nuevo.");
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

            {/* INE Document Upload */}
            <TouchableOpacity 
              style={styles.documentUploadRow}
              onPress={() => pickDocument('ine')}
            >
              <Image 
                source={require('../../assets/archive.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <View style={styles.documentInfo}>
                <Text style={[styles.textInput, ineDocument ? styles.documentSelected : styles.dropdownText]}>
                  {ineDocument ? ineDocument.name : 'Subir INE (PDF o imagen)'}
                </Text>
                {ineDocument && (
                  <Text style={styles.documentStatus}>✓ Documento seleccionado</Text>
                )}
              </View>
            </TouchableOpacity>

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

            {/* Medical Document Upload */}
            <TouchableOpacity 
              style={styles.documentUploadRow}
              onPress={() => pickDocument('medical')}
            >
              <Image 
                source={require('../../assets/archive.png')} 
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <View style={styles.documentInfo}>
                <Text style={[styles.textInput, medicalDocument ? styles.documentSelected : styles.dropdownText]}>
                  {medicalDocument ? medicalDocument.name : 'Subir Constancia Médica (PDF o imagen)'}
                </Text>
                {medicalDocument && (
                  <Text style={styles.documentStatus}>✓ Documento seleccionado</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerButton, uploading && styles.registerButtonDisabled]} 
            onPress={handleRegister}
            disabled={uploading}
          >
            <Text style={styles.registerButtonText}>
              {uploading ? 'Subiendo documentos...' : 'Regístrate'}
            </Text>
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
            <TouchableOpacity 
              style={[styles.registerButton, uploading && styles.registerButtonDisabled]} 
              onPress={confirmOTP}
              disabled={uploading}
            >
              <Text style={styles.registerButtonText}>
                {uploading ? 'Subiendo documentos...' : 'Confirmar código'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
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
  documentUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 25,
  },
  documentInfo: {
    flex: 1,
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
  documentSelected: {
    color: '#000000',
    fontWeight: '500',
  },
  documentStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#ff6b35',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerButtonDisabled: {
    backgroundColor: '#ffb3a0',
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