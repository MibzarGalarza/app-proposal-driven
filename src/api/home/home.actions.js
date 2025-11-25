import AsyncStorage from '@react-native-async-storage/async-storage';

// Datos simulados de conductoras
const DRIVERS = [
  {
    id: 1,
    name: 'María González',
    rating: 4.9,
    trips: 342,
    carModel: 'Toyota Corolla 2020',
    carPlate: 'ABC-123',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Ana Martínez',
    rating: 4.8,
    trips: 289,
    carModel: 'Honda Civic 2021',
    carPlate: 'XYZ-456',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Laura Rodríguez',
    rating: 5.0,
    trips: 521,
    carModel: 'Nissan Versa 2022',
    carPlate: 'DEF-789',
    photo: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    name: 'Carmen López',
    rating: 4.7,
    trips: 198,
    carModel: 'Mazda 3 2021',
    carPlate: 'GHI-012',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
];

// Simular búsqueda de conductora
export const searchDriver = async () => {
  // Simular tiempo de búsqueda (2-4 segundos)
  const searchTime = Math.floor(Math.random() * 2000) + 2000;
  
  await new Promise(resolve => setTimeout(resolve, searchTime));
  
  // Seleccionar conductora aleatoria
  const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
  
  // Simular tiempo de llegada (3-8 minutos)
  const arrivalTime = Math.floor(Math.random() * 6) + 3;
  
  return {
    driver: randomDriver,
    arrivalTime,
    status: 'found'
  };
};

// Guardar viaje solicitado
export const saveTrip = async (tripData) => {
  try {
    const trips = await AsyncStorage.getItem('requestedTrips');
    let tripsArray = trips ? JSON.parse(trips) : [];
    
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      status: 'pending', // pending, in_progress, completed, cancelled
      requestedAt: new Date().toISOString(),
    };
    
    tripsArray.unshift(newTrip);
    
    await AsyncStorage.setItem('requestedTrips', JSON.stringify(tripsArray));
    
    return newTrip;
  } catch (error) {
    console.error('Error guardando viaje:', error);
    throw error;
  }
};

// Obtener viajes solicitados
export const getRequestedTrips = async () => {
  try {
    const trips = await AsyncStorage.getItem('requestedTrips');
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Error obteniendo viajes:', error);
    return [];
  }
};

// Actualizar estado del viaje
export const updateTripStatus = async (tripId, status) => {
  try {
    const trips = await AsyncStorage.getItem('requestedTrips');
    let tripsArray = trips ? JSON.parse(trips) : [];
    
    const tripIndex = tripsArray.findIndex(t => t.id === tripId);
    if (tripIndex !== -1) {
      tripsArray[tripIndex].status = status;
      tripsArray[tripIndex].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem('requestedTrips', JSON.stringify(tripsArray));
      return tripsArray[tripIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error actualizando viaje:', error);
    throw error;
  }
};

// Simular ubicación de conductora acercándose con movimiento realista a ~30 km/h
export const simulateDriverLocation = (origin, destination, arrivalTime) => {
  // Calcular distancia aproximada en km usando fórmula de Haversine
  const R = 6371; // Radio de la Tierra en km
  const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
  const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distancia en km
  
  // Velocidad de 30 km/h
  const speedKmh = 30;
  
  // Calcular tiempo real de viaje en minutos
  const realTripTime = (distance / speedKmh) * 60;
  
  // Número de actualizaciones por minuto (cada 2 segundos = 30 updates/min)
  const updatesPerMinute = 30;
  const steps = Math.max(Math.floor(realTripTime * updatesPerMinute), 40);
  
  const locations = [];
  
  // Calcular la distancia total
  const totalLat = destination.latitude - origin.latitude;
  const totalLng = destination.longitude - origin.longitude;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    
    // Movimiento no lineal: más lento al inicio y al final, más rápido en el medio
    // Usamos una función ease-in-out para simular aceleración y desaceleración
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Calcular posición base
    let lat = origin.latitude + totalLat * easedProgress;
    let lng = origin.longitude + totalLng * easedProgress;
    
    // Añadir pequeñas variaciones aleatorias para simular movimiento por calles
    // Las variaciones son más pequeñas al principio y al final
    const variationFactor = Math.sin(progress * Math.PI) * 0.00008; // Máximo en el medio del viaje
    const randomLat = (Math.random() - 0.5) * variationFactor;
    const randomLng = (Math.random() - 0.5) * variationFactor;
    
    lat += randomLat;
    lng += randomLng;
    
    // Simular ocasionales "pausas" en semáforos (duplicar puntos cercanos)
    // Aproximadamente 5% de probabilidad de pausa
    if (i > 0 && i < steps - 5 && Math.random() < 0.05) {
      // Añadir 2-3 puntos casi idénticos para simular pausa
      const pauseSteps = Math.floor(Math.random() * 2) + 2;
      for (let p = 0; p < pauseSteps; p++) {
        locations.push({
          latitude: lat + (Math.random() - 0.5) * 0.000001,
          longitude: lng + (Math.random() - 0.5) * 0.000001,
        });
      }
    }
    
    locations.push({
      latitude: lat,
      longitude: lng,
    });
  }
  
  // Asegurar que el último punto sea exactamente el destino
  locations[locations.length - 1] = {
    latitude: destination.latitude,
    longitude: destination.longitude,
  };
  
  return locations;
};
