import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { COLORS } from '../data/constants';

// ─── Screens ────────────────────────────────────────────────────────
import HomeScreen from '../screens/HomeScreen';
import QuranScreen from '../screens/QuranScreen';
import ReaderScreen from '../screens/ReaderScreen';
import PrayerScreen from '../screens/PrayerScreen';
import QiblaScreen from '../screens/QiblaScreen';
import ZikirScreen from '../screens/ZikirScreen';
import NamesScreen from '../screens/NamesScreen';
import QuotesScreen from '../screens/QuotesScreen';
import SearchScreen from '../screens/SearchScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();
const QuranStack = createStackNavigator();
const PrayerStack = createStackNavigator();
const ZikirStack = createStackNavigator();
const MoreStack = createStackNavigator();

// ─── Stack navigators for each tab ────────────────────────────────
function QuranStackNav() {
  return (
    <QuranStack.Navigator screenOptions={{ headerShown: false }}>
      <QuranStack.Screen name="QuranList" component={QuranScreen} />
      <QuranStack.Screen name="Reader" component={ReaderScreen} />
      <QuranStack.Screen name="Search" component={SearchScreen} />
    </QuranStack.Navigator>
  );
}

function PrayerStackNav() {
  return (
    <PrayerStack.Navigator screenOptions={{ headerShown: false }}>
      <PrayerStack.Screen name="PrayerTimes" component={PrayerScreen} />
      <PrayerStack.Screen name="Qibla" component={QiblaScreen} />
    </PrayerStack.Navigator>
  );
}

function ZikirStackNav() {
  return (
    <ZikirStack.Navigator screenOptions={{ headerShown: false }}>
      <ZikirStack.Screen name="ZikirMain" component={ZikirScreen} />
      <ZikirStack.Screen name="Names" component={NamesScreen} />
      <ZikirStack.Screen name="Quotes" component={QuotesScreen} />
    </ZikirStack.Navigator>
  );
}

function MoreStackNav() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreMain" component={MoreScreen} />
    </MoreStack.Navigator>
  );
}

// ─── Tab icon helper ───────────────────────────────────────────────
const TAB_ICONS = {
  Home:   { active: 'home',           inactive: 'home-outline' },
  Quran:  { active: 'book',           inactive: 'book-outline' },
  Prayer: { active: 'time',           inactive: 'time-outline' },
  Zikir:  { active: 'hand-right',     inactive: 'hand-right-outline' },
  More:   { active: 'ellipsis-horizontal-circle', inactive: 'ellipsis-horizontal-circle-outline' },
};

// ─── Main App Navigator ────────────────────────────────────────────
export default function AppNavigator() {
  const dark = useStore(s => s.dark);
  const C = dark ? COLORS.dark : COLORS.light;

  return (
    <NavigationContainer
      theme={{
        dark,
        colors: {
          primary: C.acc,
          background: C.bg,
          card: C.surf,
          text: C.txt,
          border: C.brd,
          notification: C.acc,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: C.acc,
          tabBarInactiveTintColor: C.muted,
          tabBarStyle: {
            backgroundColor: C.surf,
            borderTopColor: C.brd,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 6,
            height: 62,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: 'Sora_400Regular',
            marginTop: -2,
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = TAB_ICONS[route.name];
            const iconName = focused ? icons.active : icons.inactive;
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home"   component={HomeScreen} />
        <Tab.Screen name="Quran"  component={QuranStackNav} />
        <Tab.Screen name="Prayer" component={PrayerStackNav} />
        <Tab.Screen name="Zikir"  component={ZikirStackNav} />
        <Tab.Screen name="More"   component={MoreStackNav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
