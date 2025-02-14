import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { DEFAULT_CENTER } from '../config/constants';
import { TransportHub } from '../config/constants';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { mockHubs } from '../config/mockData';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<TransportHub | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = useCallback((hub: TransportHub) => {
    setSelectedHub(hub);
    bottomSheetRef.current?.expand();
  }, []);

  const handleViewServices = useCallback((hubId: string) => {
    router.push(`/hubs?id=${hubId}`);
  }, [router]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude ?? DEFAULT_CENTER.lat,
              longitude: location?.coords.longitude ?? DEFAULT_CENTER.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
                description="Your current location">
                <View style={styles.currentLocationMarker}>
                  <View style={styles.currentLocationDot} />
                </View>
              </Marker>
            )}
            {mockHubs.map((hub) => (
              <Marker
                key={hub.id}
                coordinate={{
                  latitude: hub.coordinates.lat,
                  longitude: hub.coordinates.lng,
                }}
                title={hub.name}
                onPress={() => handleMarkerPress(hub)}>
                <View style={styles.hubMarker}>
                  <Ionicons name="bus" size={20} color="#ffffff" />
                </View>
              </Marker>
            ))}
          </MapView>
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['25%', '50%']}
            enablePanDownToClose
            backgroundStyle={styles.bottomSheetBackground}>
            {selectedHub && (
              <View style={styles.bottomSheetContent}>
                <Text style={styles.hubName}>{selectedHub.name}</Text>
                <Text style={styles.serviceCount}>
                  {selectedHub.services.length} transport services available
                </Text>
                <TouchableOpacity
                  style={styles.viewServicesButton}
                  onPress={() => handleViewServices(selectedHub.id)}>
                  <Text style={styles.viewServicesText}>View Services</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </BottomSheet>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    color: 'red',
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 102, 204, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066cc',
  },
  hubMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContent: {
    padding: 20,
  },
  hubName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  serviceCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  viewServicesButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewServicesText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});