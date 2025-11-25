import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getCurrentUser, updateUser } from '../../api/login/login.actions'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'react-native'
import useGlobalState from '../../store/auth'

const EditarPerfilScreen = () => {

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
  const [user, setUser] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [photoUri, setPhotoUri] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setNombre(currentUser.nombre || '')
        setApellido(currentUser.apellido || '')
        setTelefono(currentUser.telefono || '')
        setPhotoUri(currentUser.photoUri || null)
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error)
    }
  }

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tus fotos para cambiar tu imagen de perfil'
        )
        return
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error)
      Alert.alert('Error', 'No se pudo seleccionar la imagen')
    }
  }

  const takePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu cámara para tomar una foto'
        )
        return
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error al tomar foto:', error)
      Alert.alert('Error', 'No se pudo tomar la foto')
    }
  }

  const handleChangePhoto = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      'Selecciona una opción',
      [
        {
          text: 'Tomar foto',
          onPress: takePhoto
        },
        {
          text: 'Elegir de galería',
          onPress: pickImage
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    )
  }

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)
    try {
      const result = await updateUser(user.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        photoUri: photoUri
      })

      if (result.success) {
        Alert.alert(
          'Éxito',
          'Tu perfil ha sido actualizado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        )
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el perfil')
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      Alert.alert('Error', 'Ocurrió un error al actualizar tu perfil')
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="woman" size={50} color="#f83dd9ff" />
            )}
          </View>
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
          >
            <Ionicons name="camera" size={20} color="#f83dd9ff" />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu apellido"
                placeholderTextColor="#999"
                value={apellido}
                onChangeText={setApellido}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu teléfono"
                placeholderTextColor="#999"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={user?.email}
                editable={false}
              />
            </View>
            <Text style={styles.helperText}>El email no puede ser modificado</Text>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
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
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff3f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#f83dd9ff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  changePhotoText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#f83dd9ff',
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
  inputContainer: {
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
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
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
  inputTextDisabled: {
    color: '#999',
  },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
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

export default EditarPerfilScreen
