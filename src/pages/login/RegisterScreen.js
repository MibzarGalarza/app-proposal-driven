import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AnimationWoman from '../../animations/AnimationWoman'
import ThemedText from '../../shared/ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Contacto de emergencia (opcional)
  const [nombreEmergencia, setNombreEmergencia] = useState('')
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('')
  const [relacionEmergencia, setRelacionEmergencia] = useState('')

  const handleRegister = async () => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    // Validar campos requeridos
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !email || !password) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      // Verificar si el email ya existe
      const usersData = await AsyncStorage.getItem('users')
      const users = usersData ? JSON.parse(usersData) : []
      
      const userExists = users.find(user => user.email === email)
      if (userExists) {
        alert('Este email ya está registrado')
        return
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        email,
        password,
        contactoEmergencia: {
          nombre: nombreEmergencia,
          telefono: telefonoEmergencia,
          relacion: relacionEmergencia
        },
        fechaRegistro: new Date().toISOString()
      }

      // Guardar usuario en la "base de datos"
      users.push(newUser)
      await AsyncStorage.setItem('users', JSON.stringify(users))

      alert('¡Registro exitoso! Ahora puedes iniciar sesión')
      navigation.goBack()
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      alert('Error al registrar usuario. Intenta de nuevo.')
    }
  }

  const isFormValid = nombre && apellidoPaterno && apellidoMaterno && telefono && email && password && confirmPassword

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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <ThemedText center style={styles.welcomeText}>
              ¡Bienvenida!
            </ThemedText>
            <ThemedText center style={styles.titleText}>
              Crea tu cuenta en
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
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Apellido Paterno *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu apellido paterno"
            placeholderTextColor="#999"
            value={apellidoPaterno}
            onChangeText={setApellidoPaterno}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Apellido Materno *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu apellido materno"
            placeholderTextColor="#999"
            value={apellidoMaterno}
            onChangeText={setApellidoMaterno}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu teléfono"
            placeholderTextColor="#999"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña *</Text>
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

          <Text style={styles.label}>Confirmar Contraseña *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Sección de Contacto de Emergencia */}
          <View style={styles.emergencySection}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="alert-circle" size={24} color="#f83dd9ff" />
              <Text style={styles.sectionTitle}>Contacto de Emergencia (Opcional)</Text>
            </View>
            <Text style={styles.emergencySubtitle}>
              Agrega un familiar o contacto de confianza
            </Text>

            <Text style={styles.label}>Nombre del Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              value={nombreEmergencia}
              onChangeText={setNombreEmergencia}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Teléfono del Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono de emergencia"
              placeholderTextColor="#999"
              value={telefonoEmergencia}
              onChangeText={setTelefonoEmergencia}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Relación</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Madre, Padre, Hermana, Amiga"
              placeholderTextColor="#999"
              value={relacionEmergencia}
              onChangeText={setRelacionEmergencia}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              !isFormValid && styles.buttonDisabled
            ]}
            disabled={!isFormValid}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 280,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
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
    fontSize: 16,
    color: "#FFF",
    opacity: 0.95,
  },
  brandText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: "#FFF",
    letterSpacing: 1,
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    fontFamily: 'Poppins_500Medium',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  passwordInput: {
    fontFamily: 'Poppins_500Medium',
    flex: 1,
    padding: 12,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 12,
  },
  emergencySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  emergencySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: "#666",
    marginBottom: 15,
    marginLeft: 34,
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
    marginTop: 10,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: "#666",
  },
  loginLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: "#f83dd9ff",
    textDecorationLine: 'underline',
  }
})

export default RegisterScreen