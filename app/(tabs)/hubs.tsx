import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TransportHub } from '../config/constants';
import theme from '../config/theme';
import { supabase } from '../lib/supabase';

export default function HubsScreen() {
  const router = useRouter();
  const [hubs, setHubs] = useState<TransportHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHubs();
  }, []);

  const fetchHubs = async () => {
    try {
      const { data: hubsData, error: hubsError } = await supabase
        .from('transport_hubs')
        .select(`
          *,
          services:transport_services(*)
        `);

      if (hubsError) throw hubsError;

      const formattedHubs: TransportHub[] = hubsData.map(hub => ({
        id: hub.id.toString(), // Ensure ID is a string
        name: hub.name,
        coordinates: {
          lat: hub.latitude,
          lng: hub.longitude
        },
        services: hub.services.map((service: any) => ({
          id: service.id.toString(), // Ensure ID is a string
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
      }));

      setHubs(formattedHubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredHubs = hubs.filter(hub =>
    hub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderHubItem = ({ item }: { item: TransportHub }) => (
    <TouchableOpacity
      style={styles.hubCard}
      onPress={() => router.push(`/(tabs)/hub/${item.id}`)}>
      <Text style={styles.hubName}>{item.name}</Text>
      <Text style={styles.hubDescription}>{item.description}</Text>
      <View style={styles.transportTypeIcons}>
        {item.services.map((service) => (
          <Ionicons
            key={service.id}
            name={service.type}
            size={20}
            color={theme.colors.secondary}
            style={styles.typeIcon}
          />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search hubs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredHubs}
        renderItem={renderHubItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  hubCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  hubName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  hubDescription: {
    fontSize: 14,
    color: theme.colors.gray,
    marginBottom: 8,
  },
  transportTypeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    marginRight: 8,
  },
});