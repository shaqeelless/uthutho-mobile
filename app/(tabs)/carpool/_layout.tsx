import { Stack } from 'expo-router';

export default function CarpoolLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
} 