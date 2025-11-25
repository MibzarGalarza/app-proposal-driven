import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import globalStyles from '../../styles/globalStyles';
import AnimationLoading from '../../animations/AnimationLoading';
import ThemedText from '../../shared/ThemedText';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import mapStyle from '../../shared/mapStyle';
import { Ionicons } from '@expo/vector-icons';
import useGlobalState from '../../store/auth';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY_MAPS } from '@env';
import { searchDriver, saveTrip, simulateDriverLocation, updateTripStatus } from '../../api/home/home.actions';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { destino, origen, setShowTabs } = useGlobalState();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [originAddress, setOriginAddress] = useState('Obteniendo dirección...');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [searchingDriver, setSearchingDriver] = useState(false);
  const [driverFound, setDriverFound] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [tripDistance, setTripDistance] = useState(null);
  const [tripDuration, setTripDuration] = useState(null);
  const [tripStatus, setTripStatus] = useState(null); // 'to_origin', 'at_origin', 'to_destination', 'arrived'
  const [remainingTime, setRemainingTime] = useState(null);
  const [currentTripId, setCurrentTripId] = useState(null); // ID del viaje actual
  const mapRef = useRef(null);
  const movementIntervalRef = useRef(null);
  const timeIntervalRef = useRef(null);

  useEffect(() => {
    getLocation();
    
    // Limpiar intervalos al desmontar el componente
    return () => {
      if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Actualizar destino cuando cambie en el estado global
  useFocusEffect(
    React.useCallback(() => {
      if (destino && destino.description) {
        setDestinationAddress(destino.description);
        // Obtener coordenadas del destino si están disponibles
        if (destino.details && destino.details.geometry) {
          const coords = {
            latitude: destino.details.geometry.location.lat,
            longitude: destino.details.geometry.location.lng,
          };
          setDestinationCoords(coords);
          
          // Crear polyline simple (línea recta)
          const originPoint = originCoords || location;
          if (originPoint) {
            setRouteCoordinates([
              { latitude: originPoint.latitude, longitude: originPoint.longitude },
              coords
            ]);
            
            // Ajustar el mapa para mostrar ambos puntos
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.fitToCoordinates([
                  { latitude: originPoint.latitude, longitude: originPoint.longitude },
                  coords
                ], {
                  edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
                  animated: true,
                });
              }
            }, 500);
          }
        }
      }
    }, [destino, location, originCoords])
  );

  // Actualizar origen cuando cambie en el estado global
  useFocusEffect(
    React.useCallback(() => {
      if (origen && origen.description) {
        setOriginAddress(origen.description);
        // Obtener coordenadas del origen si están disponibles
        if (origen.details && origen.details.geometry) {
          const coords = {
            latitude: origen.details.geometry.location.lat,
            longitude: origen.details.geometry.location.lng,
          };
          setOriginCoords(coords);
          
          // Actualizar polyline si hay destino
          if (destinationCoords) {
            setRouteCoordinates([
              coords,
              destinationCoords
            ]);
            
            // Ajustar el mapa para mostrar ambos puntos
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.fitToCoordinates([
                  coords,
                  destinationCoords
                ], {
                  edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
                  animated: true,
                });
              }
            }, 500);
          } else {
            // Solo centrar en el nuevo origen
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.animateToRegion({
                  ...coords,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1500);
              }
            }, 500);
          }
        }
      }
    }, [origen, destinationCoords])
  );

  const getLocation = async () => {
    try {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        Alert.alert(
          'Permiso Denegado',
          'La app necesita acceso a tu ubicación para mostrarte en el mapa',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(userLocation);

      console.log('Ubicación obtenida:', currentLocation.coords);
      
      // Obtener dirección a partir de las coordenadas
      getAddressFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
      
      // Guardar coordenadas de origen inicial
      setOriginCoords(userLocation);
      
      setLoading(false);

      // Hacer zoom animado después de cargar el mapa
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(userLocation, 1500);
        }
      }, 500);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      setErrorMsg('Error al obtener ubicación');
      Alert.alert(
        'Error',
        'No se pudo obtener tu ubicación. Verifica que tengas el GPS activado.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (addressResponse && addressResponse.length > 0) {
        const address = addressResponse[0];
        const formattedAddress = `${address.street || ''}, ${address.district || address.subregion || ''}, ${address.city || ''}`.replace(/, ,/g, ',').trim();
        setOriginAddress(formattedAddress || 'Ubicación desconocida');
        console.log('Dirección:', formattedAddress);
      } else {
        setOriginAddress('No se pudo obtener la dirección');
      }
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      setOriginAddress('Error al obtener dirección');
    }
  };

  const handleRequestTrip = async () => {
    if (!destinationAddress.trim()) {
      Alert.alert('Destino requerido', 'Por favor ingresa tu destino');
      return;
    }

    setSearchingDriver(true);

    try {
      // Buscar conductora
      const result = await searchDriver();
      
      if (result.status === 'found') {
        setDriverFound(result);
        
        // Ocultar tabs cuando se encuentra conductora
        setShowTabs(false);
        
        // Simular ubicación inicial de la conductora (cerca del origen)
        const driverStartLocation = {
          latitude: originCoords.latitude + (Math.random() - 0.5) * 0.01,
          longitude: originCoords.longitude + (Math.random() - 0.5) * 0.01,
        };
        setDriverLocation(driverStartLocation);
        
        // Hacer zoom a la conductora inmediatamente
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateCamera({
              center: driverStartLocation,
              zoom: 16,
              heading: 0,
              pitch: 0,
            }, { duration: 1500 });
          }
        }, 300);
        
        // Guardar viaje en AsyncStorage
        const tripData = {
          origin: {
            address: originAddress,
            coords: originCoords,
          },
          destination: {
            address: destinationAddress,
            coords: destinationCoords,
          },
          driver: result.driver,
          arrivalTime: result.arrivalTime,
          distance: tripDistance,
          duration: tripDuration,
        };
        
        const savedTrip = await saveTrip(tripData);
        setCurrentTripId(savedTrip.id); // Guardar el ID del viaje
        
        // Establecer estado del viaje
        setTripStatus('to_origin');
        
        // Simular movimiento de conductora hacia el origen
        simulateDriverMovement(driverStartLocation, originCoords, result.arrivalTime);
      }
    } catch (error) {
      console.error('Error solicitando viaje:', error);
      Alert.alert('Error', 'No se pudo solicitar el viaje. Intenta nuevamente.');
    } finally {
      setSearchingDriver(false);
    }
  };

  const simulateDriverMovement = (start, end, arrivalMinutes) => {
    const locations = simulateDriverLocation(start, end, arrivalMinutes);
    const stepDuration = (arrivalMinutes * 60 * 1000) / locations.length; // milisegundos por paso
    
    let currentStep = 0;
    
    // Iniciar contador de tiempo
    setRemainingTime(arrivalMinutes);
    startTimeCountdown(arrivalMinutes);
    
    movementIntervalRef.current = setInterval(() => {
      if (currentStep < locations.length) {
        const newLocation = locations[currentStep];
        setDriverLocation(newLocation);
        
        // Animar cámara para seguir a la conductora de manera suave
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: newLocation,
            zoom: 16,
            heading: 0,
            pitch: 0,
          }, { duration: stepDuration * 0.9 }); // Ligeramente más rápido para suavidad
        }
        
        currentStep++;
      } else {
        clearInterval(movementIntervalRef.current);
        // Conductora llegó al origen
        setTripStatus('at_origin');
        
        // Usar setDriverFound con callback para obtener el valor actual
        setDriverFound(currentDriver => {
          if (currentDriver) {
            Alert.alert(
              '¡Tu conductora ha llegado!',
              `${currentDriver.driver.name} está esperándote en el punto de origen.`,
              [
                {
                  text: 'Iniciar viaje',
                  onPress: () => {
                    startTripToDestination();
                  }
                }
              ]
            );
          }
          return currentDriver;
        });
      }
    }, stepDuration);
  };

  const startTimeCountdown = (minutes) => {
    let totalSeconds = minutes * 60;
    
    timeIntervalRef.current = setInterval(() => {
      totalSeconds--;
      
      if (totalSeconds <= 0) {
        clearInterval(timeIntervalRef.current);
        setRemainingTime(0);
      } else {
        setRemainingTime(Math.ceil(totalSeconds / 60));
      }
    }, 1000);
  };

  const startTripToDestination = async () => {
    // Actualizar estado del viaje a en progreso
    if (currentTripId) {
      try {
        await updateTripStatus(currentTripId, 'in_progress');
        console.log('Viaje iniciado, ID:', currentTripId);
      } catch (error) {
        console.error('Error al actualizar estado del viaje:', error);
      }
    }
    
    // Limpiar intervalos anteriores
    if (movementIntervalRef.current) {
      clearInterval(movementIntervalRef.current);
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
    
    setTripStatus('to_destination');
    
    // Ajustar el mapa para mostrar la ruta completa desde origen hasta destino
    setTimeout(() => {
      if (mapRef.current && originCoords && destinationCoords) {
        mapRef.current.fitToCoordinates([
          originCoords,
          destinationCoords
        ], {
          edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
          animated: true,
        });
      }
    }, 300);
    
    // Simular viaje al destino
    if (tripDuration) {
      simulateDriverMovementToDestination(originCoords, destinationCoords, tripDuration);
    }
  };

  const simulateDriverMovementToDestination = (start, end, durationMinutes) => {
    const locations = simulateDriverLocation(start, end, durationMinutes);
    const stepDuration = (durationMinutes * 60 * 1000) / locations.length;
    
    let currentStep = 0;
    
    // Iniciar contador de tiempo
    setRemainingTime(Math.ceil(durationMinutes));
    startTimeCountdown(durationMinutes);
    
    movementIntervalRef.current = setInterval(() => {
      if (currentStep < locations.length) {
        const newLocation = locations[currentStep];
        setDriverLocation(newLocation);
        
        // Animar cámara con zoom más alejado para ver la ruta completa
        if (mapRef.current && currentStep % 3 === 0) { // Actualizar cámara cada 3 pasos para suavidad
          mapRef.current.animateCamera({
            center: newLocation,
            zoom: 14, // Zoom más alejado que antes (era 16)
            heading: 0,
            pitch: 0,
          }, { duration: stepDuration * 2.5 });
        }
        
        currentStep++;
      } else {
        clearInterval(movementIntervalRef.current);
        clearInterval(timeIntervalRef.current);
        
        // Llegada al destino
        setTripStatus('arrived');
        setRemainingTime(0);
        
        // Usar setDriverFound con callback para obtener el valor actual
        setDriverFound(currentDriver => {
          if (currentDriver) {
            Alert.alert(
              '¡Has llegado a tu destino!',
              `Esperamos que hayas disfrutado tu viaje con ${currentDriver.driver.name}. ¡Hasta pronto!`,
              [
                {
                  text: 'Finalizar',
                  onPress: async () => {
                    // Actualizar estado del viaje a completado
                    if (currentTripId) {
                      try {
                        await updateTripStatus(currentTripId, 'completed');
                        console.log('Viaje completado, ID:', currentTripId);
                      } catch (error) {
                        console.error('Error al completar viaje:', error);
                      }
                    }
                    
                    // Reiniciar estado
                    setDriverFound(null);
                    setDriverLocation(null);
                    setTripStatus(null);
                    setRemainingTime(null);
                    setDestinationAddress('');
                    setDestinationCoords(null);
                    setRouteCoordinates([]);
                    setCurrentTripId(null);
                    
                    // Mostrar tabs nuevamente
                    setShowTabs(true);
                  }
                }
              ]
            );
          }
          return currentDriver;
        });
      }
    }, stepDuration);
  };


  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <View style={globalStyles.loadingCircle}>
          <AnimationLoading />
        </View>
        <ThemedText type="normalBold" style={globalStyles.loadingText}>
          Obteniendo tu ubicación...
        </ThemedText>
        <ThemedText type="normalSmall" style={globalStyles.loadingSubtext}>
          Por favor espera un momento
        </ThemedText>
      </View>
    )
  }

  if (errorMsg || !location) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText type="normalBold" style={styles.errorText}>
          {errorMsg || 'No se pudo obtener tu ubicación'}
        </ThemedText>
        <ThemedText type="normalSmall" style={styles.errorSubtext}>
          Verifica que tengas el GPS activado y los permisos concedidos
        </ThemedText>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={!driverLocation} // Solo seguir al usuario si no hay conductora activa
        customMapStyle={mapStyle}
      >
        {/* Marcador de origen */}
        {originCoords && (
          <Marker
            coordinate={{
              latitude: originCoords.latitude,
              longitude: originCoords.longitude,
            }}
            title="Origen"
            description={originAddress}
            pinColor="#f83dd9ff"
          >
            <View style={styles.originMarker}>
              <Ionicons name="location" size={30} color="#f83dd9ff" />
            </View>
          </Marker>
        )}

        {/* Marcador de destino */}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destino"
            description={destinationAddress}
            pinColor="#14b8a5"
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="flag" size={30} color="#14b8a5" />
            </View>
          </Marker>
        )}

        {/* Ruta con MapViewDirections */}
        {originCoords && destinationCoords && !driverLocation && (
          <MapViewDirections
            origin={originCoords}
            destination={destinationCoords}
            apikey={API_KEY_MAPS}
            strokeWidth={5}
            strokeColor="#f83dd9ff"
            optimizeWaypoints={true}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              
              setTripDistance(result.distance);
              setTripDuration(result.duration);
              
              // Ajustar el mapa para mostrar toda la ruta
              if (mapRef.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
                  animated: true,
                });
              }
            }}
            onError={(errorMessage) => {
              console.log('GOT AN ERROR', errorMessage);
            }}
          />
        )}

        {/* Ruta de la conductora al origen */}
        {driverLocation && originCoords && driverFound && tripStatus === 'to_origin' && (
          <MapViewDirections
            origin={driverLocation}
            destination={originCoords}
            apikey={API_KEY_MAPS}
            strokeWidth={4}
            strokeColor="#14b8a5"
            lineDashPattern={[5, 5]}
            optimizeWaypoints={true}
            onError={(errorMessage) => {
              console.log('Error en ruta de conductora:', errorMessage);
            }}
          />
        )}

        {/* Ruta de la conductora al destino durante el viaje */}
        {driverLocation && destinationCoords && driverFound && tripStatus === 'to_destination' && (
          <MapViewDirections
            origin={driverLocation}
            destination={destinationCoords}
            apikey={API_KEY_MAPS}
            strokeWidth={5}
            strokeColor="#f83dd9ff"
            optimizeWaypoints={true}
            onReady={result => {
              console.log(`Ruta al destino - Distance: ${result.distance} km`);
              console.log(`Ruta al destino - Duration: ${result.duration} min.`);
            }}
            onError={(errorMessage) => {
              console.log('Error en ruta al destino:', errorMessage);
            }}
          />
        )}

        {/* Marcador de conductora */}
        {driverLocation && driverFound && (
          <Marker
            coordinate={driverLocation}
            title={driverFound.driver.name}
            description={`${driverFound.driver.carModel} - ${driverFound.driver.carPlate}`}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.driverMarker}>
              <Image 
                source={{ uri: driverFound.driver.photo }}
                style={styles.driverMarkerImage}
              />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Card de solicitud de viaje */}
      <View style={styles.bottomCard}>
        <View style={styles.cardContent}>
          {searchingDriver ? (
            // Estado de búsqueda
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="large" color="#f83dd9ff" />
              <Text style={styles.searchingTitle}>Buscando conductora...</Text>
              <Text style={styles.searchingSubtitle}>
                Estamos encontrando la mejor conductora para tu viaje
              </Text>
            </View>
          ) : driverFound ? (
            // Conductora encontrada
            <View style={styles.driverFoundContainer}>
              <Text style={styles.cardTitle}>
                {tripStatus === 'to_origin' && '¡Conductora en camino!'}
                {tripStatus === 'at_origin' && '¡Tu conductora ha llegado!'}
                {tripStatus === 'to_destination' && '¡En camino al destino!'}
                {tripStatus === 'arrived' && '¡Has llegado!'}
              </Text>
              
              <View style={styles.driverCard}>
                <Image 
                  source={{ uri: driverFound.driver.photo }}
                  style={styles.driverPhoto}
                />
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driverFound.driver.name}</Text>
                  <View style={styles.driverRating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{driverFound.driver.rating}</Text>
                    <Text style={styles.tripsText}>• {driverFound.driver.trips} viajes</Text>
                  </View>
                  <Text style={styles.carInfo}>
                    {driverFound.driver.carModel} - {driverFound.driver.carPlate}
                  </Text>
                </View>
              </View>

              {remainingTime !== null && remainingTime > 0 && (
                <View style={styles.arrivalInfo}>
                  <Ionicons name="time-outline" size={20} color="#f83dd9ff" />
                  <View style={styles.arrivalTextContainer}>
                    <Text style={styles.arrivalText}>
                      {tripStatus === 'to_origin' && 'Llegará en '}
                      {tripStatus === 'to_destination' && 'Llegarás en '}
                      <Text style={styles.arrivalTime}>
                        {remainingTime} {remainingTime === 1 ? 'minuto' : 'minutos'}
                      </Text>
                    </Text>
                    <Text style={styles.estimatedTime}>
                      Hora estimada: {(() => {
                        const now = new Date();
                        now.setMinutes(now.getMinutes() + remainingTime);
                        return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </Text>
                  </View>
                </View>
              )}

              {tripStatus === 'at_origin' && (
                <View style={styles.waitingInfo}>
                  <Ionicons name="checkmark-circle" size={20} color="#14b8a5" />
                  <Text style={styles.waitingText}>
                    Tu conductora está esperándote
                  </Text>
                </View>
              )}

              {tripDistance && tripDuration && tripStatus !== 'arrived' && (
                <View style={styles.tripInfo}>
                  <View style={styles.tripInfoItem}>
                    <Ionicons name="navigate-outline" size={18} color="#666" />
                    <Text style={styles.tripInfoText}>{tripDistance.toFixed(1)} km</Text>
                  </View>
                  <View style={styles.tripInfoItem}>
                    <Ionicons name="time-outline" size={18} color="#666" />
                    <Text style={styles.tripInfoText}>{Math.round(tripDuration)} min</Text>
                  </View>
                </View>
              )}

              {tripStatus !== 'arrived' && tripStatus !== 'at_origin' && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={async () => {
                    // Actualizar estado del viaje a cancelado
                    if (currentTripId) {
                      try {
                        await updateTripStatus(currentTripId, 'cancelled');
                        console.log('Viaje cancelado, ID:', currentTripId);
                      } catch (error) {
                        console.error('Error al cancelar viaje:', error);
                      }
                    }
                    
                    // Limpiar intervalos
                    if (movementIntervalRef.current) {
                      clearInterval(movementIntervalRef.current);
                    }
                    if (timeIntervalRef.current) {
                      clearInterval(timeIntervalRef.current);
                    }
                    
                    setDriverFound(null);
                    setDriverLocation(null);
                    setTripStatus(null);
                    setRemainingTime(null);
                    setCurrentTripId(null);
                    
                    // Mostrar tabs nuevamente
                    setShowTabs(true);
                    
                    Alert.alert('Viaje cancelado', 'Has cancelado la solicitud de viaje');
                  }}
                >
                  <Ionicons name="close-circle-outline" size={18} color="#f83dd9ff" />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}

              {tripStatus === 'at_origin' && (
                <TouchableOpacity 
                  style={styles.startTripButton}
                  onPress={startTripToDestination}
                >
                  <Ionicons name="play-circle" size={24} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.startTripButtonText}>Iniciar viaje al destino</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Formulario de solicitud
            <>
              <Text style={styles.cardTitle}>Solicitar viaje</Text>
          
          {/* Origen */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color="#f83dd9ff" />
            </View>
            <View style={styles.inputTextContainer}>
              <Text style={styles.inputLabel}>Lugar de origen</Text>
              <TouchableOpacity 
                style={styles.destinationInput}
                onPress={() => navigation.navigate('BuscarInicio')}
              >
                <Text style={styles.inputValue} numberOfLines={1}>
                  {originAddress}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Destino */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="flag" size={20} color="#f83dd9ff" />
            </View>
            <View style={styles.inputTextContainer}>
              <Text style={styles.inputLabel}>¿A dónde vamos?</Text>
              <TouchableOpacity 
                style={styles.destinationInput}
                onPress={() => navigation.navigate('BuscarDestino')}
              >
                <Text style={[
                  styles.destinationText,
                  !destinationAddress && styles.destinationPlaceholder
                ]}>
                  {destinationAddress || 'Ingresa tu destino'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de solicitar viaje */}
          <TouchableOpacity 
            style={[
              styles.requestButton,
              !destinationAddress && styles.requestButtonDisabled
            ]}
            onPress={handleRequestTrip}
            disabled={!destinationAddress}
          >
            <Ionicons name="car-sport" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.requestButtonText}>Solicitar viaje</Text>
          </TouchableOpacity>
          </>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputTextContainer: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  inputValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#333',
  },
  destinationInput: {
    paddingVertical: 2,
  },
  destinationText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#333',
  },
  destinationPlaceholder: {
    color: '#999',
    fontFamily: 'Poppins_400Regular',
  },
  requestButton: {
    backgroundColor: '#f83dd9ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  requestButtonDisabled: {
    backgroundColor: '#ddd',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  requestButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  originMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  driverMarker: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#f83dd9ff',
    overflow: 'hidden',
  },
  driverMarkerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27.5,
  },
  searchingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  searchingTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 15,
  },
  searchingSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  driverFoundContainer: {
    paddingVertical: 5,
  },
  driverCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  driverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  driverInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#333',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  tripsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  carInfo: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  arrivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  arrivalTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  arrivalText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#333',
  },
  arrivalTime: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#f83dd9ff',
  },
  estimatedTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripInfoText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f83dd9ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#f83dd9ff',
    marginLeft: 4,
  },
  startTripButton: {
    backgroundColor: '#14b8a5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startTripButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  waitingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f7f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  waitingText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#14b8a5',
    marginLeft: 8,
  },
})

export default HomeScreen