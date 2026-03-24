import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useStore } from '../services/store';
import { fetchSurah, fetchTafsir, getAudioUrl } from '../services/quranService';
import { Screen, Header, Card, Card2, Loader, ErrBox, useTheme, Btn, ArabicText, Badge } from '../components/UI';

export default function ReaderScreen({ route, navigation }) {
  const surahNum = route.params?.surahNum || 1;
  const C = useTheme();
  const lang = useStore(s => s.lang);
  const setLang = useStore(s => s.setLang);
  const arabicSize = useStore(s => s.arabicSize);
  const setArabicSize = useStore(s => s.setArabicSize);
  const tafsirOn = useStore(s => s.tafsirOn);
  const setTafsirOn = useStore(s => s.setTafsirOn);
  const bookmarks = useStore(s => s.bookmarks);
  const toggleBookmark = useStore(s => s.toggleBookmark);
  const completed = useStore(s => s.completed);
  const toggleComplete = useStore(s => s.toggleComplete);
  const setLastRead = useStore(s => s.setLastRead);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [surahData, setSurahData] = useState(null);
  const [tafsirs, setTafsirs] = useState({});
  const [loadingTafsir, setLoadingTafsir] = useState({});
  const [showAudio, setShowAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [mushaFMode, setMushafMode] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    loadSurah();
    setLastRead(surahNum, 1);
    return () => { if (soundRef.current) soundRef.current.unloadAsync(); };
  }, [surahNum, lang]);

  async function loadSurah() {
    setLoading(true); setError('');
    try {
      const data = await fetchSurah(surahNum, lang);
      setSurahData(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function loadTafsirForAyah(ayah) {
    const key = `${surahNum}:${ayah}`;
    if (tafsirs[key] !== undefined) return;
    setLoadingTafsir(p => ({ ...p, [key]: true }));
    try {
      const text = await fetchTafsir(surahNum, ayah);
      setTafsirs(p => ({ ...p, [key]: text }));
    } catch {
      setTafsirs(p => ({ ...p, [key]: 'Could not load tafsir.' }));
    } finally {
      setLoadingTafsir(p => ({ ...p, [key]: false }));
    }
  }

  async function toggleAudio() {
    if (!showAudio) { setShowAudio(true); return; }
    if (isPlaying) {
      await soundRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: getAudioUrl(surahNum) },
          { shouldPlay: true },
          status => {
            if (status.durationMillis) setAudioProgress(status.positionMillis / status.durationMillis);
            if (status.didJustFinish) { setIsPlaying(false); setAudioProgress(0); }
          }
        );
        soundRef.current = sound;
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(true);
    }
  }

  async function stopAudio() {
    await soundRef.current?.unloadAsync();
    soundRef.current = null;
    setIsPlaying(false); setAudioProgress(0); setShowAudio(false);
  }

  function speakArabic(text) {
    Speech.stop();
    Speech.speak(text, { language: 'ar-SA', rate: 0.75 });
  }

  async function copyAyah(ayahData, translation) {
    const text = `${ayahData.text}\n\n${translation?.text || ''}\n\n— Quran ${surahNum}:${ayahData.numberInSurah}`;
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function shareAyah(ayahData, translation) {
    const text = `${ayahData.text}\n\n${translation?.text || ''}\n\n— Quran ${surahNum}:${ayahData.numberInSurah}`;
    await Share.share({ message: text });
  }

  const ar = surahData?.arabic;
  const tr = surahData?.translation;
  const isDone = completed.includes(surahNum);

  return (
    <Screen>
      <Header
        title={ar?.englishName || `Surah ${surahNum}`}
        onBack={() => navigation.goBack()}
        rightAction={
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Btn label={lang === 'en' ? 'EN' : 'BM'} sm onPress={() => setLang(lang === 'en' ? 'ms' : 'en')} />
            <Btn icon={tafsirOn ? 'document-text' : 'document-text-outline'} sm
              onPress={() => setTafsirOn(!tafsirOn)}
              style={{ borderColor: tafsirOn ? C.acc : C.brd }}
            />
            <Btn icon={isPlaying ? 'pause' : 'play'} sm onPress={toggleAudio} />
            <Btn icon="remove-outline" sm onPress={() => setArabicSize(Math.max(18, arabicSize - 2))} />
            <Btn icon="add-outline" sm onPress={() => setArabicSize(Math.min(42, arabicSize + 2))} />
          </View>
        }
      />

      {loading ? <Loader text="Loading Surah…" /> :
       error ? <View style={{ padding: 15 }}><ErrBox text={error} /></View> :
       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Audio bar */}
        {showAudio && (
          <View style={[styles.audioBar, { backgroundColor: C.surf2, borderColor: C.brd }]}>
            <TouchableOpacity onPress={toggleAudio} style={[styles.audioBtn, { backgroundColor: C.acc }]}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color="#080D0A" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.muted, fontSize: 11, fontFamily: 'Sora_400Regular' }}>Mishary Alafasy</Text>
              <View style={[styles.progressBg, { backgroundColor: C.surf3 }]}>
                <View style={[styles.progressFill, { backgroundColor: C.acc, width: `${audioProgress * 100}%` }]} />
              </View>
            </View>
            <TouchableOpacity onPress={stopAudio} style={{ padding: 4 }}>
              <Ionicons name="close" size={18} color={C.muted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Surah header */}
        <View style={[styles.surahHdr, { backgroundColor: C.surf2, borderColor: C.brd }]}>
          <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 24, color: C.acc, textAlign: 'center', lineHeight: 48, marginBottom: 4 }}>
            {ar?.name}
          </Text>
          <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 20, color: C.txt, textAlign: 'center' }}>
            {ar?.englishName}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, textAlign: 'center', fontFamily: 'Sora_400Regular', marginTop: 3 }}>
            {ar?.englishNameTranslation} · {ar?.numberOfAyahs} Ayahs · {ar?.revelationType}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10 }}>
            <Btn
              label={isDone ? '✓ Completed' : 'Mark Complete'}
              icon={isDone ? 'checkmark-circle' : 'ellipse-outline'}
              sm
              onPress={() => { toggleComplete(surahNum); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              style={{ borderColor: isDone ? C.green : C.brd }}
            />
            <Btn
              label={mushaFMode ? 'Translation' : 'Mushaf'}
              icon="text-outline"
              sm
              onPress={() => setMushafMode(v => !v)}
            />
          </View>
        </View>

        {/* Bismillah (not for Surah 1 or 9) */}
        {ar?.number !== 9 && ar?.number !== 1 && (
          <Text style={[styles.bismillah, { color: C.acc, fontFamily: 'Amiri_400Regular' }]}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
          </Text>
        )}

        {/* Ayahs */}
        {ar?.ayahs.map((ayah, i) => {
          const ta = tr?.ayahs?.[i];
          const bk = bookmarks.includes(`${surahNum}:${ayah.numberInSurah}`);
          const tafsirKey = `${surahNum}:${ayah.numberInSurah}`;
          const showTafsir = tafsirOn && tafsirs[tafsirKey] !== undefined;

          return (
            <View key={ayah.number} style={[styles.ayahCard, { backgroundColor: C.surf, borderColor: C.brd }]}>
              {/* Ayah header */}
              <View style={styles.ayahTop}>
                <View style={[styles.ayahNum, { backgroundColor: C.accAlpha }]}>
                  <Text style={{ color: C.acc, fontSize: 10.5, fontFamily: 'Sora_700Bold' }}>{ayah.numberInSurah}</Text>
                </View>
                <View style={styles.ayahActions}>
                  <TouchableOpacity onPress={() => speakArabic(ayah.text)} style={styles.actionBtn} hitSlop={6}>
                    <Ionicons name="volume-medium-outline" size={16} color={C.muted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copyAyah(ayah, ta)} style={styles.actionBtn} hitSlop={6}>
                    <Ionicons name="copy-outline" size={16} color={C.muted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => shareAyah(ayah, ta)} style={styles.actionBtn} hitSlop={6}>
                    <Ionicons name="share-outline" size={16} color={C.muted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { const marked = toggleBookmark(surahNum, ayah.numberInSurah); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={styles.actionBtn} hitSlop={6}
                  >
                    <Ionicons name={bk ? 'bookmark' : 'bookmark-outline'} size={16} color={bk ? C.acc : C.muted} />
                  </TouchableOpacity>
                  {tafsirOn && (
                    <TouchableOpacity
                      onPress={() => {
                        if (tafsirs[tafsirKey] === undefined) loadTafsirForAyah(ayah.numberInSurah);
                        else setTafsirs(p => { const n = { ...p }; delete n[tafsirKey]; return n; });
                      }}
                      style={styles.actionBtn} hitSlop={6}
                    >
                      <Ionicons name="document-text-outline" size={16} color={tafsirs[tafsirKey] !== undefined ? C.acc : C.muted} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Arabic text */}
              {!mushaFMode ? (
                <Text style={[styles.arabicText, { fontSize: arabicSize, color: C.txt, lineHeight: arabicSize * 1.9 }]}>
                  {ayah.text}
                </Text>
              ) : null}

              {/* Translation */}
              {!mushaFMode && ta && (
                <View style={[styles.translation, { borderTopColor: C.brd }]}>
                  <Text style={{ fontSize: 12.5, lineHeight: 20, color: C.txt2, fontStyle: 'italic', fontFamily: 'Sora_400Regular' }}>
                    {ta.text}
                  </Text>
                </View>
              )}

              {/* Tafsir */}
              {loadingTafsir[tafsirKey] && (
                <View style={[styles.tafsirBox, { backgroundColor: C.surf3, borderColor: C.brd2 }]}>
                  <Text style={{ color: C.muted, fontSize: 11, fontFamily: 'Sora_400Regular' }}>Loading tafsir…</Text>
                </View>
              )}
              {showTafsir && (
                <View style={[styles.tafsirBox, { backgroundColor: C.surf3, borderColor: C.brd2 }]}>
                  <Text style={{ fontSize: 10, color: C.acc, fontFamily: 'Sora_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>Tafsir Note</Text>
                  <Text style={{ fontSize: 12, lineHeight: 19, color: C.txt2, fontFamily: 'Sora_400Regular' }}>{tafsirs[tafsirKey]}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Mushaf mode: continuous text */}
        {mushaFMode && (
          <View style={[styles.mushafWrap, { backgroundColor: C.surf, borderColor: C.brd }]}>
            <Text style={[styles.mushafText, { fontSize: arabicSize * 1.1, color: C.txt, lineHeight: arabicSize * 2.2 }]}>
              {ar?.ayahs.map(ayah =>
                `${ayah.text} \u06DD${ayah.numberInSurah}\u06DD `
              ).join('')}
            </Text>
          </View>
        )}

       </ScrollView>
      }
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 15, paddingBottom: 30 },
  audioBar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 10, margin: 0, marginBottom: 11, borderWidth: 1 },
  audioBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  progressBg: { height: 3, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  surahHdr: { borderRadius: 14, padding: 15, textAlign: 'center', marginBottom: 13, borderWidth: 1 },
  bismillah: { fontSize: 22, textAlign: 'center', marginBottom: 13, paddingVertical: 5, writingDirection: 'rtl' },
  ayahCard: { borderRadius: 13, padding: 14, marginBottom: 8, borderWidth: 1 },
  ayahTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ayahNum: { width: 27, height: 27, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  ayahActions: { flexDirection: 'row', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' },
  actionBtn: { padding: 5, borderRadius: 7 },
  arabicText: { textAlign: 'right', fontFamily: 'Amiri_400Regular', writingDirection: 'rtl' },
  translation: { borderTopWidth: 1, paddingTop: 8, marginTop: 8 },
  tafsirBox: { borderRadius: 10, padding: 12, marginTop: 10, borderWidth: 1 },
  mushafWrap: { borderRadius: 14, padding: 18, borderWidth: 1 },
  mushafText: { fontFamily: 'Amiri_400Regular', textAlign: 'justify', writingDirection: 'rtl' },
});
