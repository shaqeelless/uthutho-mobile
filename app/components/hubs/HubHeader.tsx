import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransportHub } from '../../config/constants';
import theme from '../../config/theme';

interface HubHeaderProps {
  hub: TransportHub;
}

export default function HubHeader({ hub }: HubHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{hub.name}</Text>
      <Text style={styles.description}>{hub.description}</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color={theme.colors.primary} />
        <Text style={styles.locationText}>
          {hub.coordinates.lat}, {hub.coordinates.lng}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: theme.colors.gray,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.dark,
  },
}); 