import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust the path as needed
import { useRouter } from 'expo-router';

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
    await supabase.auth.signOut();
    router.push('/auth'); // Redirect to the login screen after logout
  };

  if (!user) {
    return <Text>Loading...</Text>; // Show loading while user data is fetched
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Profile Details</Text>
      <Text>Email: {user.email}</Text>
      <Text>Username: {user.user_metadata?.username}</Text>
      {/* Add any other profile details you want to display */}

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
