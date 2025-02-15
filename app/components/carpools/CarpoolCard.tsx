import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarpoolClub } from '../../config/constants';
import theme from '../../config/theme';

interface CarpoolCardProps {
  carpool: CarpoolClub;
  onPress: () => void;
}

export default function CarpoolCard({ carpool, onPress }: CarpoolCardProps) {
  return (
    <TouchableOpacity style={styles.carpoolCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.carpoolName}>{carpool.name}</Text>
          <View style={styles.membersContainer}>
            <Ionicons name="people" size={16} color={theme.colors.secondary} />
            <Text style={styles.membersText}>
              {carpool.members.length}/{carpool.capacity} members
            </Text>
          </View>
        </View>
        <Text style={styles.costText}>R{carpool.cost}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={styles.locationText}>{carpool.startLocation}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.dark} />
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="navigate" size={16} color={theme.colors.secondary} />
          <Text style={styles.locationText}>{carpool.endLocation}</Text>
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Schedule:</Text>
        <View style={styles.timesContainer}>
          <View style={styles.timeChip}>
            <Ionicons name="time" size={14} color={theme.colors.dark} />
            <Text style={styles.timeText}>{carpool.departureTime}</Text>
          </View>
          <View style={styles.timeChip}>
            <Ionicons name="time" size={14} color={theme.colors.dark} />
            <Text style={styles.timeText}>{carpool.returnTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  carpoolCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carpoolName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersText: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  costText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: theme.colors.dark,
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  scheduleContainer: {
    gap: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  timesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${theme.colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.dark,
  },
}); 