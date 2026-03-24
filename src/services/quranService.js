const BASE = 'https://api.alquran.cloud/v1';

// ─── Fetch all surah metadata ──────────────────────────────────────
export async function fetchSurahs() {
  const res = await fetch(`${BASE}/surah`);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error('Failed to load surahs');
  return data.data;
}

// ─── Fetch surah with Arabic + translation ─────────────────────────
export async function fetchSurah(num, lang = 'en') {
  const edition = lang === 'en' ? 'en.sahih' : 'ms.basmeih';
  const [arRes, trRes] = await Promise.all([
    fetch(`${BASE}/surah/${num}/quran-uthmani`),
    fetch(`${BASE}/surah/${num}/${edition}`),
  ]);
  const [arData, trData] = await Promise.all([arRes.json(), trRes.json()]);
  if (arData.status !== 'OK') throw new Error('Failed to load surah');
  return { arabic: arData.data, translation: trData.data };
}

// ─── Fetch tafsir for specific ayah ───────────────────────────────
export async function fetchTafsir(surah, ayah) {
  const res = await fetch(`${BASE}/ayah/${surah}:${ayah}/en.italiansafar`);
  const data = await res.json();
  return data.data?.text || 'No tafsir available for this verse.';
}

// ─── Search Quran ──────────────────────────────────────────────────
export async function searchQuran(query, lang = 'en') {
  const edition = lang === 'en' ? 'en.sahih' : 'ms.basmeih';
  const res = await fetch(`${BASE}/search/${encodeURIComponent(query)}/all/${edition}`);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error('Search failed');
  return data.data?.matches || [];
}

// ─── Surah audio URL ───────────────────────────────────────────────
export function getAudioUrl(surahNum) {
  return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`;
}
