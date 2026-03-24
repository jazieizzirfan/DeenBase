import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { fetchHijriDate, fetchPrayerByCity, getNextPrayer, getCountdown, scheduleAzanNotifications } from '../services/prayerService';
import { Screen, LogoHeader, Card, Card2, Loader, useTheme, Btn, Muted, Toggle } from '../components/UI';
import { COLORS } from '../data/constants';

const QUICK_ITEMS = [
  { key: 'Quran', tab: 'Quran', icon: 'book-outline', label: 'Al-Quran', sub: '114 Surahs · EN/BM' },
  { key: 'Prayer', tab: 'Prayer', icon: 'time-outline', label: 'Prayer Times', sub: 'Adzan · JAKIM' },
  { key: 'Qibla', nav: 'Qibla', icon: 'compass-outline', label: 'Qibla', sub: 'Live compass' },
  { key: 'Zikir', tab: 'Zikir', icon: 'hand-right-outline', label: 'Zikir & Dua', sub: 'Morning · Evening' },
  { key: 'Names', nav: 'Names', icon: 'sparkles-outline', label: '99 Names', sub: 'Asmaul Husna' },
  { key: 'Quotes', nav: 'Quotes', icon: 'chatbubble-outline', label: 'Quran Quotes', sub: 'Comfort · Trust · Mercy' },
];

export default function HomeScreen({ navigation }) {
  const C = useTheme();
  const dark = useStore(s => s.dark);
  const setDark = useStore(s => s.setDark);
  const lang = useStore(s => s.lang);
  const setLang = useStore(s => s.setLang);
  const prayerData = useStore(s => s.prayerData);
  const setPrayerData = useStore(s => s.setPrayerData);
  const pCity = useStore(s => s.pCity);
  const pCountry = useStore(s => s.pCountry);
  const pMethod = useStore(s => s.pMethod);
  const adzanEnabled = useStore(s => s.adzanEnabled);
  const setAdzanEnabled = useStore(s => s.setAdzanEnabled);
  const bookmarks = useStore(s => s.bookmarks);
  const completed = useStore(s => s.completed);
  const azkarCounters = useStore(s => s.azkarCounters);
  const lastSurah = useStore(s => s.lastSurah);
  const surahs = useStore(s => s.surahs);
  const hijriDate = useStore(s => s.hijriDate);
  const setHijriDate = useStore(s => s.setHijriDate);

  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('—');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load prayer times on mount
  useEffect(() => {
    if (!prayerData) {
      fetchPrayerByCity(pCity, pCountry, pMethod)
        .then(data => { setPrayerData(data); })
        .catch(() => { });
    }
    // Hijri date (cache 1 day)
    const lastFetch = useStore.getState().hijriDateFetched;
    if (!hijriDate || !lastFetch || Date.now() - lastFetch > 86400000) {
      import('../services/prayerService').then(({ fetchHijriDate }) => {
        fetchHijriDate().then(h => { if (h) setHijriDate(h); }).catch(() => { });
      });
    }
  }, []);

  // Live countdown tick
  useEffect(() => {
    const update = () => {
      if (prayerData) {
        const next = getNextPrayer(prayerData.timings);
        setNextPrayer(next);
        setCountdown(getCountdown(next));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  // Pulse animation for next prayer card
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.01, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ]);
    Animated.loop(pulse).start();
  }, []);

  const totalZikr = Object.values(azkarCounters).reduce((a, b) => a + b, 0);
  const lastSurahData = surahs.find(s => s.number === lastSurah);

  const handleNav = (item) => {
    if (item.tab) navigation.navigate(item.tab);
    else if (item.nav === 'Qibla') navigation.navigate('Prayer', { screen: 'Qibla' });
    else if (item.nav === 'Names') navigation.navigate('Zikir', { screen: 'Names' });
    else if (item.nav === 'Quotes') navigation.navigate('Zikir', { screen: 'Quotes' });
  };

  return (
    <Screen>
      <LogoHeader rightAction={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => setLang(lang === 'en' ? 'ms' : 'en')}>
            <View style={[styles.hdrBtn, { backgroundColor: C.surf2, borderColor: C.brd }]}>
              <Text style={{ color: C.acc, fontFamily: 'Sora_600SemiBold', fontSize: 11 }}>
                {lang === 'en' ? 'EN' : 'BM'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDark(!dark)}>
            <View style={[styles.hdrBtn, { backgroundColor: C.surf2, borderColor: C.brd }]}>
              <Ionicons name={dark ? 'sunny-outline' : 'moon-outline'} size={16} color={C.muted} />
            </View>
          </TouchableOpacity>
        </View>
      } />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Bismillah hero */}
        <View style={[styles.bismillah, { backgroundColor: 'rgba(31,65,43,0.85)' }]}>
          <Text style={[styles.bismillahAr, { color: C.acc, fontFamily: 'Amiri_400Regular' }]}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
          </Text>
          <Text style={[styles.bismillahEn, { color: C.muted }]}>
            In the name of Allah, the Most Gracious, the Most Merciful
          </Text>
        </View>

        {/* Next prayer card */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.prayerCard, { backgroundColor: C.surf, borderColor: C.brd, borderLeftColor: C.acc }]}
            onPress={() => navigation.navigate('Prayer')}
            activeOpacity={0.85}
          >
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Ionicons name="location-outline" size={11} color={C.muted} />
                <Text style={{ color: C.muted, fontSize: 9.5, fontFamily: 'Sora_400Regular', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {pCity}
                </Text>
              </View>
              <Text style={{ color: C.txt, fontSize: 16, fontWeight: '600', fontFamily: 'Sora_600SemiBold', marginBottom: 2 }}>
                {nextPrayer ? `${nextPrayer.name}` : '—'}
              </Text>
              <Text style={{ color: C.muted, fontSize: 13, fontFamily: 'CormorantGaramond_400Regular' }}>
                {countdown}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: C.acc, fontSize: 30, fontFamily: 'CormorantGaramond_700Bold', lineHeight: 34 }}>
                {nextPrayer?.time || '—:—'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="arrow-forward-outline" size={10} color={C.muted} />
                <Text style={{ color: C.muted, fontSize: 9 }}>View all times</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Hijri date */}
        {hijriDate && (
          <View style={[styles.hijriBar, { backgroundColor: C.accAlpha }]}>
            <Ionicons name="calendar-outline" size={14} color={C.acc} />
            <Text style={{ color: C.acc, fontSize: 11.5, fontFamily: 'Sora_500Medium', flex: 1 }}>
              {`${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH  ·  ${hijriDate.month.ar} ${hijriDate.year} هـ`}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { val: completed.length, label: 'Surahs Read' },
            { val: bookmarks.length, label: 'Bookmarks' },
            { val: totalZikr, label: 'Zikr Done' },
          ].map(s => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: C.surf, borderColor: C.brd }]}>
              <Text style={{ color: C.acc, fontSize: 22, fontFamily: 'CormorantGaramond_700Bold' }}>{s.val}</Text>
              <Text style={{ color: C.muted, fontSize: 9.5, fontFamily: 'Sora_400Regular', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Continue reading */}
        {lastSurahData && (
          <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Sora_400Regular', marginBottom: 3 }}>
                Continue Reading
              </Text>
              <Text style={{ color: C.txt, fontSize: 13, fontFamily: 'Sora_600SemiBold' }}>
                {lastSurahData.englishName}
              </Text>
            </View>
            <Btn
              label="Resume"
              icon="arrow-forward-outline"
              onPress={() => navigation.navigate('Quran', { screen: 'Reader', params: { surahNum: lastSurah } })}
              primary sm
            />
          </Card>
        )}

        {/* Quick access grid */}
        <View style={styles.grid}>
          {QUICK_ITEMS.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.qcard, { backgroundColor: C.surf, borderColor: C.brd }]}
              onPress={() => handleNav(item)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={22} color={C.acc} style={{ marginBottom: 9 }} />
              <Text style={[styles.qcardTitle, { color: C.txt }]}>{item.label}</Text>
              <Text style={[styles.qcardSub, { color: C.muted }]}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust strip */}
        <View style={[styles.trust, { backgroundColor: C.accAlpha }]}>
          <Ionicons name="shield-checkmark-outline" size={13} color={C.muted} style={{ marginRight: 5 }} />
          <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular', flex: 1, lineHeight: 17 }}>
            No AI · All sources verified{'\n'}Quran: AlQuran.cloud · Prayer: Aladhan API
          </Text>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 15, paddingBottom: 30 },
  hdrBtn: { width: 34, height: 34, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bismillah: { borderRadius: 18, padding: 22, marginBottom: 12, alignItems: 'center' },
  bismillahAr: { fontSize: 26, textAlign: 'center', marginBottom: 6, lineHeight: 50 },
  bismillahEn: { fontSize: 11, fontStyle: 'italic', textAlign: 'center', fontFamily: 'Sora_400Regular' },
  prayerCard: { borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderLeftWidth: 3 },
  hijriBar: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 13, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  statsRow: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  statBox: { flex: 1, borderRadius: 11, padding: 11, alignItems: 'center', borderWidth: 1 },
  grid: { width: "100%", flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  qcard: { width: "48%", borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'center' },
  qcardTitle: { fontSize: 12.5, fontFamily: 'Sora_600SemiBold', marginBottom: 2 },
  qcardSub: { fontSize: 10, fontFamily: 'Sora_400Regular', lineHeight: 15 },
  trust: { borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
});
