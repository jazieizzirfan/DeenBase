// QuranScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { fetchSurahs } from '../services/quranService';
import { Screen, Header, SearchInput, Loader, ErrBox, useTheme, Btn, NumTag } from '../components/UI';
import { JUZ_MAP } from '../data/constants';

const FILTERS = ['All','Meccan','Medinan','Completed'];

export default function QuranScreen({ navigation }) {
  const C = useTheme();
  const lang = useStore(s => s.lang);
  const setLang = useStore(s => s.setLang);
  const surahs = useStore(s => s.surahs);
  const setSurahs = useStore(s => s.setSurahs);
  const completed = useStore(s => s.completed);
  const lastSurah = useStore(s => s.lastSurah);

  const [loading, setLoading] = useState(!surahs.length);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [showJuz, setShowJuz] = useState(false);

  useEffect(() => {
    if (!surahs.length) {
      fetchSurahs()
        .then(data => { setSurahs(data); setLoading(false); })
        .catch(e => { setError(e.message); setLoading(false); });
    }
  }, []);

  const filtered = surahs.filter(s => {
    if (filter === 'Meccan') return s.revelationType === 'Meccan';
    if (filter === 'Medinan') return s.revelationType === 'Medinan';
    if (filter === 'Completed') return completed.includes(s.number);
    return true;
  }).filter(s =>
    !query.trim() ||
    s.englishName.toLowerCase().includes(query.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(query.toLowerCase()) ||
    String(s.number).includes(query)
  );

  const renderItem = ({ item: s }) => {
    const isDone = completed.includes(s.number);
    const isLast = lastSurah === s.number;
    return (
      <TouchableOpacity
        style={[styles.surahItem, { backgroundColor: C.surf, borderColor: isDone ? 'rgba(61,139,94,.35)' : C.brd }]}
        onPress={() => navigation.navigate('Reader', { surahNum: s.number })}
        activeOpacity={0.8}
      >
        <NumTag n={s.number} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12.5, fontFamily: 'Sora_500Medium', color: C.txt }} numberOfLines={1}>
              {s.englishName}
            </Text>
            {isLast && <View style={[styles.lastDot, { backgroundColor: C.acc }]} />}
          </View>
          <Text style={{ fontSize: 10, color: C.muted, fontFamily: 'Sora_400Regular' }}>
            {s.englishNameTranslation} · {s.numberOfAyahs} ayahs · {s.revelationType}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {isDone && <Ionicons name="checkmark-circle" size={15} color={C.green} />}
          <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 18, color: C.acc }}>{s.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <Header
        title="Al-Quran"
        rightAction={
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Btn label={lang === 'en' ? 'EN' : 'BM'} sm onPress={() => setLang(lang === 'en' ? 'ms' : 'en')} />
            <Btn label="Juz" icon="list-outline" sm onPress={() => setShowJuz(v => !v)} />
            <Btn icon="search-outline" sm onPress={() => navigation.navigate('Search')} />
          </View>
        }
      />

      <View style={{ padding: 15, paddingBottom: 0 }}>
        <SearchInput placeholder="Search Surah name…" value={query} onChangeText={setQuery} />

        {/* Juz grid */}
        {showJuz && (
          <View style={styles.juzGrid}>
            {JUZ_MAP.map((surah, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.juzBtn, { backgroundColor: C.surf2, borderColor: C.brd }]}
                onPress={() => { navigation.navigate('Reader', { surahNum: surah }); setShowJuz(false); }}
              >
                <Text style={{ fontSize: 11, color: C.txt, fontFamily: 'Sora_400Regular' }}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, { backgroundColor: filter === f ? C.acc : C.surf2, borderColor: filter === f ? C.acc : C.brd }]}
              onPress={() => setFilter(f)}
            >
              <Text style={{ fontSize: 11, color: filter === f ? '#080D0A' : C.muted, fontFamily: filter === f ? 'Sora_600SemiBold' : 'Sora_400Regular' }}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? <Loader text="Loading 114 Surahs…" /> :
       error ? <ErrBox text={error} /> :
       <FlatList
         data={filtered}
         renderItem={renderItem}
         keyExtractor={s => String(s.number)}
         contentContainerStyle={{ padding: 15, paddingTop: 8 }}
         showsVerticalScrollIndicator={false}
         initialNumToRender={20}
         maxToRenderPerBatch={20}
       />
      }
    </Screen>
  );
}

const styles = StyleSheet.create({
  surahItem: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 10, marginBottom: 5, borderWidth: 1 },
  lastDot: { width: 6, height: 6, borderRadius: 3 },
  juzGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 },
  juzBtn: { width: '18%', aspectRatio: 1.2, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 5, marginBottom: 8, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
});
