import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import globalStyles from '../../styles/globalStyles'
import AnimationLoading from '../../animations/AnimationLoading'
import ThemedText from '../../shared/ThemedText'

const LoadingScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    try {
      // Simular tiempo de carga mínimo para que se vea la animación
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verificar si hay un usuario con sesión activa
      const currentUserData = await AsyncStorage.getItem('currentUser')
      
      if (currentUserData) {
        const user = JSON.parse(currentUserData)
        console.log('Usuario encontrado en sesión:', user.nombre)
        
        // Si hay usuario, verificar si tiene huella digital activada
        const huellaDigital = await AsyncStorage.getItem('huellaDigital')
        
        if (huellaDigital === 'true') {
          // Si tiene huella digital, podría pedirla aquí antes de navegar
          console.log('Usuario con huella digital activada')
        }
        
        // Navegar a Home
        navigation.replace('Home')
      } else {
        console.log('No hay sesión activa, ir a Login')
        // No hay sesión, ir a Login
        navigation.replace('Login')
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error)
      // En caso de error, ir a Login por seguridad
      navigation.replace('Login')
    }
  }

  return (
    <View style={globalStyles.centerContainer}>
      <View style={globalStyles.loadingCircle}>
        <AnimationLoading />
      </View>
      <ThemedText type="normalBold" style={globalStyles.loadingText}>
        Cargando...
      </ThemedText>
      <ThemedText type="normalSmall" style={globalStyles.loadingSubtext}>
        Por favor espera un momento
      </ThemedText>
    </View>
  )
}

export default LoadingScreen