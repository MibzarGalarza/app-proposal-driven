import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../styles/globalStyles';
import ThemedText from '../../shared/ThemedText';
import { getRequestedTrips } from '../../api/home/home.actions';
import AnimationLoading from '../../animations/AnimationLoading';

const ViajesScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const tripsData = await getRequestedTrips();
      setTrips(tripsData);
    } catch (error) {
      console.error('Error cargando viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#14b8a5';
      case 'pending':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En progreso';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const renderTripItem = ({ item }) => (
    <View style={styles.tripCard}>
      {/* Header con conductora */}
      <View style={styles.tripHeader}>
        <Image
          source={{ uri: item.driver.photo }}
          style={styles.driverPhoto}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.driver.name}</Text>
          <View style={styles.driverRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.driver.rating}</Text>
            <Text style={styles.carText}>• {item.driver.carModel}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {/* Ruta del viaje */}
      <View style={styles.routeContainer}>
        <View style={styles.routeItem}>
          <View style={styles.routeIconContainer}>
            <Ionicons name="location" size={18} color="#f83dd9ff" />
          </View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeLabel}>Origen</Text>
            <Text style={styles.routeAddress} numberOfLines={2}>
              {item.origin.address}
            </Text>
          </View>
        </View>

        <View style={styles.routeDivider} />

        <View style={styles.routeItem}>
          <View style={styles.routeIconContainer}>
            <Ionicons name="flag" size={18} color="#14b8a5" />
          </View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeLabel}>Destino</Text>
            <Text style={styles.routeAddress} numberOfLines={2}>
              {item.destination.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Información del viaje */}
      <View style={styles.tripInfo}>
        <View style={styles.tripInfoItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.tripInfoText}>{formatDate(item.requestedAt)}</Text>
        </View>
        <View style={styles.tripInfoItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.tripInfoText}>{formatTime(item.requestedAt)}</Text>
        </View>
        {item.distance && (
          <View style={styles.tripInfoItem}>
            <Ionicons name="navigate-outline" size={16} color="#666" />
            <Text style={styles.tripInfoText}>{item.distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="car-sport-outline" size={60} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No hay viajes registrados</Text>
      <Text style={styles.emptySubtitle}>
        Tus viajes aparecerán aquí una vez que solicites uno
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <View style={globalStyles.loadingCircle}>
          <AnimationLoading />
        </View>
        <ThemedText type="normalBold" style={globalStyles.loadingText}>
          Cargando viajes...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Viajes</Text>
        <Text style={styles.headerSubtitle}>
          {trips.length} {trips.length === 1 ? 'viaje registrado' : 'viajes registrados'}
        </Text>
      </View>

      {/* Lista de viajes */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f83dd9ff']}
            tintColor="#f83dd9ff"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#333',
  },
  headerSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  driverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
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
  carText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#fff',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  routeAddress: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  routeDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginLeft: 15,
    marginVertical: 4,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripInfoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ViajesScreen;