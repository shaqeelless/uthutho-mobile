import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Route } from '../../config/constants';
import theme from '../../config/theme';

interface RoutesListProps {
  routes: Route[];
}

export default function RoutesList({ routes }: RoutesListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes & Schedules</Text>
      {routes.map((route) => (
        <View key={`${route.start}-${route.end}`} style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>
              {route.start} → {route.end}
            </Text>
            <Text style={styles.routePrice}>R{route.price}</Text>
          </View>
          <Text style={styles.scheduleText}>
            Operating Hours: {route.schedule.firstDeparture} - {route.schedule.lastDeparture}
          </Text>
          <Text style={styles.scheduleText}>
            Frequency: {route.schedule.frequency}
          </Text>
          <Text style={styles.stopsTitle}>Stops:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {route.stops.map((stop, index) => (
              <View key={stop} style={styles.stopChip}>
                <Text style={styles.stopText}>{stop}</Text>
                {index < route.stops.length - 1 && (
                  <Ionicons 
                    name="arrow-forward" 
                    size={16} 
                    color={theme.colors.dark} 
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.dark,
  },
  routeCard: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  routePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  scheduleText: {
    fontSize: 14,
    color: theme.colors.gray,
    marginBottom: 4,
  },
  stopsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
    marginTop: 8,
    marginBottom: 8,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.secondary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  stopText: {
    fontSize: 14,
    color: theme.colors.dark,
    marginRight: 4,
  },
}); 