import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TransportHub } from '../config/constants';
import theme from '../config/theme';

// Mock data - Replace with actual API calls
export const mockHubs: TransportHub[] = [
  {
    id: '1',
    name: 'Cape Town Station',
    description: 'Main transport hub in Cape Town CBD',
    coordinates: { lat: -33.9241, lng: 18.4254 },
    transportTypes: [
      {
        id: '1',
        name: 'Southern Line',
        type: 'train',
        icon: 'train',
        operator: 'Metrorail',
        routes: [
          {
            start: 'Cape Town',
            end: 'Simons Town',
            stops: ['Observatory', 'Rondebosch', 'Claremont', 'Wynberg'],
            price: 15,
            schedule: {
              firstDeparture: '05:00',
              lastDeparture: '23:00',
              frequency: 'Every 30 minutes',
            },
          },
        ],
      },
      {
        id: '2',
        name: 'MyCiti Bus',
        type: 'bus',
        icon: 'bus',
        operator: 'MyCiti',
        routes: [
          {
            start: 'Cape Town',
            end: 'Table View',
            stops: ['Woodstock', 'Milnerton', 'Blouberg'],
            price: 25,
            schedule: {
              firstDeparture: '04:30',
              lastDeparture: '22:00',
              frequency: 'Every 15 minutes',
            },
          },
        ],
      },
    ],
  },
  // Add more hubs as needed
];

export default function HubsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderHubItem = ({ item }: { item: TransportHub }) => (
    <TouchableOpacity
      style={styles.hubCard}
      onPress={() => router.push(`/(tabs)/hub/${item.id}`)}>
      <Text style={styles.hubName}>{item.name}</Text>
      <Text style={styles.hubDescription}>{item.description}</Text>
      <View style={styles.transportTypeIcons}>
        {item.transportTypes.map((type) => (
          <Ionicons
            key={type.id}
            name={type.icon}
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
      <Text style={styles.title}>Transport Hubs</Text>
      <FlatList
        data={mockHubs}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.dark,
    marginBottom: 16,
  },
  listContainer: {
    gap: 16,
  },
  hubCard: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hubName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
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