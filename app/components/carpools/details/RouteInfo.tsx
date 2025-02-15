import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../../config/theme';

interface RouteInfoProps {
  route: {
    stops: string[];
    estimatedDuration: string;
  };
}

export default function RouteInfo({ route }: RouteInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Route Information</Text>
      <Text style={styles.duration}>
        <Ionicons name="time" size={16} color={theme.colors.primary} />
        {' '}Estimated Duration: {route.estimatedDuration}
      </Text>
      <View style={styles.stopsContainer}>
        {route.stops.map((stop, index) => (
          <View key={stop} style={styles.stopItem}>
            <View style={styles.stopIndicator}>
              <View style={styles.stopDot} />
              {index < route.stops.length - 1 && <View style={styles.stopLine} />}
            </View>
            <Text style={styles.stopText}>{stop}</Text>
          </View>
        ))}
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
  duration: {
    fontSize: 16,
    color: theme.colors.dark,
    marginBottom: 16,
  },
  stopsContainer: {
    marginLeft: 8,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  stopLine: {
    width: 2,
    height: 30,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },
  stopText: {
    fontSize: 16,
    color: theme.colors.dark,
    flex: 1,
  },
}); 