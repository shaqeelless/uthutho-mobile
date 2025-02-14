import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransportHub, TransportService } from '../config/constants';

// Mock data - Replace with actual API calls to HERE Maps
const mockHubs: TransportHub[] = [
  {
    id: '1',
    name: 'Cape Town Station',
    coordinates: { lat: -33.9241, lng: 18.4254 },
    services: [
      {
        id: '1',
        type: 'train',
        name: 'Southern Line',
        cost: 15,
        route: {
          start: 'Cape Town',
          end: 'Simons Town',
          stops: ['Observatory', 'Rondebosch', 'Claremont'],
        },
        schedule: {
          departure: '05:00',
          arrival: '23:00',
          frequency: 'Every 30 minutes',
        },
      },
    ],
  },
];

export default function HubsScreen() {
  const [selectedHub, setSelectedHub] = useState<TransportHub | null>(null);

  const renderServiceItem = ({ item }: { item: TransportService }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceHeader}>
        <Ionicons
          name={item.type === 'bus' ? 'bus' : item.type === 'train' ? 'train' : 'car'}
          size={24}
          color="#0066cc"
        />
        <Text style={styles.serviceName}>{item.name}</Text>
      </View>
      <Text style={styles.serviceDetail}>Cost: R{item.cost}</Text>
      <Text style={styles.serviceDetail}>
        Route: {item.route.start} → {item.route.end}
      </Text>
      <Text style={styles.serviceDetail}>Schedule: {item.schedule.frequency}</Text>
    </View>
  );

  const renderHubItem = ({ item }: { item: TransportHub }) => (
    <TouchableOpacity
      style={[
        styles.hubItem,
        selectedHub?.id === item.id && styles.selectedHub,
      ]}
      onPress={() => setSelectedHub(item)}>
      <Text style={styles.hubName}>{item.name}</Text>
      <Text style={styles.hubDetail}>
        {item.services.length} transport services available
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockHubs}
        renderItem={renderHubItem}
        keyExtractor={(item) => item.id}
        style={styles.hubList}
      />
      {selectedHub && (
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>
            Available Services at {selectedHub.name}
          </Text>
          <FlatList
            data={selectedHub.services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            style={styles.servicesList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hubList: {
    flex: 1,
  },
  hubItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedHub: {
    backgroundColor: '#e6f0ff',
    borderColor: '#0066cc',
    borderWidth: 1,
  },
  hubName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  hubDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  servicesContainer: {
    flex: 2,
    backgroundColor: '#ffffff',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  servicesList: {
    flex: 1,
  },
  serviceItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  serviceDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});