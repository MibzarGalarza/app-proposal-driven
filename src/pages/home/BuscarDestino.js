import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useRef } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useGlobalState from '../../store/auth';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import * as Location from 'expo-location';
import { API_KEY_MAPS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BuscarDestino = () => {
  const navigation = useNavigation();
  const { setShowTabs, setDestino } = useGlobalState();
  const [isFocused, setIsFocused] = useState(false);
  const [isTextEmpty, setIsTextEmpty] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState([]);
  const googlePlacesRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      // Al enfocar la pantalla, ocultar las tabs
      setShowTabs(false);
      loadRecentDestinations();
      return () => {
        // Al desenfocar la pantalla, mostrar las tabs
        setShowTabs(true);
      };
    }, [])
  );

  const loadRecentDestinations = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentDestinations');
      if (saved) {
        const destinations = JSON.parse(saved);
        setRecentDestinations(destinations.slice(0, 3)); // Solo los últimos 3
      }
    } catch (error) {
      console.error('Error cargando destinos recientes:', error);
    }
  };

  const saveRecentDestination = async (destination) => {
    try {
      const saved = await AsyncStorage.getItem('recentDestinations');
      let destinations = saved ? JSON.parse(saved) : [];
      
      // Evitar duplicados
      destinations = destinations.filter(d => d.description !== destination.description);
      
      // Agregar al inicio
      destinations.unshift(destination);
      
      // Guardar solo los últimos 3
      await AsyncStorage.setItem('recentDestinations', JSON.stringify(destinations.slice(0, 3)));
    } catch (error) {
      console.error('Error guardando destino reciente:', error);
    }
  };

  const handleSelectDestination = async (data, details = null) => {
    console.log('Destino seleccionado:', data);
    console.log('Detalles:', details);
    
    const destinationData = {
      description: data.description,
      placeId: data.place_id,
      details: details
    };

    // Guardar en recientes
    await saveRecentDestination(destinationData);
    
    // Guardar el destino en el estado global
    setDestino(destinationData);

    // Volver a la pantalla anterior
    navigation.goBack();
  };

  const handleSelectRecent = (destination) => {
    setDestino(destination);
    navigation.goBack();
  };

  const clearInput = () => {
    if (googlePlacesRef.current) {
      googlePlacesRef.current.setAddressText('');
      setIsTextEmpty(true);
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Busca el lugar a donde vas"
          onPress={handleSelectDestination}
          query={{
            key: API_KEY_MAPS,
            language: "es",
            location: "24.0277,-104.6714",
            radius: 50000,
          }}
          styles={{
            textInput: isFocused ? styles.textInputFocused : styles.textInput,
            container: styles.inputContainer,
            listView: {
              backgroundColor: '#fff',
              borderRadius: 10,
              marginHorizontal: 10,
              marginTop: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              zIndex: 1000,
            },
            row: {
              backgroundColor: '#fff',
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderBottomColor: '#ddd',
              borderBottomWidth: 1,
            },
            description: {
              fontSize: 16,
              color: '#333',
              fontFamily: 'Poppins_400Regular',
            },
            separator: {
              height: 1,
              backgroundColor: '#e0e0e0',
            },
            poweredContainer: {
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              backgroundColor: '#fff',
            },
            powered: {
              fontSize: 12,
              color: '#999',
            },
          }}
          textInputProps={{
            autoFocus: true,
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            onChangeText: (text) => {
              setIsTextEmpty(text.length === 0);
              setIsSearching(text.length > 0);
            },
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          onFail={(error) => {
            console.log('Error en búsqueda:', error);
            setIsSearching(false);
          }}
          onNotFound={() => {
            console.log('No se encontraron resultados');
            setIsSearching(false);
          }}
          listViewDisplayed="auto"
        />
        
        {!isTextEmpty && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearInput}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Destinos recientes */}
      {isTextEmpty && recentDestinations.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Destinos recientes</Text>
          <FlatList
            data={recentDestinations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.recentItem}
                onPress={() => handleSelectRecent(item)}
              >
                <View style={styles.recentIconContainer}>
                  <Ionicons name="time-outline" size={20} color="#f83dd9ff" />
                </View>
                <View style={styles.recentTextContainer}>
                  <Text style={styles.recentText} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchContainer: {
    position: 'relative',
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    top: 13,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  textInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInputFocused: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    borderWidth: 2,
    borderColor: '#f83dd9ff',
    shadowColor: '#f83dd9ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  searchingText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  recentContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  recentTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentTextContainer: {
    flex: 1,
  },
  recentText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
  },
});

export default BuscarDestino