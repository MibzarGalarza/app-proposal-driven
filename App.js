import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, Platform, Linking } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as Updates from "expo-updates"
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { API_VERSION_URL } from "@env"
import useGlobalState from './src/store/auth';
import globalStyles from './src/styles/globalStyles';
import InternetAnimation from './src/animations/AnimationInternet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './Navigation';

export default function App() {

  //Estados globales
  const { isConected, setIsConected, setVersionAndroid, setVersionIos, versionAndroid, versionIos } = useGlobalState();

  //Modales visibles de actualizacion (OTA) OVER-TO-AIR
  const [modalVisibleUpdates, setModalVisibleUpdates] = useState(false); // State for modal visibility

  //Modal de verciones de la aplicion
  const [modalVisible, setModalVisible] = useState(false);


  //Loading global
  const [isLoading, setIsLoading] = useState(true);

  //Version actual de la aplicacion
  const versionApp = Constants?.expoConfig?.version;


  useEffect(() => {
    //fetchVersions();
    onFetchUpdateAsync();
  }, []);


  useEffect(() => {
    if (versionAndroid !== null && versionIos !== null) {
      checkVersion();
    }
  }, [versionAndroid, versionIos]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`${API_VERSION_URL}/api/v1/versiones_app/get_last_version/${3}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta:", {
          status: response.status,
          statusText: response.statusText,
          message: errorData.message || 'Error al registrar.',
        });
        throw new Error(errorData.message || 'Error al registrar.');
      } else {
        const data = await response.json();
        if (data?.version) {
          setVersionAndroid(data?.version?.version_android);
          setVersionIos(data?.version?.version_ios);
        }
      }
    } catch (error) {
      console.error("Error al obtener versiones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVersion = () => {
    if (Platform.OS === 'ios' && versionApp < versionIos) {
      setModalVisible(true);
    } else if (Platform.OS === 'android' && versionApp < versionAndroid) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  const checkAgain = () => {
    setTimeout(async () => {
      await fetchVersions();
    }, 200);
  };

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setModalVisibleUpdates(true); // Mostrar el modal para la actualización
      }
    } catch (error) {
      console.error(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConected(state?.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync(); // Descarga la actualización
      await Updates.reloadAsync(); // Reinicia la app con la nueva versión
    } catch (error) {
      console.error('Error al actualizar la app:', error);
    }

  };

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
  });


  if (!fontsLoaded) {
    return null; // Puedes poner aquí un indicador de carga si lo prefieres
  }



  if (!isConected) {
    return (
      <View style={globalStyles.loadingContainer}>
        <InternetAnimation />
      </View>
    );
  }


  const requiredVersion = Platform.OS === 'ios' ? versionIos : versionAndroid;
  const platformIcon = Platform.OS === 'ios' ? 'apple' : 'android';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {(modalVisible || modalVisibleUpdates) ? (
          <>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => { }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={checkAgain}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#FFF" />
                  </TouchableOpacity>

                  <View style={styles.bottomRow}>
                    <Image
                      source={require('./assets/icon.png')} // Ajusta la ruta a tu icono
                      style={styles.appIcon}
                    />
                    <View style={styles.appInfo}>
                      <Text style={styles.appName}>SmartCity</Text>
                      <Text style={styles.creatorName}>Grupo Garza Limón</Text>

                      <View style={styles.versionContainer}>
                        <MaterialCommunityIcons name={platformIcon} size={24} color="#ccc" />
                        <Text style={styles.versionText}>Versión requerida: {requiredVersion}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      const storeURL = Platform.OS === 'ios'
                        ? 'https://apps.apple.com/mx/app/notigram/id1318434905' // Reemplaza con tu link de iOS
                        : 'https://play.google.com/store/apps/details?id=com.ggl.notigram&hl=es_MX'; // Reemplaza con tu link de Android

                      Linking.openURL(storeURL).catch(err => console.error("Failed to open URL:", err));
                    }}
                  >
                    <Text style={styles.buttonText}>Actualizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleUpdates}
              onRequestClose={() => {
                // Do nothing to prevent modal from closing via back button
                return;
              }}
            >
              <View style={styles.modalContainerUpdate}>
                <View style={styles.modalViewUpdate}>
                  <View style={styles.bottomRowUpdate}>
                    <Image
                      source={require('./assets/icon.png')} // Adjust path to your app icon
                      style={styles.appIcon}
                    />
                    <View style={styles.appInfo}>
                      <Text style={styles.appNameUpdate}>SmartCity</Text>
                      <Text style={styles.creatorNameUpdate}>Grupo Garza Limon</Text>

                      <View style={styles.versionContainer}>
                        <Text style={[styles.versionText, { textAlign: 'center' }]}>Existe una nueva version actualiza los datos</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.buttonUpdatesCorrect}
                    onPress={handleUpdate}
                  >
                    <MaterialCommunityIcons name='refresh' size={24} color="#ccc" />
                    <Text style={styles.buttonText}>Actualizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Navigation />
        )}
        <StatusBar style="light" translucent={false} backgroundColor="transparent" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
  },
  closeButton: {
    position: 'absolute',
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    zIndex: 10, // Ensures it stays on top
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0D1117',
    padding: 20,
    alignItems: 'center',
  },
  appIcon: {
    width: 80,
    height: 80,
    marginRight: 10, // Space between icon and text
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10
  },
  appInfo: {
    justifyContent: 'center', // Center the text vertically
  },
  appName: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  appNameUpdate: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
    textAlign: 'center'
  },
  creatorNameUpdate: {
    fontSize: 12,
    color: '#4493F8',
    marginBottom: 5,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center'
  },
  creatorName: {
    fontSize: 12,
    color: '#4493F8',
    marginBottom: 5,
    fontFamily: 'Poppins_600SemiBold',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  versionText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#ccc',
    fontFamily: 'Poppins_600SemiBold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF', // Customize the button color
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 30
  },
  buttonUpdatesCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF', // Customize the button color
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 30,
    gap: 20,
    justifyContent: 'center'
  },
  buttonUpdates: {
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 30,
    borderColor: '#ccc',
    borderWidth: 1
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center'
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start
    marginTop: 20, // Space above the bottom row
    width: '100%', // Full width of the modal
  },
  modalContainerUpdate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo más oscuro para mejor contraste
  },
  modalViewUpdate: {
    backgroundColor: '#2C2F33', // Fondo más elegante
    borderColor: '#3D444D',
    borderWidth: 1,
    borderRadius: 15, // Bordes más redondeados
    padding: 20,
    alignItems: 'center',
    width: '85%', // Ajusta el ancho del modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Para sombras en Android
  },
  bottomRowUpdate: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start
    marginTop: 20, // Space above the bottom row
    width: '100%', // Full width of the modal
  },
});