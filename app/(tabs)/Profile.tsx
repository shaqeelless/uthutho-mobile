import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust the path as needed
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
    });

    // Listen for auth state changes (user logout/login)
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });
  }, []);

  const handleLogout = async () => {
    // Clear session and logout
    await supabase.auth.signOut();
    router.push('/auth'); // Redirect to the login screen after logout
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear(); // Clear AsyncStorage
      alert("Cache cleared successfully!");
    } catch (error) {
      alert("Failed to clear cache.");
      console.error("Error clearing cache", error);
    }
  };

  const goToOnboarding = () => {
    router.push('/onboarding'); // Navigate to the onboarding screen
  };

  if (!user) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>You are not logged in</Text>
        {/* Button to redirect to onboarding */}
        <Button title="Go to Onboarding" onPress={goToOnboarding} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Profile Details</Text>
      <Text>Email: {user.email}</Text>
      <Text>Username: {user.user_metadata?.username}</Text>
      {/* Add any other profile details you want to display */}

      <Button title="Logout" onPress={handleLogout} />
      <Button title="Clear Cache" onPress={clearCache} />
    </View>
  );
}
