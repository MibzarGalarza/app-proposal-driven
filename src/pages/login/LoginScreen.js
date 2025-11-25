import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AnimationWoman from '../../animations/AnimationWoman'
import ThemedText from '../../shared/ThemedText'
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)



  const [rememberMe, setRememberMe] = useState(false);


  const [huellaDigital, setHuellaDigital] = useState(false);
  const [biometryAvailable, setBiometryAvailable] = useState(false);



  useEffect(() => {
    checkBiometryAvailability();
    loadSavedPreferences();
  }, []);


  const checkBiometryAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometryAvailable(compatible && enrolled);
  };

  const loadSavedPreferences = async () => {
    try {
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');
      const savedHuellaDigital = await AsyncStorage.getItem('huellaDigital');
      const savedEmail = await AsyncStorage.getItem('savedEmail');

      if (savedRememberMe === 'true') {
        setRememberMe(true);
        if (savedEmail) {
          setEmail(savedEmail);
        }
      }

      if (savedHuellaDigital === 'true') {
        setHuellaDigital(true);
      }
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }
  };

  const handleRememberMeToggle = async () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
    try {
      await AsyncStorage.setItem('rememberMe', newValue.toString());
      if (!newValue) {
        await AsyncStorage.removeItem('savedEmail');
      }
    } catch (error) {
      console.error('Error al guardar recordarme:', error);
    }
  };

  const handleHuellaDigitalToggle = async () => {
    if (!biometryAvailable) {
      alert('Tu dispositivo no tiene autenticación biométrica disponible');
      return;
    }

    const newValue = !huellaDigital;

    if (newValue) {
      // Verificar huella digital antes de activar
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifica tu identidad',
          fallbackLabel: 'Usar contraseña',
        });

        if (result.success) {
          setHuellaDigital(true);
          await AsyncStorage.setItem('huellaDigital', 'true');
        } else {
          alert('No se pudo verificar tu identidad');
        }
      } catch (error) {
        console.error('Error en autenticación biométrica:', error);
        alert('Error al verificar huella digital');
      }
    } else {
      setHuellaDigital(false);
      await AsyncStorage.setItem('huellaDigital', 'false');
    }
  };

  const handleLogin = async () => {
    try {
      // Obtener todos los usuarios de la "base de datos"
      const usersData = await AsyncStorage.getItem('users')
      const users = usersData ? JSON.parse(usersData) : []

      // Buscar usuario con email y contraseña
      const user = users.find(u => u.email === email && u.password === password)

      if (!user) {
        alert('Email o contraseña incorrectos')
        return
      }

      // Guardar sesión del usuario
      await AsyncStorage.setItem('currentUser', JSON.stringify(user))
      
      // Guardar email si recordarme está activo
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email)
      }

      console.log('Login exitoso:', user)
      
      // Navegar a la pantalla principal
      navigation.navigate('Home')
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      alert('Error al iniciar sesión. Intenta de nuevo.')
    }
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <ThemedText center style={styles.welcomeText}>
              ¡Hola!
            </ThemedText>
            <ThemedText center style={styles.titleText}>
              Bienvenido a
            </ThemedText>
            <ThemedText center style={styles.brandText}>
              Woman Drive
            </ThemedText>
          </View>
          <View style={styles.animationContainer}>
            <AnimationWoman />
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleRememberMeToggle}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && (
                <Ionicons name="checkmark" size={18} color="#FFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Recordarme</Text>
          </TouchableOpacity>

          {biometryAvailable && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleHuellaDigitalToggle}
            >
              <View style={[styles.checkbox, huellaDigital && styles.checkboxChecked]}>
                {huellaDigital && (
                  <Ionicons name="checkmark" size={18} color="#FFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Usar huella digital</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!email || !password) && styles.buttonDisabled
          ]}
          disabled={!email || !password}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: "35%",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 50,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: "center",
    gap: 5,
  },
  welcomeText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    color: "#FFF",
  },
  titleText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: "#FFF",
    opacity: 0.95,
  },
  brandText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: "#FFF",
    letterSpacing: 1,
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    marginTop: 20,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    fontFamily: 'Poppins_500Medium',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  passwordInput: {
    fontFamily: 'Poppins_500Medium',
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  optionsContainer: {
    marginBottom: 25,
    gap: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#f83dd9ff",
    borderColor: "#f83dd9ff",
  },
  checkboxLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#f83dd9ff",
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ddd",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: "#FFF",
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: "#666",
  },
  registerLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: "#f83dd9ff",
    textDecorationLine: 'underline',
  }
})

export default LoginScreen