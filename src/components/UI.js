import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../services/store';
import { COLORS } from '../data/constants';

// ─── useTheme hook ─────────────────────────────────────────────────
export function useTheme() {
  const dark = useStore(s => s.dark);
  return dark ? COLORS.dark : COLORS.light;
}

// ─── Screen wrapper ────────────────────────────────────────────────
export function Screen({ children, style }) {
  const insets = useSafeAreaInsets();
  const C = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
}

// ─── Header ────────────────────────────────────────────────────────
export function Header({ title, onBack, rightAction }) {
  const C = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: C.surf, borderBottomColor: C.brd }]}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.headerBack} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={C.muted} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: C.txt, fontFamily: 'CormorantGaramond_700Bold' }]}>
          {title}
        </Text>
      </View>
      {rightAction && <View style={styles.headerRight}>{rightAction}</View>}
    </View>
  );
}

// ─── Logo header ───────────────────────────────────────────────────
export function LogoHeader({ rightAction }) {
  const C = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: C.surf, borderBottomColor: C.brd }]}>
      <Text style={{ fontFamily: 'CormorantGaramond_700Bold', fontSize: 22, color: C.acc }}>
        Deen<Text style={{ opacity: .38, fontFamily: 'CormorantGaramond_300Light', fontSize: 18 }}>Base</Text>
      </Text>
      {rightAction && <View style={styles.headerRight}>{rightAction}</View>}
    </View>
  );
}

// ─── Cards ─────────────────────────────────────────────────────────
export function Card({ children, style }) {
  const C = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: C.surf, borderColor: C.brd }, style]}>
      {children}
    </View>
  );
}

export function Card2({ children, style }) {
  const C = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: C.surf2, borderColor: C.brd }, style]}>
      {children}
    </View>
  );
}

// ─── Button ────────────────────────────────────────────────────────
export function Btn({ label, icon, onPress, primary, sm, danger, disabled, style }) {
  const C = useTheme();
  const bg = primary ? C.acc : C.surf2;
  const color = primary ? '#080D0A' : danger ? C.red : C.txt;
  const border = primary ? C.acc : danger ? 'rgba(184,80,80,.3)' : C.brd;
  const pad = sm ? { paddingHorizontal: 10, paddingVertical: 5 } : { paddingHorizontal: 14, paddingVertical: 8 };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[styles.btn, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.5 : 1, ...pad }, style]}
    >
      {icon && <Ionicons name={icon} size={sm ? 14 : 16} color={color} style={{ marginRight: label ? 5 : 0 }} />}
      {label && <Text style={[styles.btnLabel, { color, fontSize: sm ? 11 : 13 }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

// ─── Section header ────────────────────────────────────────────────
export function SectionTitle({ text }) {
  const C = useTheme();
  return (
    <Text style={[styles.sectionTitle, { color: C.txt, fontFamily: 'CormorantGaramond_600SemiBold' }]}>
      {text}
    </Text>
  );
}

// ─── Muted text ────────────────────────────────────────────────────
export function Muted({ children, style }) {
  const C = useTheme();
  return <Text style={[{ color: C.muted, fontSize: 12, fontFamily: 'Sora_400Regular' }, style]}>{children}</Text>;
}

// ─── Badge ─────────────────────────────────────────────────────────
export function Badge({ label }) {
  const C = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: C.accAlpha, borderColor: `rgba(${C === COLORS.dark ? '196,164,74' : '139,94,26'},.2)` }]}>
      <Text style={[styles.badgeText, { color: C.acc }]}>{label}</Text>
    </View>
  );
}

// ─── Tag number ────────────────────────────────────────────────────
export function NumTag({ n }) {
  const C = useTheme();
  return (
    <View style={[styles.numTag, { backgroundColor: C.accAlpha }]}>
      <Text style={[styles.numTagText, { color: C.acc }]}>{n}</Text>
    </View>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────
export function ProgressBar({ pct, style }) {
  const C = useTheme();
  return (
    <View style={[styles.progBg, { backgroundColor: C.surf3 }, style]}>
      <View style={[styles.progFill, { backgroundColor: C.acc, width: `${pct}%` }]} />
    </View>
  );
}

// ─── Loader ────────────────────────────────────────────────────────
export function Loader({ text = 'Loading…' }) {
  const C = useTheme();
  return (
    <View style={styles.loaderWrap}>
      <ActivityIndicator size="large" color={C.acc} />
      <Muted style={{ marginTop: 12 }}>{text}</Muted>
    </View>
  );
}

// ─── Error box ─────────────────────────────────────────────────────
export function ErrBox({ text }) {
  const C = useTheme();
  return (
    <View style={[styles.errBox, { borderColor: 'rgba(184,80,80,.3)' }]}>
      <Ionicons name="warning-outline" size={14} color={C.red} style={{ marginRight: 6 }} />
      <Text style={[styles.errText, { color: C.red }]}>{text}</Text>
    </View>
  );
}

// ─── Info box ──────────────────────────────────────────────────────
export function InfoBox({ text, icon = 'information-circle-outline' }) {
  const C = useTheme();
  return (
    <View style={[styles.infoBox, { backgroundColor: C.accAlpha }]}>
      <Ionicons name={icon} size={15} color={C.acc} style={{ marginRight: 7, marginTop: 1, flexShrink: 0 }} />
      <Text style={[styles.infoText, { color: C.muted }]}>{text}</Text>
    </View>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────
export function Toggle({ value, onToggle }) {
  const C = useTheme();
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <View style={[styles.toggle, { backgroundColor: value ? C.acc : C.surf3, borderColor: value ? C.acc : C.brd }]}>
        <View style={[styles.toggleKnob, { transform: [{ translateX: value ? 18 : 0 }] }]} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Search input ──────────────────────────────────────────────────
export function SearchInput({ placeholder, value, onChangeText, onSubmit }) {
  const C = useTheme();
  return (
    <View style={[styles.searchWrap, { backgroundColor: C.surf2, borderColor: C.brd }]}>
      <Ionicons name="search-outline" size={16} color={C.muted} style={{ marginRight: 8 }} />
      <TextInput
        style={[styles.searchInput, { color: C.txt }]}
        placeholder={placeholder}
        placeholderTextColor={C.muted2}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Arabic text ───────────────────────────────────────────────────
export function ArabicText({ children, size = 28, color }) {
  const C = useTheme();
  return (
    <Text style={[styles.arabic, { fontSize: size, color: color || C.txt, lineHeight: size * 2 }]}>
      {children}
    </Text>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerBack: { padding: 2 },
  headerTitle: { fontSize: 22, lineHeight: 26 },
  headerRight: { flexDirection: 'row', gap: 6 },
  card: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10 },
  btnLabel: { fontFamily: 'Sora_500Medium' },
  sectionTitle: { fontSize: 19, marginBottom: 10, marginTop: 4 },
  badge: { borderRadius: 20, paddingHorizontal: 9, paddingVertical: 2, borderWidth: 1, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10.5, fontFamily: 'Sora_600SemiBold' },
  numTag: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  numTagText: { fontSize: 11, fontFamily: 'Sora_600SemiBold' },
  progBg: { height: 4, borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  progFill: { height: '100%', borderRadius: 4 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  errBox: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: 'rgba(184,80,80,.08)' },
  errText: { fontSize: 12, fontFamily: 'Sora_400Regular', flex: 1, lineHeight: 18 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 10, padding: 10, marginBottom: 10 },
  infoText: { fontSize: 11.5, fontFamily: 'Sora_400Regular', flex: 1, lineHeight: 17 },
  toggle: { width: 42, height: 24, borderRadius: 12, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 2 },
  toggleKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: .25, shadowRadius: 2, elevation: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Sora_400Regular', padding: 0 },
  arabic: { fontFamily: 'Amiri_400Regular', textAlign: 'right', writingDirection: 'rtl' },
});
