// ─── DESIGN TOKENS ────────────────────────────────────────────────
export const COLORS = {
  dark: {
    bg: '#080D0A',
    bg2: '#0C1410',
    surf: '#101A13',
    surf2: '#162019',
    surf3: '#1C2B20',
    brd: '#1E3026',
    brd2: '#243B2D',
    txt: '#DDE9E2',
    txt2: '#A8C4B2',
    muted: '#5A8068',
    muted2: '#3D5D4A',
    acc: '#C4A44A',
    acc2: '#A0822A',
    accAlpha: 'rgba(196,164,74,0.13)',
    green: '#3D8B5E',
    red: '#B85050',
  },
  light: {
    bg: '#F0EBE0',
    bg2: '#E8E0D4',
    surf: '#FDFAF5',
    surf2: '#F3EDE2',
    surf3: '#EAE2D6',
    brd: '#D4C9B5',
    brd2: '#C8BBA5',
    txt: '#18271C',
    txt2: '#3A5044',
    muted: '#7A9080',
    muted2: '#9EB0A4',
    acc: '#8B5E1A',
    acc2: '#C4A44A',
    accAlpha: 'rgba(139,94,26,0.12)',
    green: '#2D6B42',
    red: '#A03838',
  },
};

// ─── PRAYER NAMES & ICONS ──────────────────────────────────────────
export const SALAH = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PRAYER_ICONS = {
  Fajr: 'ph-sun-horizon',
  Dhuhr: 'ph-sun',
  Asr: 'ph-cloud-sun',
  Maghrib: 'ph-clouds-sun',
  Isha: 'ph-moon-stars',
  Sunrise: 'ph-sun-dim',
  Sunset: 'ph-sunset',
  Imsak: 'ph-fork-knife',
  Midnight: 'moon',
};

// ─── JUZ MAP ───────────────────────────────────────────────────────
export const JUZ_MAP = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 46, 51, 58, 67, 78];

// ─── 99 NAMES ──────────────────────────────────────────────────────
export const NAMES99 = [
  { n: 1, ar: 'الله', tr: 'Allah', m: 'The Only God, The Greatest Name' },
  { n: 2, ar: 'الرَّحْمَنُ', tr: 'Ar-Rahman', m: 'The Most Gracious' },
  { n: 3, ar: 'الرَّحِيمُ', tr: 'Ar-Rahim', m: 'The Most Merciful' },
  { n: 4, ar: 'الْمَلِكُ', tr: 'Al-Malik', m: 'The Sovereign, The King' },
  { n: 5, ar: 'الْقُدُّوسُ', tr: 'Al-Quddus', m: 'The Most Holy' },
  { n: 6, ar: 'السَّلاَمُ', tr: 'As-Salam', m: 'The Source of Peace' },
  { n: 7, ar: 'الْمُؤْمِنُ', tr: "Al-Mu'min", m: 'The Guardian of Faith' },
  { n: 8, ar: 'الْمُهَيْمِنُ', tr: 'Al-Muhaymin', m: 'The Protector, The Overseer' },
  { n: 9, ar: 'الْعَزِيزُ', tr: 'Al-Aziz', m: 'The Exalted in Might, The Almighty' },
  { n: 10, ar: 'الْجَبَّارُ', tr: 'Al-Jabbar', m: 'The Compeller, The Restorer' },
  { n: 11, ar: 'الْمُتَكَبِّرُ', tr: 'Al-Mutakabbir', m: 'The Supreme in Pride' },
  { n: 12, ar: 'الْخَالِقُ', tr: 'Al-Khaliq', m: 'The Creator' },
  { n: 13, ar: 'الْبَارِئُ', tr: "Al-Bari'", m: 'The Originator, The Evolver' },
  { n: 14, ar: 'الْمُصَوِّرُ', tr: 'Al-Musawwir', m: 'The Fashioner of Forms' },
  { n: 15, ar: 'الْغَفَّارُ', tr: 'Al-Ghaffar', m: 'The Perpetual Forgiver' },
  { n: 16, ar: 'الْقَهَّارُ', tr: 'Al-Qahhar', m: 'The Subduer, The Dominant' },
  { n: 17, ar: 'الْوَهَّابُ', tr: 'Al-Wahhab', m: 'The Bestower of Gifts' },
  { n: 18, ar: 'الرَّزَّاقُ', tr: 'Ar-Razzaq', m: 'The Provider, The Sustainer' },
  { n: 19, ar: 'الْفَتَّاحُ', tr: 'Al-Fattah', m: 'The Supreme Opener' },
  { n: 20, ar: 'الْعَلِيمُ', tr: 'Al-Alim', m: 'The All-Knowing' },
  { n: 21, ar: 'الْقَابِضُ', tr: 'Al-Qabid', m: 'The Constrictor' },
  { n: 22, ar: 'الْبَاسِطُ', tr: 'Al-Basit', m: 'The Expander' },
  { n: 23, ar: 'الْخَافِضُ', tr: 'Al-Khafid', m: 'The Abaser' },
  { n: 24, ar: 'الرَّافِعُ', tr: "Ar-Rafi'", m: 'The Exalter' },
  { n: 25, ar: 'الْمُعِزُّ', tr: "Al-Mu'izz", m: 'The Bestower of Honor' },
  { n: 26, ar: 'الْمُذِلُّ', tr: 'Al-Mudhill', m: 'The Dishonorer' },
  { n: 27, ar: 'السَّمِيعُ', tr: "As-Sami'", m: 'The All-Hearing' },
  { n: 28, ar: 'الْبَصِيرُ', tr: 'Al-Basir', m: 'The All-Seeing' },
  { n: 29, ar: 'الْحَكَمُ', tr: 'Al-Hakam', m: 'The Judge, The Arbitrator' },
  { n: 30, ar: 'الْعَدْلُ', tr: 'Al-Adl', m: 'The Utterly Just' },
  { n: 31, ar: 'اللَّطِيفُ', tr: 'Al-Latif', m: 'The Subtle One, The All-Kind' },
  { n: 32, ar: 'الْخَبِيرُ', tr: 'Al-Khabir', m: 'The All-Aware' },
  { n: 33, ar: 'الْحَلِيمُ', tr: 'Al-Halim', m: 'The Forbearing, The Clement' },
  { n: 34, ar: 'الْعَظِيمُ', tr: 'Al-Azim', m: 'The Magnificent' },
  { n: 35, ar: 'الْغَفُورُ', tr: 'Al-Ghafur', m: 'The All-Forgiving' },
  { n: 36, ar: 'الشَّكُورُ', tr: 'Ash-Shakur', m: 'The Grateful, The Appreciative' },
  { n: 37, ar: 'الْعَلِيُّ', tr: 'Al-Ali', m: 'The Most High, The Sublime' },
  { n: 38, ar: 'الْكَبِيرُ', tr: 'Al-Kabir', m: 'The Most Great' },
  { n: 39, ar: 'الْحَفِيظُ', tr: 'Al-Hafiz', m: 'The Preserver, The Guardian' },
  { n: 40, ar: 'الْمُقِيتُ', tr: 'Al-Muqit', m: 'The Nourisher, The Maintainer' },
  { n: 41, ar: 'الْحَسِيبُ', tr: 'Al-Hasib', m: 'The Reckoner' },
  { n: 42, ar: 'الْجَلِيلُ', tr: 'Al-Jalil', m: 'The Majestic, The Revered' },
  { n: 43, ar: 'الْكَرِيمُ', tr: 'Al-Karim', m: 'The Generous, The Noble' },
  { n: 44, ar: 'الرَّقِيبُ', tr: 'Ar-Raqib', m: 'The Watchful' },
  { n: 45, ar: 'الْمُجِيبُ', tr: 'Al-Mujib', m: 'The Responsive, The Answerer' },
  { n: 46, ar: 'الْوَاسِعُ', tr: "Al-Wasi'", m: 'The Vast, The All-Encompassing' },
  { n: 47, ar: 'الْحَكِيمُ', tr: 'Al-Hakim', m: 'The All-Wise' },
  { n: 48, ar: 'الْوَدُودُ', tr: 'Al-Wadud', m: 'The Loving, The Affectionate' },
  { n: 49, ar: 'الْمَجِيدُ', tr: 'Al-Majid', m: 'The Most Glorious' },
  { n: 50, ar: 'الْبَاعِثُ', tr: "Al-Ba'ith", m: 'The Resurrector' },
  { n: 51, ar: 'الشَّهِيدُ', tr: 'Ash-Shahid', m: 'The All-Witnessing' },
  { n: 52, ar: 'الْحَقُّ', tr: 'Al-Haqq', m: 'The Absolute Truth' },
  { n: 53, ar: 'الْوَكِيلُ', tr: 'Al-Wakil', m: 'The Trustee, The Disposer of Affairs' },
  { n: 54, ar: 'الْقَوِيُّ', tr: 'Al-Qawi', m: 'The All-Strong' },
  { n: 55, ar: 'الْمَتِينُ', tr: 'Al-Matin', m: 'The Firm, The Steadfast' },
  { n: 56, ar: 'الْوَلِيُّ', tr: 'Al-Wali', m: 'The Protecting Friend' },
  { n: 57, ar: 'الْحَمِيدُ', tr: 'Al-Hamid', m: 'The Praiseworthy' },
  { n: 58, ar: 'الْمُحْصِي', tr: 'Al-Muhsi', m: 'The All-Enumerating' },
  { n: 59, ar: 'الْمُبْدِئُ', tr: "Al-Mubdi'", m: 'The Originator, The Initiator' },
  { n: 60, ar: 'الْمُعِيدُ', tr: "Al-Mu'id", m: 'The Restorer' },
  { n: 61, ar: 'الْمُحْيِي', tr: 'Al-Muhyi', m: 'The Giver of Life' },
  { n: 62, ar: 'الْمُمِيتُ', tr: 'Al-Mumit', m: 'The Creator of Death' },
  { n: 63, ar: 'الْحَيُّ', tr: 'Al-Hayy', m: 'The Ever-Living' },
  { n: 64, ar: 'الْقَيُّومُ', tr: 'Al-Qayyum', m: 'The Self-Subsisting, The Sustainer' },
  { n: 65, ar: 'الْوَاجِدُ', tr: 'Al-Wajid', m: 'The Perceiver, The Finder' },
  { n: 66, ar: 'الْمَاجِدُ', tr: 'Al-Majid', m: 'The Illustrious' },
  { n: 67, ar: 'الْوَاحِدُ', tr: 'Al-Wahid', m: 'The One, The Unique' },
  { n: 68, ar: 'الأَحَدُ', tr: 'Al-Ahad', m: 'The Indivisible, The One and Only' },
  { n: 69, ar: 'الصَّمَدُ', tr: 'As-Samad', m: 'The Eternal, The Absolute' },
  { n: 70, ar: 'الْقَادِرُ', tr: 'Al-Qadir', m: 'The Omnipotent' },
  { n: 71, ar: 'الْمُقْتَدِرُ', tr: 'Al-Muqtadir', m: 'The Powerful, The Prevailing' },
  { n: 72, ar: 'الْمُقَدِّمُ', tr: 'Al-Muqaddim', m: 'The Expediter, The Promoter' },
  { n: 73, ar: 'الْمُؤَخِّرُ', tr: "Al-Mu'akhkhir", m: 'The Delayer' },
  { n: 74, ar: 'الأَوَّلُ', tr: 'Al-Awwal', m: 'The First' },
  { n: 75, ar: 'الآخِرُ', tr: 'Al-Akhir', m: 'The Last' },
  { n: 76, ar: 'الظَّاهِرُ', tr: 'Az-Zahir', m: 'The Manifest, The Evident' },
  { n: 77, ar: 'الْبَاطِنُ', tr: 'Al-Batin', m: 'The Hidden, The Concealed' },
  { n: 78, ar: 'الْوَالِي', tr: 'Al-Wali', m: 'The Governor, The Sole Patron' },
  { n: 79, ar: 'الْمُتَعَالِي', tr: "Al-Muta'ali", m: 'The Most Exalted' },
  { n: 80, ar: 'الْبَرُّ', tr: 'Al-Barr', m: 'The Source of All Goodness' },
  { n: 81, ar: 'التَّوَّابُ', tr: 'At-Tawwab', m: 'The Accepter of Repentance' },
  { n: 82, ar: 'الْمُنْتَقِمُ', tr: 'Al-Muntaqim', m: 'The Avenger' },
  { n: 83, ar: 'الْعَفُوُّ', tr: 'Al-Afuww', m: 'The Pardoner, The Effacer' },
  { n: 84, ar: 'الرَّؤُوفُ', tr: "Ar-Ra'uf", m: 'The Most Kind, The Compassionate' },
  { n: 85, ar: 'مَالِكُ الْمُلْكِ', tr: 'Malik-ul-Mulk', m: 'The Owner of All Sovereignty' },
  { n: 86, ar: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', tr: 'Dhul-Jalali-wal-Ikram', m: 'The Lord of Majesty and Bounty' },
  { n: 87, ar: 'الْمُقْسِطُ', tr: 'Al-Muqsit', m: 'The Equitable, The Impartial' },
  { n: 88, ar: 'الْجَامِعُ', tr: "Al-Jami'", m: 'The Gatherer, The Collector' },
  { n: 89, ar: 'الْغَنِيُّ', tr: 'Al-Ghani', m: 'The Self-Sufficient' },
  { n: 90, ar: 'الْمُغْنِي', tr: 'Al-Mughni', m: 'The Enricher' },
  { n: 91, ar: 'الْمَانِعُ', tr: "Al-Mani'", m: 'The Preventer' },
  { n: 92, ar: 'الضَّارُّ', tr: 'Ad-Darr', m: 'The Creator of the Harmful (for wisdom)' },
  { n: 93, ar: 'النَّافِعُ', tr: "An-Nafi'", m: 'The Creator of Benefit' },
  { n: 94, ar: 'النُّورُ', tr: 'An-Nur', m: 'The Light, The Illuminating' },
  { n: 95, ar: 'الْهَادِي', tr: 'Al-Hadi', m: 'The Guide' },
  { n: 96, ar: 'الْبَدِيعُ', tr: "Al-Badi'", m: 'The Originator, The Incomparable Creator' },
  { n: 97, ar: 'الْبَاقِي', tr: 'Al-Baqi', m: 'The Everlasting, The Eternal' },
  { n: 98, ar: 'الْوَارِثُ', tr: 'Al-Warith', m: 'The Inheritor, The Heir of All' },
  { n: 99, ar: 'الرَّشِيدُ', tr: 'Ar-Rashid', m: 'The Guide to the Right Path' },
];

// ─── AZKAR DATA ────────────────────────────────────────────────────
export const AZKAR = [
  {
    title: 'Morning Adhkar', items: [
      { ar: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', tr: 'I seek refuge in Allah from the accursed devil.', count: 1 },
      { ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', tr: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.', count: 1 },
      { ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا', tr: 'O Allah, I ask You for beneficial knowledge, pure provision, and accepted deeds.', count: 1 },
      { ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', tr: 'Glory be to Allah and His is the praise.', count: 100 },
      { ar: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ', tr: 'I seek the forgiveness of Allah and repent to Him.', count: 100 },
    ]
  },
  {
    title: 'Evening Adhkar', items: [
      { ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', tr: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is our return.', count: 1 },
      { ar: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', tr: 'I seek refuge in the perfect words of Allah from the evil of what He has created.', count: 3 },
      { ar: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', tr: 'Allah is sufficient for me. There is no god but Him. In Him I place my trust. He is the Lord of the Mighty Throne.', count: 7 },
    ]
  },
  {
    title: 'Tasbeeh', items: [
      { ar: 'سُبْحَانَ اللهِ', tr: 'Glory be to Allah.', count: 33 },
      { ar: 'الْحَمْدُ لِلَّهِ', tr: 'All praise is due to Allah.', count: 33 },
      { ar: 'اللهُ أَكْبَرُ', tr: 'Allah is the Greatest.', count: 34 },
      { ar: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ', tr: 'None has the right to be worshipped except Allah alone, no partner. His is the dominion and His is the praise.', count: 10 },
    ]
  },
  {
    title: 'After Salah', items: [
      { ar: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', tr: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.', count: 1 },
      { ar: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي', tr: 'O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.', count: 1 },
    ]
  },
  {
    title: 'Daily Duas', items: [
      { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', tr: 'Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire. [2:201]', count: 1, occ: 'Best Dua' },
      { ar: 'رَبِّ زِدْنِي عِلْمًا', tr: 'O my Lord, increase me in knowledge. [20:114]', count: 1, occ: 'Knowledge' },
      { ar: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ', tr: 'Allah is sufficient for us and He is the best Disposer of Affairs.', count: 3, occ: 'Hardship' },
      { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', tr: 'O my Lord, expand my breast for me and ease my task. [20:25-26]', count: 1, occ: 'Before a Task' },
      { ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', tr: 'O Turner of hearts, keep my heart firm upon Your religion.', count: 1, occ: 'Steadfastness' },
    ]
  },
];

// ─── QURAN QUOTES ──────────────────────────────────────────────────
export const QUOTES = [
  {
    category: 'Comfort & Patience',
    subtitle: 'Sabr',
    items: [
      { ref: '2:286', ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', en: 'Allah does not burden a soul beyond that it can bear.', ms: 'Allah tidak membebankan seseorang melainkan sesuai dengan kesanggupannya.' },
      { ref: '94:5-6', ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'For indeed, with hardship will be ease. Indeed, with hardship will be ease.', ms: 'Sesungguhnya bersama kesulitan ada kemudahan.' },
      { ref: '3:139', ar: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', en: 'Do not weaken and do not grieve, and you will be superior if you are believers.', ms: 'Janganlah kamu lemah dan jangan bersedih.' },
      { ref: '2:153', ar: 'اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', en: 'Seek help through patience and prayer.', ms: 'Mohonlah pertolongan dengan sabar dan solat.' },
      { ref: '39:10', ar: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ', en: 'The patient will be rewarded without measure.', ms: 'Orang yang sabar akan diberi pahala tanpa batas.' },
      { ref: '13:11', ar: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ', en: 'Allah does not change the condition of a people until they change themselves.', ms: 'Allah tidak akan mengubah keadaan suatu kaum hingga mereka mengubah diri mereka sendiri.' },
    ],
  },

  {
    category: 'Trust & Reliance',
    subtitle: 'Tawakkul',
    items: [
      { ref: '65:3', ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', en: 'Whoever relies upon Allah — He is sufficient for him.', ms: 'Sesiapa bertawakkal kepada Allah, maka Allah mencukupinya.' },
      { ref: '3:173', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en: 'Sufficient for us is Allah, and He is the best disposer of affairs.', ms: 'Cukuplah Allah bagi kami.' },
      { ref: '9:51', ar: 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا', en: 'Nothing will happen to us except what Allah has decreed.', ms: 'Tidak akan menimpa kami melainkan apa yang telah ditetapkan Allah.' },
      { ref: '4:81', ar: 'وَتَوَكَّلْ عَلَى اللَّهِ', en: 'And rely upon Allah.', ms: 'Dan bertawakkallah kepada Allah.' },
      { ref: '3:160', ar: 'إِن يَنصُرْكُمُ اللَّهُ فَلَا غَالِبَ لَكُمْ', en: 'If Allah helps you, none can overcome you.', ms: 'Jika Allah menolong kamu, tiada yang dapat mengalahkan kamu.' },
      { ref: '8:2', ar: 'إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ', en: 'When Allah is mentioned, their hearts tremble.', ms: 'Apabila disebut Allah, hati mereka bergetar.' },
    ],
  },

  {
    category: 'Mercy & Forgiveness',
    subtitle: 'Rahmah',
    items: [
      { ref: '39:53', ar: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', en: 'Do not despair of the mercy of Allah.', ms: 'Jangan berputus asa dari rahmat Allah.' },
      { ref: '40:60', ar: 'ادْعُونِي أَسْتَجِبْ لَكُمْ', en: 'Call upon Me; I will respond to you.', ms: 'Berdoalah kepada-Ku, Aku akan memperkenankan.' },
      { ref: '7:156', ar: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ', en: 'My mercy encompasses all things.', ms: 'Rahmat-Ku meliputi segala sesuatu.' },
      { ref: '15:49', ar: 'إِنِّي أَنَا الْغَفُورُ الرَّحِيمُ', en: 'I am the Forgiving, the Merciful.', ms: 'Aku Maha Pengampun, Maha Penyayang.' },
      { ref: '4:110', ar: 'يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا', en: 'He will find Allah Forgiving and Merciful.', ms: 'Dia akan mendapati Allah Maha Pengampun.' },
      { ref: '2:222', ar: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ', en: 'Allah loves those who repent.', ms: 'Allah mencintai orang yang bertaubat.' },
    ],
  },

  {
    category: 'Guidance & Clarity',
    subtitle: 'Hidayah',
    items: [
      { ref: '2:2', ar: 'هُدًى لِّلْمُتَّقِينَ', en: 'A guidance for the righteous.', ms: 'Petunjuk bagi orang yang bertakwa.' },
      { ref: '6:153', ar: 'وَأَنَّ هَٰذَا صِرَاطِي مُسْتَقِيمًا', en: 'This is My straight path.', ms: 'Inilah jalan-Ku yang lurus.' },
      { ref: '17:9', ar: 'إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ', en: 'Indeed, this Quran guides to what is most upright.', ms: 'Al-Quran memberi petunjuk kepada jalan yang paling benar.' },
      { ref: '5:16', ar: 'يَهْدِي بِهِ اللَّهُ مَنِ اتَّبَعَ رِضْوَانَهُ', en: 'Allah guides those who seek His pleasure.', ms: 'Allah memberi petunjuk kepada siapa yang mencari keredaan-Nya.' },
      { ref: '14:1', ar: 'كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ', en: 'A Book We have revealed to you.', ms: 'Sebuah Kitab yang Kami turunkan kepadamu.' },
    ],
  },

  {
    category: 'Gratitude & Contentment',
    subtitle: 'Shukr',
    items: [
      { ref: '14:7', ar: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', en: 'If you are grateful, I will surely increase you.', ms: 'Jika kamu bersyukur, Aku akan tambah nikmatmu.' },
      { ref: '2:152', ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ', en: 'Remember Me, I will remember you.', ms: 'Ingatlah Aku, Aku akan mengingatmu.' },
      { ref: '16:18', ar: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا', en: 'If you count Allah’s blessings, you cannot enumerate them.', ms: 'Jika kamu menghitung nikmat Allah, tidak akan mampu.' },
      { ref: '31:12', ar: 'وَلَقَدْ آتَيْنَا لُقْمَانَ الْحِكْمَةَ', en: 'We gave Luqman wisdom.', ms: 'Kami telah memberikan hikmah kepada Luqman.' },
    ],
  },

  {
    category: 'Protection & Safety',
    subtitle: 'Hifz',
    items: [
      { ref: '2:255', ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', en: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer.', ms: 'Allah, tiada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri.' },
      { ref: '113:1-5', ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', en: 'Say: I seek refuge in the Lord of daybreak.', ms: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh.' },
      { ref: '114:1-6', ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', en: 'Say: I seek refuge in the Lord of mankind.', ms: 'Katakanlah: Aku berlindung kepada Tuhan manusia.' },
      { ref: '4:79', ar: 'مَا أَصَابَكَ مِنْ حَسَنَةٍ فَمِنَ اللَّهِ', en: 'Whatever good befalls you is from Allah.', ms: 'Apa sahaja kebaikan datang dari Allah.' },
    ],
  },

  {
    category: 'Faith & Belief',
    subtitle: 'Iman',
    items: [
      { ref: '2:177', ar: 'لَيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ', en: 'Righteousness is not turning your faces toward east or west.', ms: 'Kebajikan bukan hanya menghadapkan wajah ke arah tertentu.' },
      { ref: '49:13', ar: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', en: 'The most noble of you in the sight of Allah is the most righteous.', ms: 'Yang paling mulia di sisi Allah ialah yang paling bertakwa.' },
      { ref: '22:46', ar: 'فَإِنَّهَا لَا تَعْمَى الْأَبْصَارُ', en: 'It is not eyes that are blind, but hearts.', ms: 'Bukan mata yang buta, tetapi hati.' },
      { ref: '57:20', ar: 'اعْلَمُوا أَنَّمَا الْحَيَاةُ الدُّنْيَا', en: 'Know that the life of this world is but play and amusement.', ms: 'Ketahuilah bahawa kehidupan dunia hanyalah permainan.' },
    ],
  },

  {
    category: 'Hope & Optimism',
    subtitle: 'Amal & Raja',
    items: [
      { ref: '93:4', ar: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', en: 'The Hereafter is better for you than the present.', ms: 'Akhirat itu lebih baik daripada dunia.' },
      { ref: '20:114', ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', en: 'Say: My Lord, increase me in knowledge.', ms: 'Wahai Tuhanku, tambahilah aku ilmu.' },
      { ref: '2:45', ar: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', en: 'Seek help through patience and prayer.', ms: 'Mohon pertolongan dengan sabar dan solat.' },
      { ref: '12:87', ar: 'إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ', en: 'Do not despair of Allah’s relief.', ms: 'Jangan berputus asa dari rahmat Allah.' },
    ],
  },

  {
    category: 'Justice & Truth',
    subtitle: 'Adl & Haqq',
    items: [
      { ref: '4:135', ar: 'كُونُوا قَوَّامِينَ بِالْقِسْطِ', en: 'Stand firmly for justice.', ms: 'Jadilah penegak keadilan.' },
      { ref: '5:8', ar: 'اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ', en: 'Be just; that is closer to righteousness.', ms: 'Berlaku adillah, itu lebih dekat kepada takwa.' },
      { ref: '16:90', ar: 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ', en: 'Indeed, Allah commands justice.', ms: 'Sesungguhnya Allah menyuruh berlaku adil.' },
      { ref: '17:81', ar: 'وَقُلْ جَاءَ الْحَقُّ', en: 'Say: Truth has come.', ms: 'Katakanlah: Kebenaran telah datang.' },
    ],
  },

  {
    category: 'Famous Islamic Sayings',
    subtitle: 'Wisdom',
    items: [
      { ref: 'Hadith', ar: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', en: 'Actions are judged by intentions.', ms: 'Sesungguhnya setiap amalan bergantung kepada niat.' },
      { ref: 'Saying', ar: 'اطلب العلم من المهد إلى اللحد', en: 'Seek knowledge from the cradle to the grave.', ms: 'Tuntutlah ilmu dari buaian hingga ke liang lahad.' },
      { ref: 'Saying', ar: 'الدنيا مزرعة الآخرة', en: 'This world is the farm of the Hereafter.', ms: 'Dunia adalah ladang akhirat.' },
      { ref: 'Saying', ar: 'من جدّ وجد', en: 'Whoever strives will succeed.', ms: 'Sesiapa yang berusaha, dia akan berjaya.' },
      { ref: 'Saying', ar: 'الصبر مفتاح الفرج', en: 'Patience is the key to relief.', ms: 'Sabar adalah kunci kepada kelegaan.' },
    ],
  },

  {
    category: 'Strength & Courage',
    subtitle: 'Quwwah',
    items: [
      { ref: '3:139', ar: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا', en: 'Do not weaken or grieve.', ms: 'Jangan lemah dan bersedih.' },
      { ref: '8:46', ar: 'وَاصْبِرُوا إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en: 'Be patient. Indeed, Allah is with the patient.', ms: 'Bersabarlah, Allah bersama orang yang sabar.' },
      { ref: '29:69', ar: 'لَنَهْدِيَنَّهُمْ سُبُلَنَا', en: 'We will guide them to Our ways.', ms: 'Kami akan memberi petunjuk kepada jalan Kami.' },
      { ref: '3:146', ar: 'وَكَأَيِّن مِّن نَّبِيٍّ قَاتَلَ مَعَهُ رِبِّيُّونَ', en: 'Many prophets fought alongside devoted followers.', ms: 'Ramai nabi berjuang bersama pengikut yang teguh.' },
    ],
  },
];

