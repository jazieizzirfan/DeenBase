// ══════════════════════════════════════════════════════
// ZikirScreen.js
// ══════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useStore } from '../services/store';
import { AZKAR, NAMES99, QUOTES } from '../data/constants';
import { Screen, Header, Card, Card2, useTheme, Btn, Muted, ProgressBar, SectionTitle, Badge, ArabicText } from '../components/UI';

const AZKAR_TABS = [
  { label: 'Morning', icon: 'sunny-outline' },
  { label: 'Evening', icon: 'moon-outline' },
  { label: 'Tasbeeh', icon: 'sync-outline' },
  { label: 'Post-Salah', icon: 'hand-right-outline' },
  { label: 'Daily Duas', icon: 'star-outline' },
];

export function ZikirScreen({ navigation }) {
  const C = useTheme();
  const [tab, setTab] = useState(0);
  const azkarCounters = useStore(s => s.azkarCounters);
  const incZikr = useStore(s => s.incZikr);
  const resetZikr = useStore(s => s.resetZikr);
  const resetCategoryZikr = useStore(s => s.resetCategoryZikr);

  const cat = AZKAR[tab];
  const doneCount = cat.items.filter((_, i) => (azkarCounters[`${tab}-${i}`] || 0) >= _.count).length;
  const pct = Math.round(doneCount / cat.items.length * 100);

  function speak(ar) { Speech.stop(); Speech.speak(ar, { language: 'ar-SA', rate: 0.75 }); }

  return (
    <Screen>
      <Header
        title="Zikir & Dua"
        rightAction={
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Btn label="Names" icon="sparkles-outline" sm onPress={() => navigation.navigate('Names')} />
            <Btn label="Quotes" icon="chatbubble-outline" sm onPress={() => navigation.navigate('Quotes')} />
          </View>
        }
      />
      <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {AZKAR_TABS.map((t, i) => (
              <TouchableOpacity
                key={t.label}
                style={[styles.filterBtn, { backgroundColor: tab === i ? C.acc : C.surf2, borderColor: tab === i ? C.acc : C.brd }]}
                onPress={() => setTab(i)}
              >
                <Ionicons name={t.icon} size={13} color={tab === i ? '#080D0A' : C.muted} />
                <Text style={{ fontSize: 11, color: tab === i ? '#080D0A' : C.muted, fontFamily: tab === i ? 'Sora_600SemiBold' : 'Sora_400Regular' }}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Progress */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>{cat.title}</Text>
          <Text style={{ color: C.muted, fontSize: 10.5, fontFamily: 'Sora_400Regular' }}>{pct}%</Text>
        </View>
        <ProgressBar pct={pct} style={{ marginBottom: 10 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 15, paddingTop: 0 }}>
        {cat.items.map((item, i) => {
          const k = `${tab}-${i}`;
          const cur = azkarCounters[k] || 0;
          const isDone = cur >= item.count;
          const p = Math.min(100, Math.round(cur / item.count * 100));
          return (
            <View key={k} style={[styles.zikrCard, { backgroundColor: C.surf, borderColor: isDone ? 'rgba(61,139,94,.4)' : C.brd, opacity: isDone ? 0.6 : 1 }]}>
              {item.occ && <Text style={{ fontSize: 9.5, color: C.acc, fontFamily: 'Sora_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>{item.occ}</Text>}
              <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 24, color: C.txt, textAlign: 'right', lineHeight: 48, marginBottom: 8, writingDirection: 'rtl' }}>{item.ar}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Text style={{ fontSize: 11.5, color: C.muted, fontStyle: 'italic', fontFamily: 'Sora_400Regular', lineHeight: 18, flex: 1, marginRight: 8 }}>{item.tr}</Text>
                <TouchableOpacity onPress={() => speak(item.ar)} hitSlop={8}>
                  <Ionicons name="volume-medium-outline" size={18} color={C.muted} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.countBtn, { backgroundColor: isDone ? C.surf3 : C.acc }]}
                    onPress={() => { if (!isDone) { incZikr(k, item.count); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
                    disabled={isDone}
                  >
                    <Ionicons name={isDone ? 'checkmark' : 'finger-print-outline'} size={14} color={isDone ? C.muted : '#080D0A'} />
                    <Text style={{ fontSize: 12, color: isDone ? C.muted : '#080D0A', fontFamily: 'Sora_600SemiBold' }}>
                      {isDone ? 'Done' : `${cur} / ${item.count}`}
                    </Text>
                  </TouchableOpacity>
                  {cur > 0 && (
                    <TouchableOpacity onPress={() => resetZikr(k)} hitSlop={8}>
                      <Ionicons name="refresh-outline" size={16} color={C.muted} />
                    </TouchableOpacity>
                  )}
                </View>
                {isDone && <Ionicons name="checkmark-circle" size={22} color={C.green} />}
              </View>
              {item.count > 1 && cur > 0 && <ProgressBar pct={p} />}
            </View>
          );
        })}
        <Btn label="Reset category" icon="refresh-outline" onPress={() => resetCategoryZikr(tab, cat.items.length)} style={{ marginTop: 4, alignSelf: 'flex-end' }} sm />
      </ScrollView>
    </Screen>
  );
}

// ══════════════════════════════════════════════════════
// NamesScreen.js
// ══════════════════════════════════════════════════════
export function NamesScreen({ navigation }) {
  const C = useTheme();
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? NAMES99.filter(n => n.tr.toLowerCase().includes(query.toLowerCase()) || n.m.toLowerCase().includes(query.toLowerCase()) || n.ar.includes(query))
    : NAMES99;

  function speak(ar) { Speech.stop(); Speech.speak(ar, { language: 'ar-SA', rate: 0.65 }); }

  return (
    <Screen>
      <Header title="99 Names of Allah" onBack={() => navigation.goBack()} />
      <View style={{ padding: 15, paddingBottom: 0 }}>
        <View style={[styles.searchWrap, { backgroundColor: C.surf2, borderColor: C.brd }]}>
          <Ionicons name="search-outline" size={15} color={C.muted} style={{ marginRight: 7 }} />
          <TextInput
            style={{ flex: 1, color: C.txt, fontSize: 13, fontFamily: 'Sora_400Regular', padding: 0 }}
            placeholder="Search by name or meaning…"
            placeholderTextColor={C.muted2}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={n => String(n.n)}
        contentContainerStyle={{ padding: 15, paddingTop: 8 }}
        renderItem={({ item: n }) => (
          <View style={[styles.nameCard, { backgroundColor: C.surf, borderColor: C.brd }]}>
            <View style={[styles.nNum, { backgroundColor: C.accAlpha }]}>
              <Text style={{ color: C.acc, fontSize: 11, fontFamily: 'Sora_700Bold' }}>{n.n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12.5, fontFamily: 'Sora_600SemiBold', color: C.txt, marginBottom: 2 }}>{n.tr}</Text>
              <Text style={{ fontSize: 11, color: C.muted, fontFamily: 'Sora_400Regular', lineHeight: 16 }}>{n.m}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => speak(n.ar)} hitSlop={8}>
                <Ionicons name="volume-medium-outline" size={18} color={C.muted} />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 22, color: C.acc, writingDirection: 'rtl' }}>{n.ar}</Text>
            </View>
          </View>
        )}
        initialNumToRender={20}
      />
    </Screen>
  );
}

// ══════════════════════════════════════════════════════
// QuotesScreen.js
// ══════════════════════════════════════════════════════
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

export function QuotesScreen({ navigation }) {
  const C = useTheme();
  const lang = useStore(s => s.lang);
  const [tab, setTab] = useState(0);

  async function copyQuote(ref, text) {
    await Clipboard.setStringAsync(`"${text}"\n\n— Quran ${ref}`);
  }
  async function shareQuote(ref, text) {
    await Share.share({ message: `"${text}"\n\n— Quran ${ref}` });
  }
  function speak(ar) { Speech.stop(); Speech.speak(ar, { language: 'ar-SA', rate: 0.7 }); }

  const cat = QUOTES[tab];
  return (
    <Screen>
      <Header title="Quran Quotes" onBack={() => navigation.goBack()} />
      <View style={{ padding: 15, paddingBottom: 0 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {QUOTES.map((q, i) => (
              <TouchableOpacity key={q.category} style={[styles.filterBtn, { backgroundColor: tab === i ? C.acc : C.surf2, borderColor: tab === i ? C.acc : C.brd }]} onPress={() => setTab(i)}>
                <Text style={{ fontSize: 11, color: tab === i ? '#080D0A' : C.muted, fontFamily: tab === i ? 'Sora_600SemiBold' : 'Sora_400Regular' }}>{q.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={{ color: C.acc, fontSize: 14, fontFamily: 'CormorantGaramond_700Bold', marginBottom: 10 }}>{cat.category}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 15, paddingTop: 0 }}>
        {cat.items.map(q => {
          const text = lang === 'ms' ? q.ms : q.en;
          return (
            <View key={q.ref} style={[styles.quoteCard, { backgroundColor: C.surf, borderColor: C.brd }]}>
              <View style={{ borderLeftWidth: 3, borderLeftColor: C.acc, paddingLeft: 12, marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 22, color: C.txt, textAlign: 'right', lineHeight: 44, writingDirection: 'rtl' }}>{q.ar}</Text>
              </View>
              <Text style={{ fontSize: 12.5, color: C.txt2, fontStyle: 'italic', lineHeight: 20, fontFamily: 'Sora_400Regular', marginBottom: 10 }}>{text}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={[styles.refBadge, { backgroundColor: C.accAlpha }]}>
                  <Ionicons name="book-outline" size={11} color={C.acc} />
                  <Text style={{ color: C.acc, fontSize: 10.5, fontFamily: 'Sora_600SemiBold' }}> {q.ref}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity onPress={() => speak(q.ar)} hitSlop={6}><Ionicons name="volume-medium-outline" size={18} color={C.muted} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => copyQuote(q.ref, text)} hitSlop={6}><Ionicons name="copy-outline" size={18} color={C.muted} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => shareQuote(q.ref, text)} hitSlop={6}><Ionicons name="share-outline" size={18} color={C.muted} /></TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

// ══════════════════════════════════════════════════════
// SearchScreen.js
// ══════════════════════════════════════════════════════
import { searchQuran } from '../services/quranService';
import { Alert as RNAlert } from 'react-native';

export function SearchScreen({ navigation }) {
  const C = useTheme();
  const lang = useStore(s => s.lang);
  const [query, setQuery] = useState('');
  const [searchLang, setSearchLang] = useState('en');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const r = await searchQuran(query, searchLang);
      setResults(r);
      if (!r.length) setError('No results found.');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <Header title="Search Quran" onBack={() => navigation.goBack()} />
      <View style={{ padding: 15, paddingBottom: 0 }}>
        <View style={[styles.searchWrap, { backgroundColor: C.surf2, borderColor: C.brd }]}>
          <Ionicons name="search-outline" size={15} color={C.muted} style={{ marginRight: 7 }} />
          <TextInput
            style={{ flex: 1, color: C.txt, fontSize: 13, fontFamily: 'Sora_400Regular', padding: 0 }}
            placeholder="Search Quran text…"
            placeholderTextColor={C.muted2}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={doSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={doSearch} style={[styles.searchBtn, { backgroundColor: C.acc }]}>
            <Ionicons name="search" size={15} color="#080D0A" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 10 }}>
          {[['en','🇬🇧 English'],['ms','🇲🇾 Bahasa']].map(([l, label]) => (
            <TouchableOpacity key={l} style={[styles.filterBtn, { backgroundColor: searchLang === l ? C.acc : C.surf2, borderColor: searchLang === l ? C.acc : C.brd }]} onPress={() => setSearchLang(l)}>
              <Text style={{ fontSize: 11, color: searchLang === l ? '#080D0A' : C.muted, fontFamily: 'Sora_400Regular' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading ? <Loader text="Searching…" /> :
       error ? <View style={{ padding: 15 }}><Muted>{error}</Muted></View> :
       <FlatList
         data={results}
         keyExtractor={(r, i) => String(i)}
         contentContainerStyle={{ padding: 15, paddingTop: 0 }}
         renderItem={({ item: r }) => (
           <View style={[styles.resultCard, { backgroundColor: C.surf, borderColor: C.brd }]}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
               <View style={[styles.refBadge, { backgroundColor: C.accAlpha }]}>
                 <Text style={{ color: C.acc, fontSize: 10.5, fontFamily: 'Sora_600SemiBold' }}>{r.surah?.englishName} {r.surah?.number}:{r.numberInSurah}</Text>
               </View>
               <Btn label="Open →" sm onPress={() => navigation.navigate('Reader', { surahNum: r.surah?.number })} />
             </View>
             <Text style={{ fontSize: 12.5, color: C.txt2, lineHeight: 20, fontFamily: 'Sora_400Regular' }}>{r.text}</Text>
           </View>
         )}
       />
      }
    </Screen>
  );
}

// ══════════════════════════════════════════════════════
// MoreScreen.js
// ══════════════════════════════════════════════════════
export function MoreScreen({ navigation }) {
  const C = useTheme();
  const dark = useStore(s => s.dark);
  const setDark = useStore(s => s.setDark);
  const lang = useStore(s => s.lang);
  const setLang = useStore(s => s.setLang);
  const bookmarks = useStore(s => s.bookmarks);
  const surahs = useStore(s => s.surahs);
  const clearBookmarks = useStore(s => s.clearBookmarks);
  const resetAll = useStore(s => s.resetAll);

  return (
    <Screen>
      <Header title="More" />
      <ScrollView contentContainerStyle={{ padding: 15 }}>

        <SectionTitle text="Library" />
        <View style={styles.grid}>
          {[
            { label: '99 Names', icon: 'sparkles-outline', nav: 'Names', sub: 'Asmaul Husna' },
            { label: 'Quotes', icon: 'chatbubble-outline', nav: 'Quotes', sub: 'Comfort · Trust' },
            { label: 'Zikir', icon: 'hand-right-outline', tab: 'Zikir', sub: 'Morning · Evening' },
            { label: 'Qibla', icon: 'compass-outline', nav2: 'Qibla', sub: 'Live compass' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={[styles.qcard, { backgroundColor: C.surf, borderColor: C.brd }]}
              onPress={() => {
                if (item.tab) navigation.navigate(item.tab);
                else if (item.nav) navigation.navigate('Zikir', { screen: item.nav });
                else if (item.nav2) navigation.navigate('Prayer', { screen: item.nav2 });
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={22} color={C.acc} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 12.5, fontFamily: 'Sora_600SemiBold', color: C.txt, marginBottom: 2 }}>{item.label}</Text>
              <Text style={{ fontSize: 10, color: C.muted, fontFamily: 'Sora_400Regular' }}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionTitle text="Display" />
        <View style={[styles.settingRow, { backgroundColor: C.surf, borderColor: C.brd }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="moon-outline" size={16} color={C.acc} />
            <Text style={{ fontSize: 13, fontFamily: 'Sora_500Medium', color: C.txt }}>Dark Mode</Text>
          </View>
          <TouchableOpacity onPress={() => setDark(!dark)}>
            <View style={[styles.toggle, { backgroundColor: dark ? C.acc : C.surf3, borderColor: dark ? C.acc : C.brd }]}>
              <View style={[styles.toggleKnob, { transform: [{ translateX: dark ? 18 : 0 }] }]} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.settingRow, { backgroundColor: C.surf, borderColor: C.brd, marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="language-outline" size={16} color={C.acc} />
            <Text style={{ fontSize: 13, fontFamily: 'Sora_500Medium', color: C.txt }}>Translation</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {[['en','EN'],['ms','BM']].map(([l, lbl]) => (
              <TouchableOpacity key={l} style={[styles.langBtn, { backgroundColor: lang === l ? C.acc : C.surf2, borderColor: lang === l ? C.acc : C.brd }]} onPress={() => setLang(l)}>
                <Text style={{ fontSize: 11, color: lang === l ? '#080D0A' : C.muted, fontFamily: 'Sora_600SemiBold' }}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <SectionTitle text="Bookmarks" />
        {bookmarks.length === 0 ? (
          <Text style={{ color: C.muted, fontSize: 13, fontFamily: 'Sora_400Regular', marginBottom: 8 }}>No bookmarks yet.</Text>
        ) : (
          bookmarks.slice(-10).reverse().map(b => {
            const [s, a] = b.split(':');
            const sr = surahs.find(x => x.number === +s);
            return (
              <View key={b} style={[styles.bmRow, { borderTopColor: C.brd }]}>
                <Text style={{ color: C.txt, fontSize: 13, fontFamily: 'Sora_400Regular' }}>{sr?.englishName || 'Surah '+s} · Ayah {a}</Text>
              </View>
            );
          })
        )}
        <Btn label="Clear All Bookmarks" icon="trash-outline" danger onPress={() => clearBookmarks()} style={{ marginTop: 6, marginBottom: 16 }} />

        <SectionTitle text="About" />
        <View style={[styles.aboutCard, { backgroundColor: C.surf2, borderColor: C.brd }]}>
          <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 19, color: C.acc, marginBottom: 8 }}>DeenBase v3.2</Text>
          {[
            ['book-outline', 'Quran: Tanzil · AlQuran.cloud'],
            ['time-outline', 'Prayer Times: Aladhan API'],
            ['volume-medium-outline', 'Audio: Mishary Alafasy · islamic.network'],
            ['compass-outline', 'Qibla: Aladhan API + Haversine'],
            ['shield-checkmark-outline', 'No AI · No ads · No data collection'],
          ].map(([icon, text]) => (
            <View key={text} style={{ flexDirection: 'row', gap: 7, marginBottom: 4 }}>
              <Ionicons name={icon} size={14} color={C.acc} style={{ marginTop: 2, flexShrink: 0 }} />
              <Text style={{ color: C.muted, fontSize: 12, fontFamily: 'Sora_400Regular', flex: 1 }}>{text}</Text>
            </View>
          ))}
        </View>
        <Btn label="Reset All Data" icon="refresh-outline" danger onPress={() => {
          Alert.alert('Reset', 'This will clear all data. Continue?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
          ]);
        }} style={{ marginTop: 8 }} />
      </ScrollView>
    </Screen>
  );
}

const { Alert } = require('react-native');
import { Loader } from '../components/UI';

const styles = StyleSheet.create({
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  zikrCard: { borderRadius: 14, padding: 15, marginBottom: 8, borderWidth: 1 },
  countBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  nameCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 6, borderWidth: 1 },
  nNum: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  quoteCard: { borderRadius: 14, padding: 17, marginBottom: 10, borderWidth: 1, overflow: 'hidden' },
  refBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  searchBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
  resultCard: { borderRadius: 14, padding: 13, marginBottom: 7, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  qcard: { width: '47.5%', borderRadius: 14, padding: 14, borderWidth: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, padding: 13, marginBottom: 6, borderWidth: 1 },
  toggle: { width: 42, height: 24, borderRadius: 12, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 2 },
  toggleKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: .2, shadowRadius: 2, elevation: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  bmRow: { paddingVertical: 8, borderTopWidth: 1 },
  aboutCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
});
