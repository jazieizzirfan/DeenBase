import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useStore } from '../services/store';
import { fetchPrayerByCity, fetchPrayerByCoords, getCurrentLocation, getNextPrayer, scheduleAzanNotifications, cancelAzanNotifications, requestNotificationPermission } from '../services/prayerService';
import { Screen, Header, Card, Card2, Loader, ErrBox, InfoBox, useTheme, Btn, Muted, Toggle, SectionTitle } from '../components/UI';
import { SALAH, PRAYER_ICONS } from '../data/constants';

const METHODS = [
  { label: 'JAKIM (Malaysia)', value: 11 },
  { label: 'Muslim World League', value: 3 },
  { label: 'ISNA (North America)', value: 2 },
  { label: 'Egypt', value: 5 },
  { label: 'Umm Al-Qura (Mecca)', value: 4 },
  { label: 'Karachi', value: 1 },
  { label: 'Gulf Region', value: 8 },
];

const EXTRA_TIMES = ['Sunrise', 'Sunset', 'Imsak', 'Midnight'];

export default function PrayerScreen({ navigation }) {
  const C = useTheme();
  const prayerData = useStore(s => s.prayerData);
  const setPrayerData = useStore(s => s.setPrayerData);
  const pCity = useStore(s => s.pCity);
  const setPCity = useStore(s => s.setPCity);
  const pCountry = useStore(s => s.pCountry);
  const setPCountry = useStore(s => s.setPCountry);
  const pMethod = useStore(s => s.pMethod);
  const setPMethod = useStore(s => s.setPMethod);
  const adzanEnabled = useStore(s => s.adzanEnabled);
  const setAdzanEnabled = useStore(s => s.setAdzanEnabled);

  const [cityInput, setCityInput] = useState(pCity);
  const [countryInput, setCountryInput] = useState(pCountry);
  const [methodVal, setMethodVal] = useState(pMethod);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('—');

  useEffect(() => {
    if (prayerData) updateNext(prayerData.timings);
    else loadPrayer(false);
  }, [prayerData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerData) updateNext(prayerData.timings);
    }, 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  function updateNext(timings) {
    const next = getNextPrayer(timings);
    setNextPrayer(next);
    if (!next) return;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    let diff = next.mins - cur; if (diff <= 0) diff += 1440;
    const h = Math.floor(diff / 60), m = diff % 60;
    setCountdown(`in ${h > 0 ? h + 'h ' : ''}${m}min`);
  }

  async function loadPrayer(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await fetchPrayerByCity(cityInput, countryInput, methodVal);
      setPrayerData(data);
      setPCity(cityInput);
      setPCountry(countryInput);
      setPMethod(methodVal);
      if (adzanEnabled) await scheduleAzanNotifications(data.timings);
    } catch (e) {
      setError(e.message || 'Failed to fetch prayer times');
    } finally {
      setLoading(false);
    }
  }

  async function loadByGPS() {
    setLoading(true);
    setError('');
    try {
      const { lat, lng } = await getCurrentLocation();
      const data = await fetchPrayerByCoords(lat, lng, methodVal);
      setPrayerData(data);
      setPCity(`${lat.toFixed(3)}, ${lng.toFixed(3)}`);
      setCityInput('My Location');
      if (adzanEnabled) await scheduleAzanNotifications(data.timings);
    } catch (e) {
      setError(e.message || 'Location failed. Enter city manually.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdzanToggle() {
    if (!adzanEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) { setError('Notification permission denied. Please enable in Settings.'); return; }
      setAdzanEnabled(true);
      if (prayerData) await scheduleAzanNotifications(prayerData.timings);
    } else {
      setAdzanEnabled(false);
      await cancelAzanNotifications();
    }
  }

  const timings = prayerData?.timings;

  return (
    <Screen>
      <Header
        title="Prayer Times"
        rightAction={
          <Btn label="Qibla" icon="compass-outline" sm onPress={() => navigation.navigate('Qibla')} />
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Adzan toggle card */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Ionicons name={adzanEnabled ? 'notifications' : 'notifications-outline'} size={26} color={C.acc} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.txt, fontSize: 13, fontFamily: 'Sora_600SemiBold', marginBottom: 2 }}>
              Adzan Notifications
            </Text>
            <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>
              {adzanEnabled ? '✓ Active — will notify at each prayer time' : 'Tap to enable prayer alerts'}
            </Text>
          </View>
          <Toggle value={adzanEnabled} onToggle={handleAdzanToggle} />
        </Card>

        {/* City input */}
        <Card2 style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Ionicons name="location-outline" size={14} color={C.muted} />
            <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>City / Location</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            <TextInput
              style={[styles.inp, { flex: 1, color: C.txt, backgroundColor: C.surf, borderColor: C.brd }]}
              value={cityInput}
              onChangeText={setCityInput}
              placeholder="City"
              placeholderTextColor={C.muted2}
            />
            <TextInput
              style={[styles.inp, { width: 50, color: C.txt, backgroundColor: C.surf, borderColor: C.brd, textAlign: 'center' }]}
              value={countryInput}
              onChangeText={setCountryInput}
              placeholder="MY"
              placeholderTextColor={C.muted2}
              maxLength={2}
              autoCapitalize="characters"
            />
            <Btn label="Go" icon="arrow-forward-outline" primary onPress={loadPrayer} />
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <View style={[styles.pickerWrap, { flex: 1, backgroundColor: C.surf, borderColor: C.brd }]}>
              <Picker
                selectedValue={methodVal}
                onValueChange={v => setMethodVal(v)}
                style={{ color: C.txt, fontSize: 12 }}
                dropdownIconColor={C.muted}
              >
                {METHODS.map(m => <Picker.Item key={m.value} label={m.label} value={m.value} />)}
              </Picker>
            </View>
            <Btn label="GPS" icon="locate-outline" sm onPress={loadByGPS} />
          </View>
        </Card2>

        {error ? <ErrBox text={error} /> : null}

        {loading ? <Loader text="Fetching prayer times…" /> : null}

        {!loading && timings && (
          <>
            {/* Date */}
            <Text style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginBottom: 10, fontFamily: 'Sora_400Regular' }}>
              {prayerData?.date?.readable || ''}
            </Text>

            {/* Main 5 prayers */}
            {SALAH.map(name => {
              const isNext = nextPrayer?.name === name;
              return (
                <View
                  key={name}
                  style={[styles.prayerRow, {
                    backgroundColor: isNext ? 'rgba(196,164,74,.06)' : C.surf,
                    borderColor: isNext ? 'rgba(196,164,74,.5)' : C.brd,
                  }]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Ionicons
                      name={`${PRAYER_ICONS[name]}-outline`}
                      size={20}
                      color={isNext ? C.acc : C.muted}
                    />
                    <View>
                      <Text style={{ fontSize: 14, fontFamily: isNext ? 'Sora_600SemiBold' : 'Sora_400Regular', color: isNext ? C.acc : C.txt }}>
                        {name}
                      </Text>
                      {isNext && (
                        <Text style={{ fontSize: 10, color: C.acc, fontFamily: 'Sora_400Regular' }}>
                          {countdown}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: isNext ? C.acc : C.txt }}>
                    {timings[name] || '—'}
                  </Text>
                </View>
              );
            })}

            {/* Additional times */}
            <Card2 style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, color: C.muted, marginBottom: 8, fontFamily: 'Sora_400Regular' }}>
                Additional Times
              </Text>
              {EXTRA_TIMES.filter(n => timings[n]).map(n => (
                <View key={n} style={[styles.extraRow, { borderTopColor: C.brd }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name={`${PRAYER_ICONS[n]}-outline`} size={14} color={C.muted} />
                    <Text style={{ color: C.muted, fontSize: 12, fontFamily: 'Sora_400Regular' }}>{n}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: C.txt, fontFamily: 'Sora_400Regular' }}>{timings[n]}</Text>
                </View>
              ))}
            </Card2>

            <InfoBox
              text={`Method: ${prayerData?.meta?.method?.name || 'JAKIM'} · Aladhan API (free, verified)`}
              icon="shield-checkmark-outline"
            />
          </>
        )}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 15, paddingBottom: 30 },
  inp: { borderWidth: 1, borderRadius: 10, padding: 9, fontSize: 13, fontFamily: 'Sora_400Regular' },
  pickerWrap: { borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  prayerRow: { borderRadius: 12, padding: 13, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1 },
});
