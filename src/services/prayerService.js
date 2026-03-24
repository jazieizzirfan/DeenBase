import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { SALAH, PRAYER_ICONS } from '../data/constants';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

// ─── Notification setup ────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Request notification permissions ─────────────────────────────
export async function requestNotificationPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Request location permission ──────────────────────────────────
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

// ─── Get current location ─────────────────────────────────────────
export async function getCurrentLocation() {
  const granted = await requestLocationPermission();
  if (!granted) throw new Error('Location permission denied');
  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
  });
  return { lat: loc.coords.latitude, lng: loc.coords.longitude };
}

// ─── Fetch prayer times by city ────────────────────────────────────
export async function fetchPrayerByCity(city, country, method = 11) {
  const url = `${ALADHAN_BASE}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
  const res = await fetchWithRetry(url);
  const data = await res.json();
  if (data.code !== 200) throw new Error(data.data || 'City not found');
  return data.data;
}

// ─── Fetch prayer times by coordinates ────────────────────────────
export async function fetchPrayerByCoords(lat, lng, method = 11) {
  const url = `${ALADHAN_BASE}/timings?latitude=${lat}&longitude=${lng}&method=${method}`;
  const res = await fetchWithRetry(url);
  const data = await res.json();
  if (data.code !== 200) throw new Error('Failed to get prayer times');
  return data.data;
}

// ─── Fetch Qibla direction ─────────────────────────────────────────
export async function fetchQibla(lat, lng) {
  // First calculate locally (always works, offline)
  const localDir = calcQiblaLocal(lat, lng);
  // Then verify with API
  try {
    const url = `${ALADHAN_BASE}/qibla/${lat}/${lng}`;
    const res = await fetchWithTimeout(url, 5000);
    const data = await res.json();
    if (data.code === 200 && data.data?.direction) return data.data.direction;
  } catch {
    // Fall back to local calculation
  }
  return localDir;
}

// ─── Local Qibla calculation (Haversine) ──────────────────────────
export function calcQiblaLocal(lat, lng) {
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;
  const dLng = (MECCA_LNG - lng) * (Math.PI / 180);
  const lat1 = lat * (Math.PI / 180);
  const lat2 = MECCA_LAT * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360;
}

// ─── Fetch Hijri date ──────────────────────────────────────────────
export async function fetchHijriDate() {
  const d = new Date();
  const url = `${ALADHAN_BASE}/gToH/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  const res = await fetchWithTimeout(url, 5000);
  const data = await res.json();
  return data.data?.hijri;
}

// ─── Schedule Adzan notifications for the day ─────────────────────
export async function scheduleAzanNotifications(timings) {
  // Cancel all existing prayer notifications
  await cancelAzanNotifications();

  const now = new Date();
  const granted = await requestNotificationPermission();
  if (!granted) return;

  for (const prayer of SALAH) {
    const timeStr = timings[prayer];
    if (!timeStr) continue;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date(now);
    prayerDate.setHours(hours, minutes, 0, 0);

    // Only schedule if prayer time is in the future
    if (prayerDate <= now) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: `prayer-${prayer}`,
      content: {
        title: `${prayer} Prayer Time`,
        body: `It is time for ${prayer} prayer. Allahu Akbar.`,
        sound: 'azan.mp3', // bundled azan sound
        data: { prayer },
        categoryIdentifier: 'prayer',
      },
      trigger: {
        date: prayerDate,
      },
    });
  }
}

// ─── Cancel all scheduled azan notifications ──────────────────────
export async function cancelAzanNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('prayer-')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

// ─── Get next prayer ──────────────────────────────────────────────
export function getNextPrayer(timings) {
  if (!timings) return null;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();

  for (const name of SALAH) {
    const t = timings[name];
    if (!t) continue;
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m > cur) {
      return { name, time: t, mins: h * 60 + m };
    }
  }
  // Wrap to Fajr next day
  const t = timings['Fajr'] || '05:00';
  const [h, m] = t.split(':').map(Number);
  return { name: 'Fajr', time: t, mins: h * 60 + m, tomorrow: true };
}

// ─── Countdown string ─────────────────────────────────────────────
export function getCountdown(nextPrayer) {
  if (!nextPrayer) return '—';
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  let diff = nextPrayer.mins - cur;
  if (diff <= 0) diff += 1440;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `in ${h > 0 ? h + 'h ' : ''}${m}min`;
}

// ─── Fetch helpers ─────────────────────────────────────────────────
async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, 8000);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}
