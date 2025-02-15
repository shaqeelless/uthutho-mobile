import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { DEFAULT_CENTER } from '../config/constants';
import { TransportHub } from '../config/constants';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { mockHubs } from '../config/mockData';
import { useRouter } from 'expo-router';
import theme from '../config/theme';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<TransportHub | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
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

      // Animate to user's location when we get it
      if (mapRef.current && location) {
        const region: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01, // Smaller numbers = more zoomed in
          longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    })();
  }, []);

  // Function to center on user location
  const centerOnLocation = useCallback(() => {
    if (mapRef.current && location) {
      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [location]);

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
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: DEFAULT_CENTER.lat,
              longitude: DEFAULT_CENTER.lng,
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

          {/* Add a button to recenter on user's location */}
          <TouchableOpacity
            style={styles.centerButton}
            onPress={centerOnLocation}>
            <Ionicons name="locate" size={24} color="#0066cc" />
          </TouchableOpacity>

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
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  hubMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: theme.colors.dark,
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
    color: theme.colors.dark,
    marginBottom: 8,
  },
  serviceCount: {
    fontSize: 16,
    color: `${theme.colors.dark}80`,
    marginBottom: 16,
  },
  viewServicesButton: {
    backgroundColor: theme.colors.primary,
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
  centerButton: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: theme.colors.background,
    borderRadius: 30,
    padding: 12,
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});