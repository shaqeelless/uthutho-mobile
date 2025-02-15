import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarpoolDriver } from '../../../config/constants';
import theme from '../../../config/theme';

interface DriverInfoProps {
  driver: CarpoolDriver;
}

export default function DriverInfo({ driver }: DriverInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Driver</Text>
      <View style={styles.driverCard}>
        <Image 
          source={{ uri: driver.profileImage }} 
          style={styles.driverImage}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={theme.colors.primary} />
            <Text style={styles.ratingText}>{driver.rating}</Text>
            <Text style={styles.tripsText}>({driver.totalTrips} trips)</Text>
          </View>
        </View>
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>Vehicle Information</Text>
        <Text style={styles.vehicleText}>
          {driver.vehicleInfo.color} {driver.vehicleInfo.make} {driver.vehicleInfo.model} ({driver.vehicleInfo.year})
        </Text>
        <Text style={styles.plateNumber}>{driver.vehicleInfo.plateNumber}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.dark,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    color: theme.colors.dark,
  },
  tripsText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.gray,
  },
  vehicleInfo: {
    backgroundColor: `${theme.colors.primary}10`,
    padding: 12,
    borderRadius: 8,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 8,
  },
  vehicleText: {
    fontSize: 15,
    color: theme.colors.dark,
    marginBottom: 4,
  },
  plateNumber: {
    fontSize: 14,
    color: theme.colors.gray,
  },
}); 