import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Platform, ActivityIndicator 
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { DEFAULT_CENTER } from '../config/constants';
import { TransportHub } from '../config/constants';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { mockHubs } from '../config/mockData';
import { useRouter } from 'expo-router';
import theme from '../config/theme';
import { supabase } from '../lib/supabase';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<TransportHub | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [hubs, setHubs] = useState<TransportHub[]>([]);
  const [nearbyHubs, setNearbyHubs] = useState<TransportHub[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchHubs(location.coords.latitude, location.coords.longitude);

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


  const fetchHubs = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase
        .from('transport_hubs')
        .select(`
          *,
          services:transport_services(*)
        `);

      if (error) throw error;

      const formattedHubs: TransportHub[] = data.map(hub => ({
        id: hub.id,
        name: hub.name,
        coordinates: {
          lat: hub.latitude,
          lng: hub.longitude
        },
        services: hub.services
      }));

      setHubs(formattedHubs);

      // Calculate and set nearby hubs
      const sortedHubs = [...formattedHubs].sort((a, b) => {
        const distA = calculateDistance(lat, lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(lat, lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      });

      setNearbyHubs(sortedHubs.slice(0, 3));
    } catch (err) {
      console.error('Error fetching hubs:', err);
    }
  };

  const fetchAutocompleteResults = async (query: string) => {
    if (!query) return;
    const HERE_API_KEY = 'tEzSszjXMvnBlus-bapyE2hF0qnnPmKpreM7wK3ciAg'; // Replace with your HERE Maps API key
    const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&apiKey=${HERE_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.items || []); // Ensure `items` is defined
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return 'bus';
      case 'train':
        return 'train';
      case 'taxi':
        return 'car';
      default:
        return 'bus';
    }
  };

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

        <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                fetchAutocompleteResults(text);
              }}
            />
            {searchResults.map((result, index) => {
              if (!result.position) return null; // Skip if position is undefined
            
              const { lat, lng } = result.position;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => {
                    setSearchText(result.title);
                    setSearchResults([]);
            
                    const newRegion = {
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    };
            
                    if (mapRef.current) {
                      mapRef.current.animateToRegion(newRegion, 1000);
                    }
            
                    setLocation({
                      coords: { latitude: lat, longitude: lng, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 },
                      timestamp: Date.now(),
                    });
                  }}>
                  <Text style={styles.searchResultText}>{result.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
          index={0}
          snapPoints={['30%', '60%']}
          enablePanDownToClose={false}
          backgroundStyle={styles.bottomSheetBackground}>
          {selectedHub ? (
            <View style={styles.bottomSheetContent}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubName}>{selectedHub.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedHub(null)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.servicesContainer}>
                {selectedHub.services.map((service) => (
                  <View key={service.id} style={styles.serviceItem}>
                    <View style={styles.serviceHeader}>
                      <Ionicons
                        name={getTransportIcon(service.type)}
                        size={24}
                        color="#0066cc"
                      />
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceCost}>R{service.cost}</Text>
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeText}>
                        {service.route.start} → {service.route.end}
                      </Text>
                      <Text style={styles.scheduleText}>
                        {service.schedule.frequency}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.viewServicesButton}
                onPress={() => handleViewServices(selectedHub.id)}>
                <Text style={styles.viewServicesText}>View Full Details</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.bottomSheetContent}>
              <Text style={styles.nearbyTitle}>Nearby Transport Hubs</Text>
              {nearbyHubs.map((hub) => (
                <TouchableOpacity
                  key={hub.id}
                  style={styles.nearbyHub}
                  onPress={() => handleMarkerPress(hub)}>
                  <View style={styles.nearbyHubIcon}>
                    <Ionicons name="bus" size={20} color="#0066cc" />
                  </View>
                  <View style={styles.nearbyHubInfo}>
                    <Text style={styles.nearbyHubName}>{hub.name}</Text>
                    <View style={styles.serviceTypes}>
                      {Array.from(
                        new Set(hub.services.map((s) => s.type))
                      ).map((type, index) => (
                        <View key={index} style={styles.serviceType}>
                          <Ionicons
                            name={getTransportIcon(type)}
                            size={16}
                            color="#666"
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              ))}
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
  searchResultsContainer: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 200,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    zIndex: 10,
    elevation: 5,
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
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 16,
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
  nearbyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  nearbyHub: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 8,
  },
  nearbyHubIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nearbyHubInfo: {
    flex: 1,
  },
  nearbyHubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
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