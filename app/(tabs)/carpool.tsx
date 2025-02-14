import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarpoolClub } from '../config/constants';

// Mock data - Replace with actual API calls to HERE Maps
const mockCarpoolClubs: CarpoolClub[] = [
  {
    id: '1',
    name: 'CBD Commuters',
    destination: 'Cape Town CBD',
    departureLocation: 'Table View',
    schedule: {
      departureTimes: ['07:00', '17:30'],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    members: 8,
    cost: 30,
    coordinates: {
      lat: -33.8213,
      lng: 18.4947,
    },
  },
];

export default function CarpoolScreen() {
  const renderClubItem = ({ item }: { item: CarpoolClub }) => (
    <TouchableOpacity style={styles.clubItem}>
      <View style={styles.clubHeader}>
        <Ionicons name="car" size={24} color="#0066cc" />
        <Text style={styles.clubName}>{item.name}</Text>
      </View>
      <View style={styles.clubDetails}>
        <Text style={styles.detailText}>
          <Ionicons name="location" size={16} color="#666" /> From:{' '}
          {item.departureLocation}
        </Text>
        <Text style={styles.detailText}>
          <Ionicons name="navigate" size={16} color="#666" /> To:{' '}
          {item.destination}
        </Text>
        <Text style={styles.detailText}>
          <Ionicons name="time" size={16} color="#666" /> Departure:{' '}
          {item.schedule.departureTimes.join(' & ')}
        </Text>
        <Text style={styles.detailText}>
          <Ionicons name="people" size={16} color="#666" /> {item.members} members
        </Text>
        <Text style={styles.costText}>R{item.cost} per trip</Text>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join Club</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Carpool Clubs Near You</Text>
      <FlatList
        data={mockCarpoolClubs}
        renderItem={renderClubItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    padding: 15,
  },
  clubItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  clubName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  clubDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  costText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
    marginTop: 5,
  },
  joinButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});