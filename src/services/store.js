import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'deenbase_state_v1';

const defaultState = {
  // Theme & language
  dark: true,
  lang: 'en',
  // Prayer
  prayerData: null,
  pCity: 'Kuala Lumpur',
  pCountry: 'MY',
  pMethod: 11,
  adzanEnabled: false,
  // Quran
  surahs: [],
  lastSurah: null,
  lastAyah: 1,
  bookmarks: [],
  completed: [],
  arabicSize: 28,
  tafsirOn: true,
  // Azkar
  azkarCounters: {},
  // Stats cached
  hijriDate: null,
  hijriDateFetched: null,
};

export const useStore = create((set, get) => ({
  ...defaultState,

  // ─── Setters ────────────────────────────────────────────────────
  setDark: (v) => { set({ dark: v }); persist(get()); },
  setLang: (v) => { set({ lang: v }); persist(get()); },
  setPrayerData: (v) => { set({ prayerData: v }); persist(get()); },
  setPCity: (v) => { set({ pCity: v }); persist(get()); },
  setPCountry: (v) => { set({ pCountry: v }); persist(get()); },
  setPMethod: (v) => { set({ pMethod: v }); persist(get()); },
  setAdzanEnabled: (v) => { set({ adzanEnabled: v }); persist(get()); },
  setSurahs: (v) => set({ surahs: v }),
  setLastRead: (surah, ayah) => { set({ lastSurah: surah, lastAyah: ayah }); persist(get()); },
  setArabicSize: (v) => { set({ arabicSize: v }); persist(get()); },
  setTafsirOn: (v) => { set({ tafsirOn: v }); persist(get()); },
  setHijriDate: (v) => { set({ hijriDate: v, hijriDateFetched: Date.now() }); persist(get()); },

  // ─── Bookmarks ──────────────────────────────────────────────────
  toggleBookmark: (surah, ayah) => {
    const key = `${surah}:${ayah}`;
    const existing = get().bookmarks;
    const idx = existing.indexOf(key);
    const updated = idx >= 0
      ? existing.filter((_, i) => i !== idx)
      : [...existing, key];
    set({ bookmarks: updated });
    persist(get());
    return updated.includes(key);
  },
  clearBookmarks: () => { set({ bookmarks: [] }); persist(get()); },

  // ─── Completed surahs ───────────────────────────────────────────
  toggleComplete: (num) => {
    const existing = get().completed;
    const updated = existing.includes(num)
      ? existing.filter(x => x !== num)
      : [...existing, num];
    set({ completed: updated });
    persist(get());
    return updated.includes(num);
  },

  // ─── Azkar counters ──────────────────────────────────────────────
  incZikr: (key, max) => {
    const cur = get().azkarCounters[key] || 0;
    const updated = { ...get().azkarCounters, [key]: Math.min(cur + 1, max) };
    set({ azkarCounters: updated });
    persist(get());
  },
  resetZikr: (key) => {
    const updated = { ...get().azkarCounters };
    delete updated[key];
    set({ azkarCounters: updated });
    persist(get());
  },
  resetCategoryZikr: (tabIdx, itemCount) => {
    const updated = { ...get().azkarCounters };
    for (let i = 0; i < itemCount; i++) delete updated[`${tabIdx}-${i}`];
    set({ azkarCounters: updated });
    persist(get());
  },

  // ─── Persist & load ──────────────────────────────────────────────
  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ ...saved, surahs: [] }); // don't persist surahs (re-fetch)
      }
    } catch (e) {
      console.warn('Store load error:', e);
    }
  },

  resetAll: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...defaultState });
  },
}));

// ─── Persist subset of state ───────────────────────────────────────
function persist(state) {
  const toSave = {
    dark: state.dark,
    lang: state.lang,
    pCity: state.pCity,
    pCountry: state.pCountry,
    pMethod: state.pMethod,
    adzanEnabled: state.adzanEnabled,
    lastSurah: state.lastSurah,
    lastAyah: state.lastAyah,
    bookmarks: state.bookmarks,
    completed: state.completed,
    arabicSize: state.arabicSize,
    tafsirOn: state.tafsirOn,
    azkarCounters: state.azkarCounters,
    hijriDate: state.hijriDate,
    hijriDateFetched: state.hijriDateFetched,
  };
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
}
