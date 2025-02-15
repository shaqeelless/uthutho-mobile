import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust the path as needed
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import theme from '../config/theme';

const ProfileScreen = () => {

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'finance'>('profile');
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
      <View style={styles.container}>
        <Text style={styles.text}>You are not logged in</Text>
        {/* Button to redirect to onboarding */}
        <Button title="Go to Onboarding" onPress={goToOnboarding} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.user_metadata?.avatar_url || 'https://via.placeholder.com/150' }} // Use a default image if no avatar is set
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.user_metadata?.name || user.email}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={styles.tabText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'finance' && styles.activeTab]}
          onPress={() => setActiveTab('finance')}
        >
          <Text style={styles.tabText}>Finance</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <Text>Username: {user.user_metadata?.username}</Text>
          <Text>Email: {user.email}</Text>
          {/* Add more profile details here */}
        </View>
      )}

      {activeTab === 'achievements' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text>🎖️ Completed 10 Trips</Text>
          <Text>🏆 Top 5% User</Text>
          {/* Add more achievements here */}
        </View>
      )}

      {activeTab === 'finance' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Finance</Text>
          <Text>💰 Wallet Balance: $100</Text>
          <Text>📊 Last Transaction: $20 on 10/10/2023</Text>
          {/* Add more financial details here */}
        </View>
      )}

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Button title="Logout" onPress={handleLogout} />
        <Button title="Clear Cache" onPress={clearCache} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  profileEmail: {
    fontSize: 16,
    color: theme.colors.dark,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.dark,
  },
  tabContent: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.dark,
    marginBottom: 10,
  },
  settingsSection: {
    marginTop: 20,
  },
});

export default ProfileScreen;