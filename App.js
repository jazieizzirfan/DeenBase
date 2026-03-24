import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  Amiri_400Regular,
  Amiri_700Bold,
} from '@expo-google-fonts/amiri';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Sora_300Light,
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';

import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/services/store';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Handle notifications received while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const loadFromStorage = useStore(s => s.loadFromStorage);
  const dark = useStore(s => s.dark);

  const [fontsLoaded, fontError] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    Sora_300Light,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Load persisted state
        await loadFromStorage();
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  // Handle notification tap (deep link into prayer screen)
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const prayer = response.notification.request.content.data?.prayer;
      // Navigation handled within navigator via global ref if needed
    });
    return () => sub.remove();
  }, []);

  if (!appReady || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080D0A', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#C4A44A" />
        <Text style={{ color: '#C4A44A', marginTop: 16, fontFamily: 'System', fontSize: 18 }}>
          DeenBase
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}