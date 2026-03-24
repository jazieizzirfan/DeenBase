import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Magnetometer, DeviceMotion } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getCurrentLocation } from '../services/prayerService';
import { fetchQibla, calcQiblaLocal } from '../services/prayerService';
import { useStore } from '../services/store';
import { Screen, Header, Card, Card2, InfoBox, ErrBox, useTheme, Btn, Muted } from '../components/UI';

export default function QiblaScreen({ navigation }) {
  const C = useTheme();
  const pCity = useStore(s => s.pCity);
  const pCountry = useStore(s => s.pCountry);

  const [qiblaDir, setQiblaDir] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('Detecting location…');
  const [error, setError] = useState('');
  const [aligned, setAligned] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const [cityInput, setCityInput] = useState(pCity);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const subscription = useRef(null);
  const prevAligned = useRef(false);

  // Animated needle rotation
  const [needleRot, setNeedleRot] = useState(0);
  const needleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initLocation();
    startCompass();
    return () => subscription.current?.remove();
  }, []);

  // Check alignment and haptic feedback
  useEffect(() => {
    if (qiblaDir === null) return;
    const diff = Math.abs(((deviceHeading - qiblaDir) + 360) % 360);
    const isAligned = diff < 5 || diff > 355;
    if (isAligned !== prevAligned.current) {
      setAligned(isAligned);
      prevAligned.current = isAligned;
      if (isAligned) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [deviceHeading, qiblaDir]);

  // Smooth needle animation
  useEffect(() => {
    if (qiblaDir === null) return;
    const targetAngle = qiblaDir - deviceHeading;
    Animated.spring(needleAnim, {
      toValue: targetAngle,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [deviceHeading, qiblaDir]);

  async function initLocation() {
    try {
      const { lat, lng } = await getCurrentLocation();
      setCoords({ lat, lng });
      setStatus('Calculating Qibla…');
      const dir = await fetchQibla(lat, lng);
      setQiblaDir(dir);
      setStatus(`${dir.toFixed(1)}° from North — align needle toward Mecca`);
    } catch (e) {
      setError(e.message || 'Location access denied. Use manual city input.');
      setStatus('Use city lookup below.');
    }
  }

  async function startCompass() {
    // Check if magnetometer is available
    const available = await Magnetometer.isAvailableAsync();
    if (!available) {
      setSensorAvailable(false);
      setError('Compass sensor not available on this device.');
      return;
    }
    Magnetometer.setUpdateInterval(100);
    subscription.current = Magnetometer.addListener(data => {
      // Calculate heading from magnetometer XY data
      let heading = Math.atan2(data.y, data.x) * (180 / Math.PI);
      heading = (heading + 360) % 360;
      // On iOS, DeviceMotion gives more accurate heading
      setDeviceHeading(prev => {
        // Smooth damping
        const diff = heading - prev;
        const adjusted = diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
        return (prev + adjusted * 0.3 + 360) % 360;
      });
    });
  }

  async function lookupCity() {
    const [city, country] = [cityInput, useStore.getState().pCountry];
    setStatus('Fetching…');
    try {
      // Geocode via OpenStreetMap Nominatim
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
      const data = await r.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoords({ lat, lng });
        const dir = await fetchQibla(lat, lng);
        setQiblaDir(dir);
        setStatus(`${dir.toFixed(1)}° from North`);
        setError('');
      } else {
        setError('City not found. Try a larger city name.');
      }
    } catch (e) {
      setError('Network error. Check your connection.');
    }
  }

  const needleRotStr = needleAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <Screen>
      <Header title="Qibla Direction" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, padding: 15 }}>

        {/* Compass */}
        <Card style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: C.muted, fontSize: 11, marginBottom: 12, fontFamily: 'Sora_400Regular', textAlign: 'center' }}>
            {sensorAvailable ? 'Compass auto-updates with live sensor' : 'Manual mode (no sensor)'}
          </Text>

          {/* Compass ring */}
          <View style={[styles.compassRing, { borderColor: C.brd2, backgroundColor: C.surf2 }]}>
            {/* Cardinal directions */}
            {[{l:'N',s:styles.cn},{l:'S',s:styles.cs},{l:'E',s:styles.ce},{l:'W',s:styles.cw}].map(d => (
              <Text key={d.l} style={[styles.cardinalText, d.s, { color: C.muted }]}>{d.l}</Text>
            ))}

            {/* Kaaba icon (static center) */}
            <Text style={styles.kaabaIcon}>🕋</Text>

            {/* Needle (rotates to Qibla direction) */}
            <Animated.View style={[styles.needleWrap, { transform: [{ rotate: needleRotStr }] }]}>
              {/* Gold needle pointing to Qibla */}
              <View style={[styles.needleN, { backgroundColor: aligned ? '#3D8B5E' : C.acc }]} />
              {/* Red tail (South) */}
              <View style={[styles.needleS, { backgroundColor: '#B85050' }]} />
              {/* Center dot */}
              <View style={[styles.needleDot, { backgroundColor: C.acc }]} />
            </Animated.View>
          </View>

          {/* Degree display */}
          <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 34, color: aligned ? C.green : C.acc, marginTop: 10 }}>
            {qiblaDir !== null ? `${qiblaDir.toFixed(1)}°` : '—°'}
          </Text>

          {aligned && (
            <View style={[styles.alignedBadge, { backgroundColor: 'rgba(61,139,94,.15)', borderColor: 'rgba(61,139,94,.3)' }]}>
              <Ionicons name="checkmark-circle" size={14} color={C.green} />
              <Text style={{ color: C.green, fontSize: 12, fontFamily: 'Sora_600SemiBold' }}> Facing Mecca!</Text>
            </View>
          )}

          <Text style={{ color: C.muted, fontSize: 11.5, textAlign: 'center', fontFamily: 'Sora_400Regular', marginTop: 4 }}>
            {status}
          </Text>

          {coords && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Ionicons name="location-outline" size={11} color={C.muted} />
              <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </Text>
            </View>
          )}
        </Card>

        {error ? <ErrBox text={error} /> : null}

        {/* Manual city lookup */}
        <Card2>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Ionicons name="search-outline" size={14} color={C.muted} />
            <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>Manual city lookup</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={[styles.inp, { flex: 1, borderColor: C.brd, backgroundColor: C.surf }]}>
              <Text style={{ color: C.txt, fontSize: 13, fontFamily: 'Sora_400Regular', padding: 0 }}
                onPress={() => {}}
              >{cityInput}</Text>
            </View>
            <Btn label="Get" primary onPress={lookupCity} />
          </View>
        </Card2>

        <InfoBox
          text="Move phone in figure-8 motion to calibrate. Keep away from metal objects. Phone should be horizontal."
          icon="warning-outline"
        />
      </View>
    </Screen>
  );
}

const RING_SIZE = 240;
const styles = StyleSheet.create({
  compassRing: {
    width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    position: 'relative', marginVertical: 8,
    shadowColor: '#C4A44A', shadowOpacity: 0.15, shadowRadius: 16, elevation: 4,
  },
  cardinalText: { position: 'absolute', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cn: { top: 12 }, cs: { bottom: 12 }, ce: { right: 14 }, cw: { left: 14 },
  kaabaIcon: { position: 'absolute', fontSize: 22, zIndex: 3 },
  needleWrap: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center' },
  needleN: { position: 'absolute', top: 30, width: 4, height: 80, borderRadius: 3 },
  needleS: { position: 'absolute', bottom: 30, width: 4, height: 45, borderRadius: 3 },
  needleDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, top: '50%', marginTop: -6, zIndex: 4 },
  inp: { borderWidth: 1, borderRadius: 10, padding: 9, justifyContent: 'center' },
  alignedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginTop: 8 },
});
