import { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { CarpoolClub } from '../../../config/constants';
import theme from '../../config/theme';
import { mockCarpools } from '../carpools';
import DriverInfo from '../../components/carpools/details/DriverInfo';
import RouteInfo from '../../components/carpools/details/RouteInfo';

export default function CarpoolDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [carpool, setCarpool] = useState<CarpoolClub | null>(null);

  useEffect(() => {
    const selectedCarpool = mockCarpools.find(c => c.id === id);
    setCarpool(selectedCarpool || null);
  }, [id]);

  const handleJoinPress = () => {
    Alert.alert(
      'Join Carpool',
      'Would you like to request to join this carpool?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Join',
          onPress: () => {
            Alert.alert('Success', 'Your request has been sent to the driver!');
          }
        }
      ]
    );
  };

  if (!carpool) return null;

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: carpool.name,
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container}>
        <DriverInfo driver={carpool.driver} />
        <RouteInfo route={carpool.route} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <Text style={styles.scheduleText}>
            Departure: {carpool.departureTime}
          </Text>
          <Text style={styles.scheduleText}>
            Return: {carpool.returnTime}
          </Text>
          <View style={styles.daysContainer}>
            {carpool.daysActive.map((day) => (
              <View key={day} style={styles.dayChip}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Cost</Text>
          <Text style={styles.costText}>R{carpool.cost}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          {carpool.rules.map((rule, index) => (
            <Text key={index} style={styles.ruleText}>
              • {rule}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {carpool.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <Text style={styles.reviewRating}>★ {review.rating}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handleJoinPress}>
          <Text style={styles.joinButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.dark,
  },
  scheduleText: {
    fontSize: 16,
    color: theme.colors.dark,
    marginBottom: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayChip: {
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dayText: {
    fontSize: 14,
    color: theme.colors.dark,
  },
  costText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ruleText: {
    fontSize: 16,
    color: theme.colors.dark,
    marginBottom: 8,
  },
  reviewCard: {
    backgroundColor: theme.colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  reviewRating: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.dark,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.gray,
  },
  footer: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 