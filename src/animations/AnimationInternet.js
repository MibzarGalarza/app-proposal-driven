import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import useGlobalState from '../store/auth';


const InternetAnimation = () => {
  const { isRestoringConnection, setIsRestoringConnection, setIsConected } = useGlobalState();

  const isDark = false;

  const checkConnection = () => {
    setIsRestoringConnection(true); // Activar el estado de restablecimiento
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log("Conexión restaurada");
        setIsConected(true); // Actualiza el estado de conexión
        setTimeout(() => {
          setIsRestoringConnection(false); // Desactivar el estado de restablecimiento después de un tiempo
        }, 2000); // Muestra el mensaje de restablecimiento durante 2 segundos
      } else {
        console.log("Aún sin conexión");
        setIsConected(false); // Actualiza el estado de conexión
        setTimeout(() => {
          setIsRestoringConnection(false); // Desactivar el estado de restablecimiento después de un tiempo
        }, 2000);
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isRestoringConnection ? (
        <>
          <LottieView
            source={require('../../assets/NoInternet.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text style={[{
            color: '#fff',
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 17,
          }, !isDark && { color: '#000' }]}>
            ¡Parece que no hay internet!
          </Text>
          <Text style={[{
            color: '#fff',
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 14
          }, !isDark && { color: '#000' }]}>
            Revisa tu conexión para seguir navegando
          </Text>
          <TouchableOpacity
            onPress={checkConnection}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: isDark ? '#fff' : '#000',
              borderRadius: 5
            }}
          >
            <Text style={{
              color: isDark ? '#000' : '#fff',
              fontFamily: 'Poppins_600SemiBold',
              textAlign: 'center'
            }}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ marginBottom: 20 }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
          <Text style={{
            color: !isDark ? '#000' : '#fff',
            fontWeight: 'bold',
            fontSize: 17,
            textAlign: 'center'
          }}>
            Restableciendo conexión...
          </Text>
        </>
      )}
    </View>
  );
};

export default InternetAnimation;
