import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

type LoginMethod = 'phone' | 'email';

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Lógica de login
    console.log('Login pressed');
  };

  const handleCreateAccount = () => {
    // Navegar a crear cuenta
    console.log('Create account pressed');
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
              style={[
                styles.methodOption,
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Inicia Sesión</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 60,
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
    marginBottom: 60,
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
    marginBottom: 30,
  },
  inputIcon: {
    marginRight: 12,
    width: 14,
    height: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  loginButton: {
    backgroundColor: '#ff6b35',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#979797',
    textAlign: 'center',
  },
  createAccountText: {
    color: '#ff7f0a',
  },
});

export default Login;