import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* Transport Hubs Tab */}
      <Tabs.Screen
        name="hubs"
        options={{
          title: 'Transport Hubs',
          tabBarIcon: ({ color }) => <Ionicons name="bus" size={24} color={color} />,
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
          tabBarIcon: ({ color }) => <Ionicons name="car" size={24} color={color} />,
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
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
