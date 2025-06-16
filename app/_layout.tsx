import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lead/[id]" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </NotificationProvider>
    </AuthProvider>
  );
}