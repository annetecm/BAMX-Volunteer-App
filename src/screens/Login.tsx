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

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await signOut(auth);
          Alert.alert(
            'No se puede iniciar sesión',
            'Tu cuenta no está registrada en la base de datos. Contacta al administrador.'
          );
          return;
        }

        const userData = snap.data();

        if (userData.state === 'aprobado') {
          navigation.replace('Main');
        } else if (userData.state === 'pendiente') {
          await signOut(auth);
          Alert.alert('Cuenta en revisión', 'Tu cuenta está pendiente de aprobación por el administrador.');
        } else {
          await signOut(auth);
          Alert.alert('Acceso denegado', 'Tu cuenta no está habilitada. Contacta al administrador.');
        }
      } catch (e: any) {
        await signOut(auth);
        Alert.alert('Error', e?.message ?? 'No se pudo validar tu cuenta. Intenta de nuevo.');
      }
    });

    return unsub;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Campos incompletos', 'Ingresa correo y contraseña.');
        return;
      }
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') {
        Alert.alert('Usuario no encontrado', 'Ese correo no tiene cuenta registrada.');
      } else if (err?.code === 'auth/wrong-password') {
        Alert.alert('Contraseña incorrecta', 'Revisa tus datos e intenta de nuevo.');
      } else if (err?.code === 'auth/invalid-email') {
        Alert.alert('Correo inválido', 'Verifica el formato del correo.');
      } else {
        Alert.alert('Error al iniciar sesión', 'Revisa tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert(
        'Correo requerido',
        'Escribe tu correo en el campo de “Correo” para enviarte el enlace de recuperación.'
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, trimmed);
      Alert.alert(
        'Revisa tu correo',
        'Te enviamos un enlace para restablecer tu contraseña. Si no lo ves, revisa tu carpeta de spam.'
      );
    } catch (err: any) {
      if (err?.code === 'auth/invalid-email') {
        Alert.alert('Correo inválido', 'Verifica el formato del correo.');
      } else if (err?.code === 'auth/user-not-found') {
        Alert.alert('Usuario no encontrado', 'No existe una cuenta registrada con ese correo.');
      } else {
        Alert.alert('No se pudo enviar', 'Inténtalo de nuevo en unos minutos.');
      }
    }
  };

  const handleCreateAccount = () => {
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

        {/* Input Fields */}
        <View style={styles.inputContainer}>
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

       {/* Footer con enlaces juntos */}
      <View style={styles.footer}>
        <Text style={[styles.footerText]} numberOfLines={1}>
          ¿Olvidaste tu contraseña?{' '}
          <Text style={styles.linkText} onPress={handleResetPassword}>
            Restablecer ahora
          </Text>
        </Text>

        <Text style={[styles.footerText, { marginTop: 12 }]}>
          ¿No tienes cuenta?{' '}
          <Text style={styles.linkText} onPress={handleCreateAccount}>
            Crear una cuenta
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#595959', textAlign: 'left' },
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

  // ✅ estilos agregados:
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },

  forgotText: {
    fontSize: 13,
    color: '#595959',
    fontWeight: '500',
  },
  resetLink: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#ff7f0a', // naranja
  },

  loginButton: {
    backgroundColor: '#ff6b35',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  footer: {
  alignItems: 'center',
  marginTop: 25,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#979797',
    textAlign: 'center',
  },
  linkText: {
    color: '#ff7f0a',
    fontWeight: '700',
  },


  createAccountText: { color: '#ff7f0a' },
});

export default Login;