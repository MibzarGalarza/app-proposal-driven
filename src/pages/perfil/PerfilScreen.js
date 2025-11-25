import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getCurrentUser, logoutUser, updateUser } from '../../api/login/login.actions'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemedText from '../../shared/ThemedText'
import * as ImagePicker from 'expo-image-picker'

const PerfilScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  // Recargar datos del usuario cada vez que la pantalla recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData()
    }, [])
  )

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        // Si no hay usuario, redirigir al login
        navigation.navigate('Login')
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error)
      Alert.alert('Error', 'No se pudo cargar la información del usuario')
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tus fotos para cambiar tu imagen de perfil'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotoUri = result.assets[0].uri
        await updateProfilePhoto(newPhotoUri)
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error)
      Alert.alert('Error', 'No se pudo seleccionar la imagen')
    }
  }

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu cámara para tomar una foto'
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotoUri = result.assets[0].uri
        await updateProfilePhoto(newPhotoUri)
      }
    } catch (error) {
      console.error('Error al tomar foto:', error)
      Alert.alert('Error', 'No se pudo tomar la foto')
    }
  }

  const updateProfilePhoto = async (photoUri) => {
    try {
      setLoading(true)
      const result = await updateUser(user.id, { photoUri })
      
      if (result.success) {
        setUser(result.user)
        Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada')
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar la foto')
      }
    } catch (error) {
      console.error('Error al actualizar foto:', error)
      Alert.alert('Error', 'Ocurrió un error al actualizar tu foto')
    } finally {
      setLoading(false)
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

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás segura que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await logoutUser()
              navigation.navigate('Login')
            } catch (error) {
              console.error('Error al cerrar sesión:', error)
              Alert.alert('Error', 'No se pudo cerrar la sesión')
            }
          },
          style: 'destructive'
        }
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Cargando...</ThemedText>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>No se encontró información del usuario</ThemedText>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <TouchableOpacity 
            style={styles.avatarCircle}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            {user.photoUri ? (
              <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="woman" size={60} color="#FFF" />
            )}
            <View style={styles.editPhotoButton}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        <ThemedText center style={styles.userName}>
          {user.nombre} {user.apellido}
        </ThemedText>
        <ThemedText center style={styles.userEmail}>
          {user.email}
        </ThemedText>
      </LinearGradient>

      {/* Información del usuario */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={24} color="#f83dd9ff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre completo</Text>
                <Text style={styles.infoValue}>{user.nombre} {user.apellido}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={24} color="#f83dd9ff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={24} color="#f83dd9ff" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{user.telefono || 'No especificado'}</Text>
              </View>
            </View>

            {user.fechaRegistro && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#f83dd9ff" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Miembro desde</Text>
                    <Text style={styles.infoValue}>
                      {new Date(user.fechaRegistro).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Opciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="create-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Editar Perfil</Text>
              <Text style={styles.optionDescription}>Actualiza tu información personal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => navigation.navigate('CambiarPassword')}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="lock-closed-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Cambiar Contraseña</Text>
              <Text style={styles.optionDescription}>Actualiza tu contraseña de acceso</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Privacidad y Seguridad</Text>
              <Text style={styles.optionDescription}>Configura tu privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="notifications-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Notificaciones</Text>
              <Text style={styles.optionDescription}>Administra tus notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="help-circle-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Centro de Ayuda</Text>
              <Text style={styles.optionDescription}>Encuentra respuestas rápidas</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="document-text-outline" size={24} color="#f83dd9ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Términos y Condiciones</Text>
              <Text style={styles.optionDescription}>Lee nuestros términos de uso</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f83dd9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#FFF',
    marginBottom: 5,
  },
  userEmail: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff3f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff3f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f83dd9ff',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },
  version: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
})

export default PerfilScreen