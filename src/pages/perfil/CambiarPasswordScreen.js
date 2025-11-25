import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getCurrentUser, updateUser } from '../../api/login/login.actions'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import useGlobalState from '../../store/auth'

const CambiarPasswordScreen = () => {

  const { setShowTabs } = useGlobalState();

  useFocusEffect(
    React.useCallback(() => {
      // Al enfocar la pantalla, ocultar las tabs
      setShowTabs(false);
      return () => {
        // Al desenfocar la pantalla, mostrar las tabs
        setShowTabs(true);
      };
    }, [])
  );

  const navigation = useNavigation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden')
      return
    }

    setLoading(true)
    try {
      const user = await getCurrentUser()

      if (user.password !== currentPassword) {
        Alert.alert('Error', 'La contraseña actual es incorrecta')
        setLoading(false)
        return
      }

      const result = await updateUser(user.id, {
        password: newPassword
      })

      if (result.success) {
        Alert.alert(
          'Éxito',
          'Tu contraseña ha sido actualizada correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        )
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar la contraseña')
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      Alert.alert('Error', 'Ocurrió un error al cambiar tu contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={50} color="#f83dd9ff" />
          </View>
          <Text style={styles.subtitle}>Actualiza tu contraseña de acceso</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña Actual</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#999"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nueva contraseña"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Mínimo 6 caracteres</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.securityInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.securityText}>
              Asegúrate de usar una contraseña segura que incluya letras, números y caracteres especiales
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff3f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#333',
    paddingVertical: 15,
  },
  eyeButton: {
    padding: 5,
  },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  securityInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff3f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#f83dd9ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#ddd',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
})

export default CambiarPasswordScreen
