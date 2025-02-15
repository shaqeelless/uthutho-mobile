import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native'; // Import Image and StyleSheet
import theme from '../config/theme'; // Ensure this theme is correctly set up

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.dark,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/treasure-map.png')} // Replace with your image path
              style={[styles.tabIcon]} // Apply tintColor for active/inactive state
            />
          ),
        }}
      />

      {/* Transport Hubs Tab */}
      <Tabs.Screen
        name="hubs"
        options={{
          title: 'Transport Hubs',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/train.png')} // Replace with your image path
              style={[styles.tabIcon]}
            />
          ),
        }}
      />

      {/* Hidden Tab: Hub (Using href: null to hide it) */}
      <Tabs.Screen
        name="hub"
        options={{
          href: null, // This hides the tab but keeps it in the stack
        }}
      />

      {/* Carpools Tab */}
      <Tabs.Screen
        name="carpools"
        options={{
          title: 'Carpools',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/transport.png')} // Replace with your image path
              style={[styles.tabIcon]}
            />
          ),
        }}
      />

      {/* Hidden Tab: Carpool (Using href: null to hide it) */}
      <Tabs.Screen
        name="carpool"
        options={{
          href: null, // This hides the tab but keeps it in the stack
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/verified.png')} // Replace with your image path
              style={[styles.tabIcon]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// Add styles for the tab icons
const styles = StyleSheet.create({
  tabIcon: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
    resizeMode: 'contain', // Ensure the image fits within the dimensions
  },
});