import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { TransportHub } from '../../config/constants';
import { mockHubs } from '../hubs';
import theme from '../../config/theme';
import HubHeader from '../../components/hubs/HubHeader';
import TransportTypesList from '../../components/hubs/TransportTypesList';
import RoutesList from '../../components/hubs/RoutesList';

export default function HubDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [hub, setHub] = useState<TransportHub | null>(null);
  const [selectedTransportType, setSelectedTransportType] = useState(null);

  useEffect(() => {
    const selectedHub = mockHubs.find(h => h.id === id);
    setHub(selectedHub || null);
  }, [id]);

  if (!hub) return null;

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: hub.name,
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container}>
        <HubHeader hub={hub} />
        <TransportTypesList 
          transportTypes={hub.transportTypes}
          selectedType={selectedTransportType}
          onSelectType={setSelectedTransportType}
        />
        {selectedTransportType && (
          <RoutesList routes={selectedTransportType.routes} />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}); 