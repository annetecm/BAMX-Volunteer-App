import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import type { RootStackParamList } from '../../App';

type LoginMethod = 'phone' | 'email';
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya hay sesión activa, valida que exista el doc en Firestore antes de pasar a Main
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // Bloquea el acceso si no existe un perfil en la base de datos
          await signOut(auth);
          Alert.alert(
            'No se puede iniciar sesión',
            'Tu cuenta no está registrada en la base de datos. Contacta al administrador.'
          );
          return;
        }

        navigation.replace('Main');
      } catch (e: any) {
        await signOut(auth);
        Alert.alert('Error', e?.message ?? 'No se pudo validar tu cuenta. Intenta de nuevo.');
      }
    });

    return unsub;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      if (loginMethod === 'email') {
        if (!email || !password) {
          Alert.alert('Campos incompletos', 'Ingresa correo y contraseña.');
          return;
        }
        setLoading(true);
        await signInWithEmailAndPassword(auth, email.trim(), password);

      } else {
        Alert.alert('Próximamente', 'Login por teléfono se activará con OTP cuando me indiques 😉');
      }
    } catch (err: any) {
      // Errores típicos de Auth
      if (err?.code === 'auth/user-not-found') {
        Alert.alert('Usuario no encontrado', 'Ese correo no tiene cuenta registrada.');
      } else if (err?.code === 'auth/wrong-password') {
        Alert.alert('Contraseña incorrecta', 'Revisa tus datos e intenta de nuevo.');
      } else if (err?.code === 'auth/invalid-email') {
        Alert.alert('Correo inválido', 'Verifica el formato del correo.');
      } else {
        Alert.alert('Error al iniciar sesión','Revisa tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    // Se mantiene como lo tenías
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Entra a tu cuenta</Text>
          <Text style={styles.subtitle}>¡Bienvenido de regreso!</Text>
        </View>

        {/* Method Selector */}
        <View style={styles.methodSelector}>
          <View style={styles.methodSelectorBackground}>
            <TouchableOpacity
              style={[styles.methodOption, loginMethod === 'phone' && styles.activeMethodOption]}
              onPress={() => setLoginMethod('phone')}
            >
              <Text style={[styles.methodText, loginMethod === 'phone' && styles.activeMethodText]}>
                Número telefónico
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodOption, loginMethod === 'email' && styles.activeMethodOption]}
              onPress={() => setLoginMethod('email')}
            >
              <Text style={[styles.methodText, loginMethod === 'email' && styles.activeMethodText]}>
                Correo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {loginMethod === 'phone' ? (
            <View style={styles.inputRow}>
              <Image
                source={require('../../assets/telefonoIcon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Teléfono"
                placeholderTextColor="#595959"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          ) : (
            <>
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
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
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
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </>
          )}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Ingresando…' : 'Inicia Sesión'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No estás registrado?{' '}
            <Text style={styles.createAccountText} onPress={handleCreateAccount}>
              Crea una cuenta
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, paddingHorizontal: 36, paddingTop: 60 },
  header: { marginBottom: 40 },
  title: { fontSize: 20, fontWeight: '600', color: '#000000', textAlign: 'left', marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#595959', textAlign: 'left' },
  methodSelector: { marginBottom: 60 },
  methodSelectorBackground: { backgroundColor: '#ededed', borderRadius: 15, height: 56, flexDirection: 'row', padding: 6 },
  methodOption: { flex: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 2 },
  activeMethodOption: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodText: { fontSize: 14, fontWeight: '600', color: '#4f4f4f' },
  activeMethodText: { color: '#000000' },
  inputContainer: { marginBottom: 40 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 30,
  },
  inputIcon: { marginRight: 12, width: 14, height: 14 },
  textInput: { flex: 1, fontSize: 16, color: '#000000', paddingVertical: 8 },
  loginButton: {
    backgroundColor: '#ff6b35',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { fontSize: 14, fontWeight: '600', color: '#000000', marginHorizontal: 20 },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 14, fontWeight: '600', color: '#979797', textAlign: 'center' },
  createAccountText: { color: '#ff7f0a' },
});

export default Login;
