import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the user has seen onboarding using AsyncStorage
    AsyncStorage.getItem('hasSeenOnboarding').then((value) => {
      setHasSeenOnboarding(value === 'true'); // 'true' string if they have seen onboarding
    });

    // Get the current session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for session changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    window.frameworkReady?.();
  }, []);

  // Show loading state while checking onboarding status
  if (hasSeenOnboarding === null) {
    return null; // Could show a loading spinner here if needed
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'none',
        }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="onboarding" />
        ) : !session ? (
          <Stack.Screen name="auth" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
