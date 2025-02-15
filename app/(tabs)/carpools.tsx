import { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { CarpoolClub } from '../config/constants';
import theme from '../config/theme';
import CarpoolCard from '../components/carpools/CarpoolCard';
import SearchBar from '../components/carpools/SearchBar';

export const mockCarpools: CarpoolClub[] = [
  {
    id: '1',
    name: 'CBD Commuters',
    description: 'Daily commute to Cape Town CBD. Safe and reliable carpool service.',
    startLocation: 'Table View',
    endLocation: 'Cape Town CBD',
    departureTime: '07:00',
    returnTime: '17:30',
    members: ['John', 'Sarah', 'Mike'],
    capacity: 4,
    cost: 800, // Monthly cost
    daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    contactInfo: '+27123456789',
    driver: {
      id: 'd1',
      name: 'David Smith',
      rating: 4.8,
      totalTrips: 156,
      vehicleInfo: {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        color: 'Silver',
        plateNumber: 'CA 123-456'
      },
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Sarah James',
        rating: 5,
        comment: 'Very reliable and always on time!',
        date: '2024-02-15'
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Mike Johnson',
        rating: 4,
        comment: 'Great carpool group, comfortable ride.',
        date: '2024-02-10'
      }
    ],
    rules: [
      'Be ready 5 minutes before pickup time',
      'No smoking in the vehicle',
      'Notify 24 hours before cancellation',
      'Share fuel costs equally'
    ],
    route: {
      stops: [
        'Table View Main Road',
        'Milnerton MyCiTi',
        'Century City',
        'Cape Town CBD'
      ],
      estimatedDuration: '45 minutes'
    }
  },
  // Add more mock carpools with similar structure
];

export default function CarpoolsScreen() {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [filteredCarpools, setFilteredCarpools] = useState(mockCarpools);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const filtered = mockCarpools.filter((carpool) => {
      const fromMatch = carpool.startLocation
        .toLowerCase()
        .includes(searchFrom.toLowerCase());
      const toMatch = carpool.endLocation
        .toLowerCase()
        .includes(searchTo.toLowerCase());
      return (searchFrom && searchTo) ? (fromMatch && toMatch) 
           : searchFrom ? fromMatch
           : searchTo ? toMatch 
           : true;
    });
    setFilteredCarpools(filtered);
  }, [searchFrom, searchTo]);

  const handleSearchFromChange = (text: string) => {
    setSearchFrom(text);
    handleSearch();
  };

  const handleSearchToChange = (text: string) => {
    setSearchTo(text);
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchFrom={searchFrom}
        searchTo={searchTo}
        onSearchFromChange={handleSearchFromChange}
        onSearchToChange={handleSearchToChange}
      />

      <FlatList
        data={filteredCarpools}
        renderItem={({ item }) => (
          <CarpoolCard
            carpool={item}
            onPress={() => router.push(`/(tabs)/carpool/${item.id}`)}
          />
        )}
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
  listContainer: {
    gap: 16,
  },
}); 