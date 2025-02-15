import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { TransportHub } from '../../config/constants';

export default function HubDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hub, setHub] = useState<TransportHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHubDetails();
  }, [id]);

  const fetchHubDetails = async () => {
    try {
      const { data, error: hubError } = await supabase
        .from('transport_hubs')
        .select(`
          *,
          services:transport_services(*)
        `)
        .eq('id', id)
        .single();

      if (hubError) throw hubError;

      setHub({
        id: data.id,
        name: data.name,
        coordinates: {
          lat: data.latitude,
          lng: data.longitude
        },
        services: data.services.map((service: any) => ({
          id: service.id,
          type: service.type,
          name: service.name,
          cost: service.cost,
          route: {
            start: service.route_start,
            end: service.route_end,
            stops: service.route_stops
          },
          schedule: {
            departure: service.schedule_departure,
            arrival: service.schedule_arrival,
            frequency: service.schedule_frequency
          }
        }))
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = hub?.services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error || !hub) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Hub not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{hub.name}</Text>
        <Text style={styles.subtitle}>{hub.services.length} Available Services</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search services..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.servicesContainer}>
        {filteredServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Ionicons
                name={service.type === 'bus' ? 'bus' : service.type === 'train' ? 'train' : 'car'}
                size={24}
                color="#0066cc"
              />
              <Text style={styles.serviceName}>{service.name}</Text>
            </View>

            <View style={styles.serviceInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="cash" size={20} color="#666" />
                <Text style={styles.infoText}>R{service.cost}</Text>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <Ionicons name="location" size={20} color="#666" />
                  <Text style={styles.routeText}>{service.route.start}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <Ionicons name="navigate" size={20} color="#666" />
                  <Text style={styles.routeText}>{service.route.end}</Text>
                </View>
              </View>

              <View style={styles.stopsContainer}>
                <Text style={styles.stopsTitle}>Stops:</Text>
                {service.route.stops.map((stop, index) => (
                  <Text key={index} style={styles.stopText}>• {stop}</Text>
                ))}
              </View>

              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>Schedule</Text>
                <Text style={styles.scheduleText}>
                  {service.schedule.departure} - {service.schedule.arrival}
                </Text>
                <Text style={styles.frequencyText}>{service.schedule.frequency}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    margin: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  serviceInfo: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  routeContainer: {
    marginTop: 10,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 9,
    marginVertical: 5,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
  },
  stopsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  stopText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
  },
  scheduleContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
  },
  frequencyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});