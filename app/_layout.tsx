import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get the current session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for session changes (e.g., user logs in or out)
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    window.frameworkReady?.(); // Call any framework readiness function
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Wrap your app with GestureHandlerRootView */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Show onboarding only if there's no session (user not logged in) */}
        {!session ? (
          <>
            <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
          </>
        ) : (
          // If there is a session (user is logged in), show tabs
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
