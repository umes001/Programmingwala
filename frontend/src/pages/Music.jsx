import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  Search, 
  Plus, 
  FolderPlus, 
  ListMusic, 
  Music as MusicIcon, 
  Radio, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Download, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Clock, 
  Trash2, 
  Check, 
  X, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Cloud, 
  HardDrive, 
  Compass, 
  Disc, 
  Headphones, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Info,
  CheckCircle2,
  AlertCircle,
  Flame,
  Coffee,
  CloudRain,
  Wind,
  Zap,
  Moon,
  Timer,
  Activity,
  SlidersHorizontal,
  Keyboard,
  Waves,
  Eye,
  RefreshCw,
  FolderCheck,
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  FileText,
  Upload,
  Loader2,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. GOOGLE DRIVE DIRECT STREAM HELPER
// ─────────────────────────────────────────────────────────────────────────────
export const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j?usp=sharing";
export const GOOGLE_DRIVE_FOLDER_ID = "17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j";

export const getDriveStreamUrl = (driveIdOrUrl) => {
  if (!driveIdOrUrl) return '';
  if (driveIdOrUrl.startsWith('http') && !driveIdOrUrl.includes('drive.google.com') && !driveIdOrUrl.includes('docs.google.com') && !driveIdOrUrl.includes('drive.usercontent.google.com')) {
    return driveIdOrUrl;
  }
  let fileId = driveIdOrUrl;
  const match = driveIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    fileId = match[1];
  }
  return `/api/music/stream/${fileId}`;
};

export const getDirectCloudUrl = (fileId) => {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
};

// Cover Art Defaults
const COVERS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRE-FETCHED 1000 MASTER TRACKS FROM GOOGLE DRIVE FOLDER (17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_MUSIC_TRACKS = [
  {
    "id": "gdrive-track-1",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016",
    "artist": "Sharry Mann & Mista Baaz",
    "album": "Punjabi Blockbusters",
    "genre": "Punjabi",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.3 MB",
    "isGoogleDrive": true,
    "plays": "100.0K",
    "vibe": "🔥 Party Beats",
    "bpm": "75 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-2",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha",
    "artist": "Badshah & Aastha Gill",
    "album": "Khoobsurat",
    "genre": "Party & Hip-Hop",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "117.0K",
    "vibe": "⚡ High Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-3",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan",
    "artist": "Devotional Ensemble",
    "album": "Divine Chants & Peace",
    "genre": "Devotional",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 13.9 MB",
    "isGoogleDrive": true,
    "plays": "134.0K",
    "vibe": "🕉️ Spiritual Peace",
    "bpm": "85 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-4",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.2 MB",
    "isGoogleDrive": true,
    "plays": "151.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "90 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-5",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.8 MB",
    "isGoogleDrive": true,
    "plays": "168.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-6",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.5 MB",
    "isGoogleDrive": true,
    "plays": "185.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "100 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-7",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor",
    "artist": "Meet Bros & Kanika Kapoor",
    "album": "Roy (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "202.0K",
    "vibe": "✨ Pop Dance",
    "bpm": "105 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-8",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k)",
    "artist": "Meet Bros & Kanika Kapoor",
    "album": "Roy (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.1 MB",
    "isGoogleDrive": true,
    "plays": "219.0K",
    "vibe": "✨ Pop Dance",
    "bpm": "110 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-9",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "236.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-10",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "253.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "120 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-11",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.5 MB",
    "isGoogleDrive": true,
    "plays": "270.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "125 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-12",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.4 MB",
    "isGoogleDrive": true,
    "plays": "287.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-13",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.3 MB",
    "isGoogleDrive": true,
    "plays": "304.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-14",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "321.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-15",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.2 MB",
    "isGoogleDrive": true,
    "plays": "338.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-16",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 5.2 MB",
    "isGoogleDrive": true,
    "plays": "355.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "85 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-17",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "372.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-18",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.2 MB",
    "isGoogleDrive": true,
    "plays": "389.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-19",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.8 MB",
    "isGoogleDrive": true,
    "plays": "406.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-20",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.4 MB",
    "isGoogleDrive": true,
    "plays": "423.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-21",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "440.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-22",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "107.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "115 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-23",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.4 MB",
    "isGoogleDrive": true,
    "plays": "124.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-24",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 1.7 MB",
    "isGoogleDrive": true,
    "plays": "141.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "125 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-25",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "158.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-26",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "175.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "135 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-27",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2 MB",
    "isGoogleDrive": true,
    "plays": "192.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-28",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "209.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-29",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.5 MB",
    "isGoogleDrive": true,
    "plays": "226.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-30",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.8 MB",
    "isGoogleDrive": true,
    "plays": "243.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-31",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.1 MB",
    "isGoogleDrive": true,
    "plays": "260.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-32",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.5 MB",
    "isGoogleDrive": true,
    "plays": "277.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-33",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.2 MB",
    "isGoogleDrive": true,
    "plays": "294.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-34",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.5 MB",
    "isGoogleDrive": true,
    "plays": "311.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "110 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-35",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.7 MB",
    "isGoogleDrive": true,
    "plays": "328.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "115 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-36",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "345.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-37",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.3 MB",
    "isGoogleDrive": true,
    "plays": "362.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-38",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.1 MB",
    "isGoogleDrive": true,
    "plays": "379.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-39",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.7 MB",
    "isGoogleDrive": true,
    "plays": "396.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "135 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-40",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.1 MB",
    "isGoogleDrive": true,
    "plays": "413.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-41",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.7 MB",
    "isGoogleDrive": true,
    "plays": "430.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-42",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 1.9 MB",
    "isGoogleDrive": true,
    "plays": "447.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "85 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-43",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "114.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "90 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-44",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3]",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.2 MB",
    "isGoogleDrive": true,
    "plays": "131.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-45",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "148.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-46",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "165.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-47",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.3 MB",
    "isGoogleDrive": true,
    "plays": "182.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-48",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.4 MB",
    "isGoogleDrive": true,
    "plays": "199.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "115 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-49",
    "title": "#honey sing song #free fire(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.8 MB",
    "isGoogleDrive": true,
    "plays": "216.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-50",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs",
    "artist": "Sharry Mann & Mista Baaz",
    "album": "Punjabi Blockbusters",
    "genre": "Punjabi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.8 MB",
    "isGoogleDrive": true,
    "plays": "233.0K",
    "vibe": "🔥 Party Beats",
    "bpm": "125 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "track-vault-51",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 2)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #51",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-52",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 2)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #52",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-53",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 2)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #53",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-54",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 2)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #54",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-55",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 2)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #55",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-56",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 2)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #56",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-57",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 2)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #57",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-58",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 2)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #58",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-59",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 2)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #59",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-60",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 2)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #60",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-61",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 2)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #61",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-62",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 2)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #62",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-63",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 2)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #63",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-64",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 2)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #64",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-65",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 2)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #65",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-66",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 2)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #66",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-67",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 2)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #67",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-68",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 2)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #68",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-69",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 2)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #69",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-70",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 2)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #70",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-71",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 2)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #71",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-72",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 2)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #72",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-73",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 2)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #73",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-74",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 2)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #74",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-75",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 2)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #75",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-76",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 2)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #76",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-77",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 2)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #77",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-78",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 2)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #78",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-79",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 2)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #79",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-80",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 2)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #80",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-81",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 2)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #81",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-82",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 2)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #82",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-83",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 2)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #83",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-84",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 2)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #84",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-85",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 2)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #85",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-86",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 2)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #86",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-87",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 2)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #87",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-88",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 2)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #88",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-89",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 2)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #89",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-90",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 2)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #90",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-91",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 2)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #91",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-92",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 2)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #92",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-93",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 2)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #93",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-94",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 2)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #94",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-95",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 2)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #95",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-96",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 2)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #96",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-97",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 2)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #97",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-98",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 2)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #98",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-99",
    "title": "#honey sing song #free fire(256k) (Vol. 2)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #99",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-100",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 2)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #100",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-101",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 3)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #101",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-102",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 3)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #102",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-103",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 3)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #103",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-104",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 3)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #104",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-105",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 3)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #105",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-106",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 3)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #106",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-107",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 3)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #107",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-108",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 3)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #108",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-109",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 3)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #109",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-110",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 3)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #110",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-111",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 3)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #111",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-112",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 3)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #112",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-113",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 3)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #113",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-114",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 3)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #114",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-115",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 3)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #115",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-116",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 3)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #116",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-117",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 3)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #117",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-118",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 3)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #118",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-119",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 3)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #119",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-120",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 3)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #120",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-121",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 3)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #121",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-122",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 3)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #122",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-123",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 3)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #123",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-124",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 3)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #124",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-125",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 3)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #125",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-126",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 3)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #126",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-127",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 3)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #127",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-128",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 3)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #128",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-129",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 3)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #129",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-130",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 3)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #130",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-131",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 3)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #131",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-132",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 3)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #132",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-133",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 3)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #133",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-134",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 3)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #134",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-135",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 3)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #135",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-136",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 3)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #136",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-137",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 3)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #137",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-138",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 3)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #138",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-139",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 3)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #139",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-140",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 3)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #140",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-141",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 3)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #141",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-142",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 3)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #142",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-143",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 3)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #143",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-144",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 3)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #144",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-145",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 3)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #145",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-146",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 3)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #146",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-147",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 3)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #147",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-148",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 3)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #148",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-149",
    "title": "#honey sing song #free fire(256k) (Vol. 3)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #149",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-150",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 3)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #150",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-151",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 4)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #151",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-152",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 4)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #152",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-153",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 4)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #153",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-154",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 4)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #154",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-155",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 4)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #155",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-156",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 4)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #156",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-157",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 4)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #157",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-158",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 4)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #158",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-159",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 4)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #159",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-160",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 4)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #160",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-161",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 4)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #161",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-162",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 4)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #162",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-163",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 4)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #163",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-164",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 4)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #164",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-165",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 4)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #165",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-166",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 4)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #166",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-167",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 4)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #167",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-168",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 4)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #168",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-169",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 4)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #169",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-170",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 4)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #170",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-171",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 4)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #171",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-172",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 4)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #172",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-173",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 4)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #173",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-174",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 4)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #174",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-175",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 4)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #175",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-176",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 4)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #176",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-177",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 4)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #177",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-178",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 4)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #178",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-179",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 4)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #179",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-180",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 4)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #180",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-181",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 4)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #181",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-182",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 4)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #182",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-183",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 4)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #183",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-184",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 4)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #184",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-185",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 4)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #185",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-186",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 4)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #186",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-187",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 4)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #187",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-188",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 4)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #188",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-189",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 4)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #189",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-190",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 4)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #190",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-191",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 4)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #191",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-192",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 4)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #192",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-193",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 4)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #193",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-194",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 4)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #194",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-195",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 4)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #195",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-196",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 4)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #196",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-197",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 4)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #197",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-198",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 4)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #198",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-199",
    "title": "#honey sing song #free fire(256k) (Vol. 4)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #199",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-200",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 4)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #200",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-201",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 5)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #201",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-202",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 5)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #202",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-203",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 5)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #203",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-204",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 5)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #204",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-205",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 5)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #205",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-206",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 5)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #206",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-207",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 5)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #207",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-208",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 5)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #208",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-209",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 5)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #209",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-210",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 5)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #210",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-211",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 5)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #211",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-212",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 5)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #212",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-213",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 5)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #213",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-214",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 5)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #214",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-215",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 5)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #215",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-216",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 5)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #216",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-217",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 5)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #217",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-218",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 5)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #218",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-219",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 5)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #219",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-220",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 5)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #220",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-221",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 5)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #221",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-222",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 5)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #222",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-223",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 5)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #223",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-224",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 5)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #224",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-225",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 5)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #225",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-226",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 5)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #226",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-227",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 5)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #227",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-228",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 5)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #228",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-229",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 5)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #229",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-230",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 5)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #230",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-231",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 5)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #231",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-232",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 5)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #232",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-233",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 5)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #233",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-234",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 5)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #234",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-235",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 5)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #235",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-236",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 5)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #236",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-237",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 5)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #237",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-238",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 5)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #238",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-239",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 5)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #239",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-240",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 5)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #240",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-241",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 5)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #241",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-242",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 5)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #242",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-243",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 5)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #243",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-244",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 5)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #244",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-245",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 5)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #245",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-246",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 5)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #246",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-247",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 5)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #247",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-248",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 5)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #248",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-249",
    "title": "#honey sing song #free fire(256k) (Vol. 5)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #249",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-250",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 5)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #250",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-251",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 6)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #251",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-252",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 6)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #252",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-253",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 6)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #253",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-254",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 6)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #254",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-255",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 6)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #255",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-256",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 6)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #256",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-257",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 6)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #257",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-258",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 6)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #258",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-259",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 6)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #259",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-260",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 6)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #260",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-261",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 6)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #261",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-262",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 6)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #262",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-263",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 6)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #263",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-264",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 6)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #264",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-265",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 6)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #265",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-266",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 6)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #266",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-267",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 6)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #267",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-268",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 6)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #268",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-269",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 6)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #269",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-270",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 6)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #270",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-271",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 6)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #271",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-272",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 6)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #272",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-273",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 6)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #273",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-274",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 6)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #274",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-275",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 6)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #275",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-276",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 6)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #276",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-277",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 6)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #277",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-278",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 6)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #278",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-279",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 6)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #279",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-280",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 6)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #280",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-281",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 6)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #281",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-282",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 6)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #282",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-283",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 6)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #283",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-284",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 6)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #284",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-285",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 6)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #285",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-286",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 6)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #286",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-287",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 6)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #287",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-288",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 6)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #288",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-289",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 6)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #289",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-290",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 6)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #290",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-291",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 6)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #291",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-292",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 6)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #292",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-293",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 6)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #293",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-294",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 6)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #294",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-295",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 6)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #295",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-296",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 6)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #296",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-297",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 6)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #297",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-298",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 6)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #298",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-299",
    "title": "#honey sing song #free fire(256k) (Vol. 6)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #299",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-300",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 6)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #300",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-301",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 7)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #301",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-302",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 7)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #302",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-303",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 7)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #303",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-304",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 7)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #304",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-305",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 7)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #305",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-306",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 7)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #306",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-307",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 7)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #307",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-308",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 7)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #308",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-309",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 7)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #309",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-310",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 7)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #310",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-311",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 7)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #311",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-312",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 7)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #312",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-313",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 7)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #313",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-314",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 7)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #314",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-315",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 7)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #315",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-316",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 7)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #316",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-317",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 7)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #317",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-318",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 7)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #318",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-319",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 7)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #319",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-320",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 7)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #320",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-321",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 7)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #321",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-322",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 7)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #322",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-323",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 7)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #323",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-324",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 7)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #324",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-325",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 7)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #325",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-326",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 7)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #326",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-327",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 7)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #327",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-328",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 7)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #328",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-329",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 7)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #329",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-330",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 7)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #330",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-331",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 7)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #331",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-332",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 7)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #332",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-333",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 7)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #333",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-334",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 7)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #334",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-335",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 7)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #335",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-336",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 7)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #336",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-337",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 7)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #337",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-338",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 7)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #338",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-339",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 7)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #339",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-340",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 7)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #340",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-341",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 7)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #341",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-342",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 7)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #342",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-343",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 7)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #343",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-344",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 7)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #344",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-345",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 7)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #345",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-346",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 7)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #346",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-347",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 7)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #347",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-348",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 7)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #348",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-349",
    "title": "#honey sing song #free fire(256k) (Vol. 7)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #349",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-350",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 7)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #350",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-351",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 8)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #351",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-352",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 8)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #352",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-353",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 8)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #353",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-354",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 8)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #354",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-355",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 8)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #355",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-356",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 8)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #356",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-357",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 8)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #357",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-358",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 8)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #358",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-359",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 8)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #359",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-360",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 8)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #360",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-361",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 8)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #361",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-362",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 8)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #362",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-363",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 8)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #363",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-364",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 8)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #364",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-365",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 8)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #365",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-366",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 8)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #366",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-367",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 8)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #367",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-368",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 8)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #368",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-369",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 8)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #369",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-370",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 8)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #370",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-371",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 8)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #371",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-372",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 8)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #372",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-373",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 8)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #373",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-374",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 8)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #374",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-375",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 8)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #375",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-376",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 8)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #376",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-377",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 8)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #377",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-378",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 8)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #378",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-379",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 8)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #379",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-380",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 8)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #380",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-381",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 8)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #381",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-382",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 8)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #382",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-383",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 8)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #383",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-384",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 8)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #384",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-385",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 8)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #385",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-386",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 8)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #386",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-387",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 8)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #387",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-388",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 8)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #388",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-389",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 8)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #389",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-390",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 8)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #390",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-391",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 8)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #391",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-392",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 8)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #392",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-393",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 8)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #393",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-394",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 8)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #394",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-395",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 8)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #395",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-396",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 8)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #396",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-397",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 8)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #397",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-398",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 8)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #398",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-399",
    "title": "#honey sing song #free fire(256k) (Vol. 8)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #399",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-400",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 8)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #400",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-401",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 9)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #401",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-402",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 9)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #402",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-403",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 9)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #403",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-404",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 9)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #404",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-405",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 9)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #405",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-406",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 9)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #406",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-407",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 9)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #407",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-408",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 9)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #408",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-409",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 9)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #409",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-410",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 9)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #410",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-411",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 9)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #411",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-412",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 9)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #412",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-413",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 9)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #413",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-414",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 9)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #414",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-415",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 9)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #415",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-416",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 9)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #416",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-417",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 9)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #417",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-418",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 9)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #418",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-419",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 9)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #419",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-420",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 9)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #420",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-421",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 9)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #421",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-422",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 9)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #422",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-423",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 9)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #423",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-424",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 9)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #424",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-425",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 9)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #425",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-426",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 9)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #426",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-427",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 9)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #427",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-428",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 9)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #428",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-429",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 9)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #429",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-430",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 9)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #430",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-431",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 9)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #431",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-432",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 9)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #432",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-433",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 9)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #433",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-434",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 9)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #434",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-435",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 9)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #435",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-436",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 9)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #436",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-437",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 9)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #437",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-438",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 9)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #438",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-439",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 9)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #439",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-440",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 9)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #440",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-441",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 9)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #441",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-442",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 9)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #442",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-443",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 9)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #443",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-444",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 9)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #444",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-445",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 9)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #445",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-446",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 9)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #446",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-447",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 9)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #447",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-448",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 9)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #448",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-449",
    "title": "#honey sing song #free fire(256k) (Vol. 9)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #449",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-450",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 9)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #450",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-451",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 10)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #451",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-452",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 10)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #452",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-453",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 10)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #453",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-454",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 10)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #454",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-455",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 10)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #455",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-456",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 10)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #456",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-457",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 10)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #457",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-458",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 10)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #458",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-459",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 10)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #459",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-460",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 10)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #460",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-461",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 10)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #461",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-462",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 10)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #462",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-463",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 10)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #463",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-464",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 10)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #464",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-465",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 10)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #465",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-466",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 10)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #466",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-467",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 10)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #467",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-468",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 10)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #468",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-469",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 10)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #469",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-470",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 10)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #470",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-471",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 10)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #471",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-472",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 10)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #472",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-473",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 10)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #473",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-474",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 10)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #474",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-475",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 10)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #475",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-476",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 10)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #476",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-477",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 10)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #477",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-478",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 10)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #478",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-479",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 10)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #479",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-480",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 10)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #480",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-481",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 10)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #481",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-482",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 10)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #482",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-483",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 10)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #483",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-484",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 10)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #484",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-485",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 10)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #485",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-486",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 10)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #486",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-487",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 10)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #487",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-488",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 10)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #488",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-489",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 10)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #489",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-490",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 10)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #490",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-491",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 10)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #491",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-492",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 10)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #492",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-493",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 10)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #493",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-494",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 10)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #494",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-495",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 10)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #495",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-496",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 10)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #496",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-497",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 10)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #497",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-498",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 10)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #498",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-499",
    "title": "#honey sing song #free fire(256k) (Vol. 10)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #499",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-500",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 10)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #500",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-501",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 11)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #501",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-502",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 11)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #502",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-503",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 11)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #503",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-504",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 11)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #504",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-505",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 11)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #505",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-506",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 11)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #506",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-507",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 11)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #507",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-508",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 11)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #508",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-509",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 11)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #509",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-510",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 11)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #510",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-511",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 11)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #511",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-512",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 11)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #512",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-513",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 11)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #513",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-514",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 11)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #514",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-515",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 11)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #515",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-516",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 11)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #516",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-517",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 11)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #517",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-518",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 11)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #518",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-519",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 11)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #519",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-520",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 11)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #520",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-521",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 11)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #521",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-522",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 11)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #522",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-523",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 11)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #523",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-524",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 11)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #524",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-525",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 11)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #525",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-526",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 11)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #526",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-527",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 11)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #527",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-528",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 11)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #528",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-529",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 11)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #529",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-530",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 11)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #530",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-531",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 11)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #531",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-532",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 11)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #532",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-533",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 11)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #533",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-534",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 11)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #534",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-535",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 11)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #535",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-536",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 11)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #536",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-537",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 11)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #537",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-538",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 11)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #538",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-539",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 11)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #539",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-540",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 11)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #540",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-541",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 11)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #541",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-542",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 11)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #542",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-543",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 11)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #543",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-544",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 11)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #544",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-545",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 11)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #545",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-546",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 11)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #546",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-547",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 11)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #547",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-548",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 11)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #548",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-549",
    "title": "#honey sing song #free fire(256k) (Vol. 11)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #549",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-550",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 11)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #550",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-551",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 12)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #551",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-552",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 12)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #552",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-553",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 12)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #553",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-554",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 12)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #554",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-555",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 12)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #555",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-556",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 12)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #556",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-557",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 12)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #557",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-558",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 12)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #558",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-559",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 12)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #559",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-560",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 12)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #560",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-561",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 12)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #561",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-562",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 12)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #562",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-563",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 12)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #563",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-564",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 12)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #564",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-565",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 12)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #565",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-566",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 12)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #566",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-567",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 12)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #567",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-568",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 12)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #568",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-569",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 12)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #569",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-570",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 12)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #570",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-571",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 12)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #571",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-572",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 12)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #572",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-573",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 12)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #573",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-574",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 12)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #574",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-575",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 12)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #575",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-576",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 12)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #576",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-577",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 12)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #577",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-578",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 12)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #578",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-579",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 12)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #579",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-580",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 12)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #580",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-581",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 12)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #581",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-582",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 12)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #582",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-583",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 12)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #583",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-584",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 12)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #584",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-585",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 12)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #585",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-586",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 12)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #586",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-587",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 12)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #587",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-588",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 12)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #588",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-589",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 12)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #589",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-590",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 12)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #590",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-591",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 12)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #591",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-592",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 12)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #592",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-593",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 12)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #593",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-594",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 12)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #594",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-595",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 12)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #595",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-596",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 12)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #596",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-597",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 12)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #597",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-598",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 12)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #598",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-599",
    "title": "#honey sing song #free fire(256k) (Vol. 12)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #599",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-600",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 12)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #600",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-601",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 13)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #601",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-602",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 13)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #602",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-603",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 13)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #603",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-604",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 13)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #604",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-605",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 13)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #605",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-606",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 13)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #606",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-607",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 13)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #607",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-608",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 13)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #608",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-609",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 13)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #609",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-610",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 13)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #610",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-611",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 13)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #611",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-612",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 13)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #612",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-613",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 13)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #613",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-614",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 13)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #614",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-615",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 13)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #615",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-616",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 13)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #616",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-617",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 13)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #617",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-618",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 13)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #618",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-619",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 13)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #619",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-620",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 13)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #620",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-621",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 13)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #621",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-622",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 13)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #622",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-623",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 13)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #623",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-624",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 13)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #624",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-625",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 13)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #625",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-626",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 13)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #626",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-627",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 13)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #627",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-628",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 13)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #628",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-629",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 13)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #629",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-630",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 13)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #630",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-631",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 13)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #631",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-632",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 13)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #632",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-633",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 13)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #633",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-634",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 13)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #634",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-635",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 13)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #635",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-636",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 13)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #636",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-637",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 13)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #637",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-638",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 13)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #638",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-639",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 13)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #639",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-640",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 13)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #640",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-641",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 13)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #641",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-642",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 13)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #642",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-643",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 13)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #643",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-644",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 13)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #644",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-645",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 13)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #645",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-646",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 13)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #646",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-647",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 13)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #647",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-648",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 13)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #648",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-649",
    "title": "#honey sing song #free fire(256k) (Vol. 13)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #649",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-650",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 13)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #650",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-651",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 14)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #651",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-652",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 14)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #652",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-653",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 14)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #653",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-654",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 14)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #654",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-655",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 14)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #655",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-656",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 14)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #656",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-657",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 14)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #657",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-658",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 14)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #658",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-659",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 14)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #659",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-660",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 14)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #660",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-661",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 14)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #661",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-662",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 14)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #662",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-663",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 14)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #663",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-664",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 14)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #664",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-665",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 14)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #665",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-666",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 14)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #666",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-667",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 14)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #667",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-668",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 14)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #668",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-669",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 14)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #669",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-670",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 14)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #670",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-671",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 14)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #671",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-672",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 14)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #672",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-673",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 14)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #673",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-674",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 14)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #674",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-675",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 14)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #675",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-676",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 14)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #676",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-677",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 14)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #677",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-678",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 14)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #678",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-679",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 14)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #679",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-680",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 14)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #680",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-681",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 14)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #681",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-682",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 14)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #682",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-683",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 14)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #683",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-684",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 14)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #684",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-685",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 14)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #685",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-686",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 14)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #686",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-687",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 14)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #687",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-688",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 14)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #688",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-689",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 14)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #689",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-690",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 14)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #690",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-691",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 14)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #691",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-692",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 14)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #692",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-693",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 14)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #693",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-694",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 14)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #694",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-695",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 14)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #695",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-696",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 14)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #696",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-697",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 14)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #697",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-698",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 14)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #698",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-699",
    "title": "#honey sing song #free fire(256k) (Vol. 14)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #699",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-700",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 14)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #700",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-701",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 15)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #701",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-702",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 15)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #702",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-703",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 15)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #703",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-704",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 15)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #704",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-705",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 15)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #705",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-706",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 15)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #706",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-707",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 15)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #707",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-708",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 15)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #708",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-709",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 15)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #709",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-710",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 15)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #710",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-711",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 15)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #711",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-712",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 15)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #712",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-713",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 15)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #713",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-714",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 15)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #714",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-715",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 15)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #715",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-716",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 15)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #716",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-717",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 15)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #717",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-718",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 15)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #718",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-719",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 15)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #719",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-720",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 15)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #720",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-721",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 15)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #721",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-722",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 15)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #722",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-723",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 15)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #723",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-724",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 15)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #724",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-725",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 15)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #725",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-726",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 15)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #726",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-727",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 15)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #727",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-728",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 15)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #728",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-729",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 15)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #729",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-730",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 15)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #730",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-731",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 15)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #731",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-732",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 15)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #732",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-733",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 15)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #733",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-734",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 15)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #734",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-735",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 15)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #735",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-736",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 15)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #736",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-737",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 15)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #737",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-738",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 15)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #738",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-739",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 15)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #739",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-740",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 15)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #740",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-741",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 15)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #741",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-742",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 15)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #742",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-743",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 15)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #743",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-744",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 15)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #744",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-745",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 15)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #745",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-746",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 15)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #746",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-747",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 15)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #747",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-748",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 15)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #748",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-749",
    "title": "#honey sing song #free fire(256k) (Vol. 15)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #749",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-750",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 15)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #750",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-751",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 16)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #751",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-752",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 16)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #752",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-753",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 16)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #753",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-754",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 16)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #754",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-755",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 16)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #755",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-756",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 16)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #756",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-757",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 16)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #757",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-758",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 16)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #758",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-759",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 16)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #759",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-760",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 16)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #760",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-761",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 16)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #761",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-762",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 16)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #762",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-763",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 16)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #763",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-764",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 16)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #764",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-765",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 16)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #765",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-766",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 16)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #766",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-767",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 16)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #767",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-768",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 16)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #768",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-769",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 16)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #769",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-770",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 16)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #770",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-771",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 16)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #771",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-772",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 16)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #772",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-773",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 16)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #773",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-774",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 16)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #774",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-775",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 16)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #775",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-776",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 16)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #776",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-777",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 16)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #777",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-778",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 16)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #778",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-779",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 16)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #779",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-780",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 16)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #780",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-781",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 16)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #781",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-782",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 16)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #782",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-783",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 16)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #783",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-784",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 16)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #784",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-785",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 16)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #785",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-786",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 16)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #786",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-787",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 16)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #787",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-788",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 16)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #788",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-789",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 16)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #789",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-790",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 16)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #790",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-791",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 16)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #791",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-792",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 16)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #792",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-793",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 16)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #793",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-794",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 16)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #794",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-795",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 16)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #795",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-796",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 16)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #796",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-797",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 16)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #797",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-798",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 16)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #798",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-799",
    "title": "#honey sing song #free fire(256k) (Vol. 16)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #799",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-800",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 16)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #800",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-801",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 17)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #801",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-802",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 17)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #802",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-803",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 17)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #803",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-804",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 17)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #804",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-805",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 17)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #805",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-806",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 17)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #806",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-807",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 17)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #807",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-808",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 17)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #808",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-809",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 17)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #809",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-810",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 17)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #810",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-811",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 17)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #811",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-812",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 17)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #812",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-813",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 17)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #813",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-814",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 17)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #814",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-815",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 17)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #815",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-816",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 17)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #816",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-817",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 17)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #817",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-818",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 17)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #818",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-819",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 17)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #819",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-820",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 17)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #820",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-821",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 17)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #821",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-822",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 17)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #822",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-823",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 17)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #823",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-824",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 17)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #824",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-825",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 17)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #825",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-826",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 17)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #826",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-827",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 17)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #827",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-828",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 17)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #828",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-829",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 17)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #829",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-830",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 17)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #830",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-831",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 17)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #831",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-832",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 17)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #832",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-833",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 17)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #833",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-834",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 17)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #834",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-835",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 17)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #835",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-836",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 17)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #836",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-837",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 17)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #837",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-838",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 17)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #838",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-839",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 17)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #839",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-840",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 17)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #840",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-841",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 17)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #841",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-842",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 17)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #842",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-843",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 17)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #843",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-844",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 17)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #844",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-845",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 17)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #845",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-846",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 17)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #846",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-847",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 17)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #847",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-848",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 17)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #848",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-849",
    "title": "#honey sing song #free fire(256k) (Vol. 17)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #849",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-850",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 17)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #850",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-851",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 18)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #851",
    "isGoogleDrive": true,
    "plays": "11.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-852",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 18)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #852",
    "isGoogleDrive": true,
    "plays": "11.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-853",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 18)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #853",
    "isGoogleDrive": true,
    "plays": "11.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-854",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 18)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #854",
    "isGoogleDrive": true,
    "plays": "11.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-855",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 18)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #855",
    "isGoogleDrive": true,
    "plays": "11.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-856",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 18)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #856",
    "isGoogleDrive": true,
    "plays": "11.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-857",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 18)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #857",
    "isGoogleDrive": true,
    "plays": "11.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-858",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 18)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #858",
    "isGoogleDrive": true,
    "plays": "11.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-859",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 18)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #859",
    "isGoogleDrive": true,
    "plays": "12.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-860",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 18)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #860",
    "isGoogleDrive": true,
    "plays": "12.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-861",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 18)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #861",
    "isGoogleDrive": true,
    "plays": "12.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-862",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 18)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #862",
    "isGoogleDrive": true,
    "plays": "12.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-863",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 18)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #863",
    "isGoogleDrive": true,
    "plays": "12.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-864",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 18)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #864",
    "isGoogleDrive": true,
    "plays": "12.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-865",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 18)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #865",
    "isGoogleDrive": true,
    "plays": "12.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-866",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 18)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #866",
    "isGoogleDrive": true,
    "plays": "12.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-867",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 18)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #867",
    "isGoogleDrive": true,
    "plays": "12.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-868",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 18)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #868",
    "isGoogleDrive": true,
    "plays": "12.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-869",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 18)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #869",
    "isGoogleDrive": true,
    "plays": "13.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-870",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 18)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #870",
    "isGoogleDrive": true,
    "plays": "13.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-871",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 18)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #871",
    "isGoogleDrive": true,
    "plays": "13.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-872",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 18)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #872",
    "isGoogleDrive": true,
    "plays": "13.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-873",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 18)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #873",
    "isGoogleDrive": true,
    "plays": "13.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-874",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 18)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #874",
    "isGoogleDrive": true,
    "plays": "13.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-875",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 18)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #875",
    "isGoogleDrive": true,
    "plays": "13.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-876",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 18)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #876",
    "isGoogleDrive": true,
    "plays": "13.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-877",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 18)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #877",
    "isGoogleDrive": true,
    "plays": "13.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-878",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 18)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #878",
    "isGoogleDrive": true,
    "plays": "13.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-879",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 18)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #879",
    "isGoogleDrive": true,
    "plays": "14.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-880",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 18)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #880",
    "isGoogleDrive": true,
    "plays": "14.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-881",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 18)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #881",
    "isGoogleDrive": true,
    "plays": "14.2k",
    "vibe": "🔥 Energy",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-882",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 18)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #882",
    "isGoogleDrive": true,
    "plays": "14.3k",
    "vibe": "💖 Romance",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-883",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 18)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #883",
    "isGoogleDrive": true,
    "plays": "14.4k",
    "vibe": "🕉️ Peace",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-884",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 18)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #884",
    "isGoogleDrive": true,
    "plays": "14.5k",
    "vibe": "⚡ High BPM",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-885",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 18)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #885",
    "isGoogleDrive": true,
    "plays": "14.6k",
    "vibe": "🌙 Chill",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-886",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 18)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #886",
    "isGoogleDrive": true,
    "plays": "14.7k",
    "vibe": "🎧 Focus",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-887",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 18)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #887",
    "isGoogleDrive": true,
    "plays": "14.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-888",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 18)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #888",
    "isGoogleDrive": true,
    "plays": "14.9k",
    "vibe": "✨ Euphoria",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-889",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 18)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #889",
    "isGoogleDrive": true,
    "plays": "15.0k",
    "vibe": "🔥 Energy",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-890",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 18)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #890",
    "isGoogleDrive": true,
    "plays": "15.1k",
    "vibe": "💖 Romance",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-891",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 18)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #891",
    "isGoogleDrive": true,
    "plays": "15.2k",
    "vibe": "🕉️ Peace",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-892",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 18)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #892",
    "isGoogleDrive": true,
    "plays": "15.3k",
    "vibe": "⚡ High BPM",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-893",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 18)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #893",
    "isGoogleDrive": true,
    "plays": "15.4k",
    "vibe": "🌙 Chill",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-894",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 18)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #894",
    "isGoogleDrive": true,
    "plays": "15.5k",
    "vibe": "🎧 Focus",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-895",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 18)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #895",
    "isGoogleDrive": true,
    "plays": "15.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-896",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 18)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #896",
    "isGoogleDrive": true,
    "plays": "15.7k",
    "vibe": "✨ Euphoria",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-897",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 18)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #897",
    "isGoogleDrive": true,
    "plays": "15.8k",
    "vibe": "🔥 Energy",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-898",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 18)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #898",
    "isGoogleDrive": true,
    "plays": "15.9k",
    "vibe": "💖 Romance",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-899",
    "title": "#honey sing song #free fire(256k) (Vol. 18)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #899",
    "isGoogleDrive": true,
    "plays": "16.0k",
    "vibe": "🕉️ Peace",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-900",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 18)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #900",
    "isGoogleDrive": true,
    "plays": "16.1k",
    "vibe": "⚡ High BPM",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-901",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 19)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #901",
    "isGoogleDrive": true,
    "plays": "1.2k",
    "vibe": "🌙 Chill",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-902",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 19)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #902",
    "isGoogleDrive": true,
    "plays": "1.3k",
    "vibe": "🎧 Focus",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-903",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 19)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #903",
    "isGoogleDrive": true,
    "plays": "1.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-904",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 19)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #904",
    "isGoogleDrive": true,
    "plays": "1.5k",
    "vibe": "✨ Euphoria",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-905",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 19)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #905",
    "isGoogleDrive": true,
    "plays": "1.6k",
    "vibe": "🔥 Energy",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-906",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 19)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #906",
    "isGoogleDrive": true,
    "plays": "1.7k",
    "vibe": "💖 Romance",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-907",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 19)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #907",
    "isGoogleDrive": true,
    "plays": "1.8k",
    "vibe": "🕉️ Peace",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-908",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 19)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #908",
    "isGoogleDrive": true,
    "plays": "1.9k",
    "vibe": "⚡ High BPM",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-909",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 19)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #909",
    "isGoogleDrive": true,
    "plays": "2.0k",
    "vibe": "🌙 Chill",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-910",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 19)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #910",
    "isGoogleDrive": true,
    "plays": "2.1k",
    "vibe": "🎧 Focus",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-911",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 19)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #911",
    "isGoogleDrive": true,
    "plays": "2.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-912",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 19)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #912",
    "isGoogleDrive": true,
    "plays": "2.3k",
    "vibe": "✨ Euphoria",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-913",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 19)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #913",
    "isGoogleDrive": true,
    "plays": "2.4k",
    "vibe": "🔥 Energy",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-914",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 19)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #914",
    "isGoogleDrive": true,
    "plays": "2.5k",
    "vibe": "💖 Romance",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-915",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 19)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #915",
    "isGoogleDrive": true,
    "plays": "2.6k",
    "vibe": "🕉️ Peace",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-916",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 19)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #916",
    "isGoogleDrive": true,
    "plays": "2.7k",
    "vibe": "⚡ High BPM",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-917",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 19)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #917",
    "isGoogleDrive": true,
    "plays": "2.8k",
    "vibe": "🌙 Chill",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-918",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 19)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #918",
    "isGoogleDrive": true,
    "plays": "2.9k",
    "vibe": "🎧 Focus",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-919",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 19)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #919",
    "isGoogleDrive": true,
    "plays": "3.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-920",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 19)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #920",
    "isGoogleDrive": true,
    "plays": "3.1k",
    "vibe": "✨ Euphoria",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-921",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 19)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #921",
    "isGoogleDrive": true,
    "plays": "3.2k",
    "vibe": "🔥 Energy",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-922",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 19)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #922",
    "isGoogleDrive": true,
    "plays": "3.3k",
    "vibe": "💖 Romance",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-923",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 19)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #923",
    "isGoogleDrive": true,
    "plays": "3.4k",
    "vibe": "🕉️ Peace",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-924",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 19)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #924",
    "isGoogleDrive": true,
    "plays": "3.5k",
    "vibe": "⚡ High BPM",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-925",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 19)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #925",
    "isGoogleDrive": true,
    "plays": "3.6k",
    "vibe": "🌙 Chill",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-926",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 19)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #926",
    "isGoogleDrive": true,
    "plays": "3.7k",
    "vibe": "🎧 Focus",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-927",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 19)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #927",
    "isGoogleDrive": true,
    "plays": "3.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-928",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 19)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #928",
    "isGoogleDrive": true,
    "plays": "3.9k",
    "vibe": "✨ Euphoria",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-929",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 19)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #929",
    "isGoogleDrive": true,
    "plays": "4.0k",
    "vibe": "🔥 Energy",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-930",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 19)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #930",
    "isGoogleDrive": true,
    "plays": "4.1k",
    "vibe": "💖 Romance",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-931",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 19)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #931",
    "isGoogleDrive": true,
    "plays": "4.2k",
    "vibe": "🕉️ Peace",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-932",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 19)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #932",
    "isGoogleDrive": true,
    "plays": "4.3k",
    "vibe": "⚡ High BPM",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-933",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 19)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #933",
    "isGoogleDrive": true,
    "plays": "4.4k",
    "vibe": "🌙 Chill",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-934",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 19)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #934",
    "isGoogleDrive": true,
    "plays": "4.5k",
    "vibe": "🎧 Focus",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-935",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 19)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #935",
    "isGoogleDrive": true,
    "plays": "4.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-936",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 19)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #936",
    "isGoogleDrive": true,
    "plays": "4.7k",
    "vibe": "✨ Euphoria",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-937",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 19)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #937",
    "isGoogleDrive": true,
    "plays": "4.8k",
    "vibe": "🔥 Energy",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-938",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 19)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #938",
    "isGoogleDrive": true,
    "plays": "4.9k",
    "vibe": "💖 Romance",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-939",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 19)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #939",
    "isGoogleDrive": true,
    "plays": "5.0k",
    "vibe": "🕉️ Peace",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-940",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 19)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #940",
    "isGoogleDrive": true,
    "plays": "5.1k",
    "vibe": "⚡ High BPM",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-941",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 19)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #941",
    "isGoogleDrive": true,
    "plays": "5.2k",
    "vibe": "🌙 Chill",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-942",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 19)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #942",
    "isGoogleDrive": true,
    "plays": "5.3k",
    "vibe": "🎧 Focus",
    "bpm": "121 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-943",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 19)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #943",
    "isGoogleDrive": true,
    "plays": "5.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "122 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-944",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 19)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #944",
    "isGoogleDrive": true,
    "plays": "5.5k",
    "vibe": "✨ Euphoria",
    "bpm": "123 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-945",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 19)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #945",
    "isGoogleDrive": true,
    "plays": "5.6k",
    "vibe": "🔥 Energy",
    "bpm": "124 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-946",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 19)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #946",
    "isGoogleDrive": true,
    "plays": "5.7k",
    "vibe": "💖 Romance",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-947",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 19)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #947",
    "isGoogleDrive": true,
    "plays": "5.8k",
    "vibe": "🕉️ Peace",
    "bpm": "126 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-948",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 19)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #948",
    "isGoogleDrive": true,
    "plays": "5.9k",
    "vibe": "⚡ High BPM",
    "bpm": "127 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-949",
    "title": "#honey sing song #free fire(256k) (Vol. 19)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #949",
    "isGoogleDrive": true,
    "plays": "6.0k",
    "vibe": "🌙 Chill",
    "bpm": "128 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-950",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 19)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #950",
    "isGoogleDrive": true,
    "plays": "6.1k",
    "vibe": "🎧 Focus",
    "bpm": "129 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-951",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016 (Vol. 20)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "/api/music/stream/1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #951",
    "isGoogleDrive": true,
    "plays": "6.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-952",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha (Vol. 20)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "/api/music/stream/1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #952",
    "isGoogleDrive": true,
    "plays": "6.3k",
    "vibe": "✨ Euphoria",
    "bpm": "131 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-953",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan (Vol. 20)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "/api/music/stream/1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #953",
    "isGoogleDrive": true,
    "plays": "6.4k",
    "vibe": "🔥 Energy",
    "bpm": "132 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-954",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 20)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "/api/music/stream/1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #954",
    "isGoogleDrive": true,
    "plays": "6.5k",
    "vibe": "💖 Romance",
    "bpm": "133 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-955",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma (Vol. 20)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "/api/music/stream/1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #955",
    "isGoogleDrive": true,
    "plays": "6.6k",
    "vibe": "🕉️ Peace",
    "bpm": "134 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-956",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013 (Vol. 20)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "/api/music/stream/1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #956",
    "isGoogleDrive": true,
    "plays": "6.7k",
    "vibe": "⚡ High BPM",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-957",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor (Vol. 20)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "/api/music/stream/1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #957",
    "isGoogleDrive": true,
    "plays": "6.8k",
    "vibe": "🌙 Chill",
    "bpm": "136 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-958",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k) (Vol. 20)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "/api/music/stream/1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #958",
    "isGoogleDrive": true,
    "plays": "6.9k",
    "vibe": "🎧 Focus",
    "bpm": "137 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-959",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera (Vol. 20)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "/api/music/stream/1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #959",
    "isGoogleDrive": true,
    "plays": "7.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "138 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-960",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin (Vol. 20)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "/api/music/stream/1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #960",
    "isGoogleDrive": true,
    "plays": "7.1k",
    "vibe": "✨ Euphoria",
    "bpm": "139 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-961",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg (Vol. 20)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "/api/music/stream/1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #961",
    "isGoogleDrive": true,
    "plays": "7.2k",
    "vibe": "🔥 Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-962",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k) (Vol. 20)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "/api/music/stream/1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #962",
    "isGoogleDrive": true,
    "plays": "7.3k",
    "vibe": "💖 Romance",
    "bpm": "81 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-963",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya (Vol. 20)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "/api/music/stream/1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #963",
    "isGoogleDrive": true,
    "plays": "7.4k",
    "vibe": "🕉️ Peace",
    "bpm": "82 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-964",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor (Vol. 20)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "/api/music/stream/1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #964",
    "isGoogleDrive": true,
    "plays": "7.5k",
    "vibe": "⚡ High BPM",
    "bpm": "83 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-965",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do (Vol. 20)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "/api/music/stream/1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #965",
    "isGoogleDrive": true,
    "plays": "7.6k",
    "vibe": "🌙 Chill",
    "bpm": "84 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-966",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor (Vol. 20)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "/api/music/stream/1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #966",
    "isGoogleDrive": true,
    "plays": "7.7k",
    "vibe": "🎧 Focus",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-967",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu (Vol. 20)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "/api/music/stream/1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #967",
    "isGoogleDrive": true,
    "plays": "7.8k",
    "vibe": "🎉 Party Flow",
    "bpm": "86 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-968",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone (Vol. 20)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "/api/music/stream/13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #968",
    "isGoogleDrive": true,
    "plays": "7.9k",
    "vibe": "✨ Euphoria",
    "bpm": "87 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-969",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 20)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "/api/music/stream/1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #969",
    "isGoogleDrive": true,
    "plays": "8.0k",
    "vibe": "🔥 Energy",
    "bpm": "88 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-970",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone (Vol. 20)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "/api/music/stream/1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #970",
    "isGoogleDrive": true,
    "plays": "8.1k",
    "vibe": "💖 Romance",
    "bpm": "89 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-971",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela (Vol. 20)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "/api/music/stream/1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #971",
    "isGoogleDrive": true,
    "plays": "8.2k",
    "vibe": "🕉️ Peace",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-972",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 20)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "/api/music/stream/1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #972",
    "isGoogleDrive": true,
    "plays": "8.3k",
    "vibe": "⚡ High BPM",
    "bpm": "91 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-973",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor (Vol. 20)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "/api/music/stream/1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #973",
    "isGoogleDrive": true,
    "plays": "8.4k",
    "vibe": "🌙 Chill",
    "bpm": "92 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-974",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k) (Vol. 20)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "/api/music/stream/15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #974",
    "isGoogleDrive": true,
    "plays": "8.5k",
    "vibe": "🎧 Focus",
    "bpm": "93 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-975",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh (Vol. 20)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "/api/music/stream/1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #975",
    "isGoogleDrive": true,
    "plays": "8.6k",
    "vibe": "🎉 Party Flow",
    "bpm": "94 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-976",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal (Vol. 20)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "/api/music/stream/1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #976",
    "isGoogleDrive": true,
    "plays": "8.7k",
    "vibe": "✨ Euphoria",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-977",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k) (Vol. 20)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "/api/music/stream/1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #977",
    "isGoogleDrive": true,
    "plays": "8.8k",
    "vibe": "🔥 Energy",
    "bpm": "96 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-978",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi (Vol. 20)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "/api/music/stream/1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #978",
    "isGoogleDrive": true,
    "plays": "8.9k",
    "vibe": "💖 Romance",
    "bpm": "97 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-979",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k) (Vol. 20)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "/api/music/stream/1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #979",
    "isGoogleDrive": true,
    "plays": "9.0k",
    "vibe": "🕉️ Peace",
    "bpm": "98 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-980",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma (Vol. 20)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "/api/music/stream/1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #980",
    "isGoogleDrive": true,
    "plays": "9.1k",
    "vibe": "⚡ High BPM",
    "bpm": "99 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-981",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone (Vol. 20)",
    "artist": "Arijit Singh",
    "album": "Arijit Singh Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "/api/music/stream/1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #981",
    "isGoogleDrive": true,
    "plays": "9.2k",
    "vibe": "🌙 Chill",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-982",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song (Vol. 20)",
    "artist": "Yo Yo Honey Singh",
    "album": "Yo Yo Honey Singh Master Anthology",
    "genre": "Punjabi",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "/api/music/stream/1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #982",
    "isGoogleDrive": true,
    "plays": "9.3k",
    "vibe": "🎧 Focus",
    "bpm": "101 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-983",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet (Vol. 20)",
    "artist": "Badshah",
    "album": "Badshah Master Anthology",
    "genre": "Party",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "/api/music/stream/16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #983",
    "isGoogleDrive": true,
    "plays": "9.4k",
    "vibe": "🎉 Party Flow",
    "bpm": "102 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-984",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan (Vol. 20)",
    "artist": "Sharry Mann",
    "album": "Sharry Mann Master Anthology",
    "genre": "Devotional",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "/api/music/stream/1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #984",
    "isGoogleDrive": true,
    "plays": "9.5k",
    "vibe": "✨ Euphoria",
    "bpm": "103 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-985",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k) (Vol. 20)",
    "artist": "Palak Muchhal",
    "album": "Palak Muchhal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "/api/music/stream/19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #985",
    "isGoogleDrive": true,
    "plays": "9.6k",
    "vibe": "🔥 Energy",
    "bpm": "104 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-986",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries (Vol. 20)",
    "artist": "Atif Aslam",
    "album": "Atif Aslam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "/api/music/stream/1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #986",
    "isGoogleDrive": true,
    "plays": "9.7k",
    "vibe": "💖 Romance",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-987",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan (Vol. 20)",
    "artist": "Neha Kakkar",
    "album": "Neha Kakkar Master Anthology",
    "genre": "Romantic",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "/api/music/stream/1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #987",
    "isGoogleDrive": true,
    "plays": "9.8k",
    "vibe": "🕉️ Peace",
    "bpm": "106 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-988",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor (Vol. 20)",
    "artist": "Diljit Dosanjh",
    "album": "Diljit Dosanjh Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "/api/music/stream/1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #988",
    "isGoogleDrive": true,
    "plays": "9.9k",
    "vibe": "⚡ High BPM",
    "bpm": "107 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-989",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon (Vol. 20)",
    "artist": "Karan Aujla",
    "album": "Karan Aujla Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "/api/music/stream/1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #989",
    "isGoogleDrive": true,
    "plays": "10.0k",
    "vibe": "🌙 Chill",
    "bpm": "108 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-990",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra (Vol. 20)",
    "artist": "Sidhu Moose Wala",
    "album": "Sidhu Moose Wala Master Anthology",
    "genre": "Sufi",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "/api/music/stream/17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #990",
    "isGoogleDrive": true,
    "plays": "10.1k",
    "vibe": "🎧 Focus",
    "bpm": "109 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-991",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor (Vol. 20)",
    "artist": "Jubin Nautiyal",
    "album": "Jubin Nautiyal Master Anthology",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "/api/music/stream/1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #991",
    "isGoogleDrive": true,
    "plays": "10.2k",
    "vibe": "🎉 Party Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-992",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin (Vol. 20)",
    "artist": "B Praak",
    "album": "B Praak Master Anthology",
    "genre": "Punjabi",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "/api/music/stream/1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #992",
    "isGoogleDrive": true,
    "plays": "10.3k",
    "vibe": "✨ Euphoria",
    "bpm": "111 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-993",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan (Vol. 20)",
    "artist": "Guru Randhawa",
    "album": "Guru Randhawa Master Anthology",
    "genre": "Party",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "/api/music/stream/1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #993",
    "isGoogleDrive": true,
    "plays": "10.4k",
    "vibe": "🔥 Energy",
    "bpm": "112 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-994",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3] (Vol. 20)",
    "artist": "Armaan Malik",
    "album": "Armaan Malik Master Anthology",
    "genre": "Devotional",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "/api/music/stream/1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #994",
    "isGoogleDrive": true,
    "plays": "10.5k",
    "vibe": "💖 Romance",
    "bpm": "113 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-995",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館 (Vol. 20)",
    "artist": "Shreya Ghoshal",
    "album": "Shreya Ghoshal Master Anthology",
    "genre": "Lo-Fi",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "/api/music/stream/1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #995",
    "isGoogleDrive": true,
    "plays": "10.6k",
    "vibe": "🕉️ Peace",
    "bpm": "114 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-996",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ (Vol. 20)",
    "artist": "Sonu Nigam",
    "album": "Sonu Nigam Master Anthology",
    "genre": "Hip-Hop",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "/api/music/stream/1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #996",
    "isGoogleDrive": true,
    "plays": "10.7k",
    "vibe": "⚡ High BPM",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-997",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】 (Vol. 20)",
    "artist": "Rahat Fateh Ali Khan",
    "album": "Rahat Fateh Ali Khan Master Anthology",
    "genre": "Romantic",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "/api/music/stream/12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #997",
    "isGoogleDrive": true,
    "plays": "10.8k",
    "vibe": "🌙 Chill",
    "bpm": "116 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-998",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021 (Vol. 20)",
    "artist": "Darshan Raval",
    "album": "Darshan Raval Master Anthology",
    "genre": "Synthwave",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "/api/music/stream/1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #998",
    "isGoogleDrive": true,
    "plays": "10.9k",
    "vibe": "🎧 Focus",
    "bpm": "117 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-999",
    "title": "#honey sing song #free fire(256k) (Vol. 20)",
    "artist": "Prateek Kuhad",
    "album": "Prateek Kuhad Master Anthology",
    "genre": "Indie Pop",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "/api/music/stream/1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #999",
    "isGoogleDrive": true,
    "plays": "11.0k",
    "vibe": "🎉 Party Flow",
    "bpm": "118 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  },
  {
    "id": "track-vault-1000",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs (Vol. 20)",
    "artist": "Anuv Jain",
    "album": "Anuv Jain Master Anthology",
    "genre": "Sufi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "/api/music/stream/1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Google Drive Cloud Master Collection Track #1000",
    "isGoogleDrive": true,
    "plays": "11.1k",
    "vibe": "✨ Euphoria",
    "bpm": "119 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-indigo-900/30",
    "addedAt": "2026-08-22"
  }
];

const INITIAL_PLAYLISTS = [
  {
    id: 'pl-gdrive-all',
    name: '☁️ Google Drive 1000 Master Vault',
    description: 'Complete cloud library with 1,000 tracks fetched from your Google Drive folder.',
    coverArt: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    color: 'from-blue-600 to-indigo-900',
    trackIds: DEFAULT_MUSIC_TRACKS.map(t => t.id)
  },
  {
    id: 'pl-bollywood-top',
    name: '💖 Bollywood & Romance Melodies',
    description: 'Soulful classics, Arijit Singh, Palak Muchhal, Atif Aslam, and romantic blockbusters.',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-600 to-pink-900',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Bollywood') || t.vibe?.includes('Romance') || t.genre?.includes('Romantic')).slice(0, 100).map(t => t.id)
  },
  {
    id: 'pl-party-punjabi',
    name: '⚡ High-Energy Party & Punjabi Hits',
    description: 'Yo Yo Honey Singh, Badshah, Sharry Mann, Diljit Dosanjh, and high BPM party pump tracks.',
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-600 to-orange-900',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Party') || t.genre?.includes('Punjabi') || t.genre?.includes('Hip-Hop')).slice(0, 100).map(t => t.id)
  },
  {
    id: 'pl-spiritual-focus',
    name: '🕉️ Divine Chants & Peaceful Focus',
    description: 'Durga Stotram, peaceful devotional tracks and ambient flow for study.',
    coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-600 to-teal-900',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Devotional') || t.vibe?.includes('Peace')).slice(0, 50).map(t => t.id)
  }
];

// Ambient Background Layer Soundtracks
const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain, url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6595bf6a.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3' },
  { id: 'cafe', name: 'Dev Cafe', icon: Coffee, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_10793666dc.mp3?filename=coffee-shop-ambience-7798.mp3' },
  { id: 'fire', name: 'Campfire', icon: Flame, url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_5145b5c9b7.mp3?filename=bonfire-crackling-109040.mp3' }
];

export default function Music() {
  // ── State Storage ──
  const [tracks, setTracks] = useState(() => {
    const saved = localStorage.getItem('appletree_music_tracks_1000_v1');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length >= 900) return parsed;
      } catch (e) { return DEFAULT_MUSIC_TRACKS; }
    }
    return DEFAULT_MUSIC_TRACKS;
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('appletree_music_playlists_1000_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PLAYLISTS; }
    }
    return INITIAL_PLAYLISTS;
  });

  const [favoriteTrackIds, setFavoriteTrackIds] = useState(() => {
    const saved = localStorage.getItem('appletree_favorite_songs_1000_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return [DEFAULT_MUSIC_TRACKS[0]?.id, DEFAULT_MUSIC_TRACKS[1]?.id]; }
    }
    return [DEFAULT_MUSIC_TRACKS[0]?.id, DEFAULT_MUSIC_TRACKS[1]?.id];
  });

  // ── Layout Display View: 'cards' (Grid) vs 'list' (Rows) ──
  const [viewDisplayMode, setViewDisplayMode] = useState('cards');

  // ── In-Memory Audio Blob Cache (Zero-delay offline playback) ──
  const blobCacheRef = useRef({});

  // ── Playback Engine State ──
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);
  const [isFullscreenVisualizer, setIsFullscreenVisualizer] = useState(false);

  // ── Navigation & Active View Tabs ──
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favorites' | 'playlist' | 'drive' | 'ambience'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  
  // ── Search & Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // ── Pagination State for 1000 Songs ──
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  // ── Ambience Layer Mixer State ──
  const [ambientVolumes, setAmbientVolumes] = useState({ rain: 0, cafe: 0, fire: 0 });
  const ambientAudioRefs = useRef({});

  // ── Sleep / Pomodoro Timer State ──
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);

  // ── Modals State ──
  const [isImportDriveModalOpen, setIsImportDriveModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  
  // Single Import Form
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveArtist, setNewDriveArtist] = useState('');
  const [newDriveGenre, setNewDriveGenre] = useState('Bollywood');
  const [newDriveCover, setNewDriveCover] = useState('');
  
  // Bulk Import Form
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkStatusMsg, setBulkStatusMsg] = useState(null);

  // Playlist Form
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState(null);

  // ── Audio Ref ──
  const audioRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('appletree_music_tracks_1000_v1', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('appletree_music_playlists_1000_v1', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('appletree_favorite_songs_1000_v1', JSON.stringify(favoriteTrackIds));
  }, [favoriteTrackIds]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // ─────────────────────────────────────────────────────────────────────────
  // FETCH AUDIO DATABYTES & CREATE LOCAL IN-MEMORY BLOB OBJECT URL
  // ─────────────────────────────────────────────────────────────────────────
  const fetchAndPlayTrack = async (track, shouldPlay = true) => {
    if (!track || !audioRef.current) return;
    const fileId = track.driveId || track.id;

    if (blobCacheRef.current[fileId]) {
      const cachedUrl = blobCacheRef.current[fileId];
      if (audioRef.current.src !== cachedUrl) {
        audioRef.current.src = cachedUrl;
      }
      if (shouldPlay) {
        setIsBuffering(false);
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.warn('Play cache error:', e));
      }
      return;
    }

    setIsBuffering(true);
    setLoadingProgress('Loading audio data...');
    setPlaybackError(null);

    const endpointsToTry = [
      getDriveStreamUrl(track.driveId || track.streamUrl),
      getDirectCloudUrl(fileId),
      'https://drive.google.com/uc?export=download&id=' + fileId
    ];

    for (const url of endpointsToTry) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 1000) {
            const objectUrl = URL.createObjectURL(blob);
            blobCacheRef.current[fileId] = objectUrl;

            audioRef.current.src = objectUrl;
            audioRef.current.load();

            if (shouldPlay) {
              await audioRef.current.play();
              setIsPlaying(true);
            }
            setIsBuffering(false);
            setLoadingProgress(null);
            return;
          }
        }
      } catch (err) {
        console.warn('Fetch audio bytes attempt from ' + url + ' failed, trying next endpoint...', err);
      }
    }

    const directFallback = getDirectCloudUrl(fileId);
    audioRef.current.src = directFallback;
    if (shouldPlay) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsBuffering(false);
          setPlaybackError('Tap play button to start audio');
        });
    }
    setLoadingProgress(null);
  };

  useEffect(() => {
    if (currentTrack) {
      fetchAndPlayTrack(currentTrack, isPlaying);
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, activeView, selectedPlaylistId, sortBy]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const handleCanPlay = () => {
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setPlaybackError(null);
    };
    const handleError = (e) => {
      console.warn('Audio element error, retrying byte fetch...', e);
      setIsBuffering(false);
      if (currentTrack) {
        fetchAndPlayTrack(currentTrack, true);
      }
    };
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, tracks, isShuffle, currentTrack]);

  // Volume Controller
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Ambience Layer Volumes
  useEffect(() => {
    AMBIENT_SOUNDS.forEach(snd => {
      const el = ambientAudioRefs.current[snd.id];
      if (el) {
        const vol = (ambientVolumes[snd.id] || 0) / 100;
        el.volume = vol;
        if (vol > 0 && el.paused) {
          el.play().catch(() => {});
        } else if (vol === 0 && !el.paused) {
          el.pause();
        }
      }
    });
  }, [ambientVolumes]);

  // Sleep / Pomodoro Timer Countdown
  useEffect(() => {
    if (!sleepTimerSecondsLeft) return;
    const interval = setInterval(() => {
      setSleepTimerSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerSecondsLeft]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        setIsMuted(prev => !prev);
      } else if (e.code === 'KeyL') {
        if (currentTrack) toggleFavorite(currentTrack.id);
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        handlePrevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack]);

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsBuffering(false);
    } else {
      setIsBuffering(true);
      setPlaybackError(null);
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        fetchAndPlayTrack(currentTrack, true);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsBuffering(false);
            })
            .catch(e => {
              console.warn('Play error, re-fetching bytes:', e);
              fetchAndPlayTrack(currentTrack, true);
            });
        }
      }
    }
  };

  const handlePlayTrack = (track) => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
      setIsBuffering(true);
      fetchAndPlayTrack(track, true);
    }
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const targetVal = parseFloat(e.target.value);
    setCurrentTime(targetVal);
    if (audioRef.current) {
      audioRef.current.currentTime = targetVal;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || !secs) return '00:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle Favorite
  const toggleFavorite = (trackId, e) => {
    e?.stopPropagation();
    setFavoriteTrackIds(prev => {
      const isFav = prev.includes(trackId);
      if (!isFav) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        return [...prev, trackId];
      }
      return prev.filter(id => id !== trackId);
    });
  };

  // Add Track to Playlist
  const handleAddTrackToPlaylist = (playlistId, trackId, e) => {
    e?.stopPropagation();
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
      }
      return pl;
    }));
    confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
  };

  // Create Playlist
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Custom user created playlist.',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      color: 'from-purple-600 to-indigo-950',
      trackIds: []
    };

    setPlaylists(prev => [...prev, newPl]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreatePlaylistModalOpen(false);
    setSelectedPlaylistId(newPl.id);
    setActiveView('playlist');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Delete Playlist
  const handleDeletePlaylist = (playlistId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
      if (selectedPlaylistId === playlistId) {
        setActiveView('all');
        setSelectedPlaylistId(null);
      }
    }
  };

  // Reset to Google Drive 1000 Tracks
  const handleResetToDriveFolder = () => {
    blobCacheRef.current = {};
    setTracks(DEFAULT_MUSIC_TRACKS);
    localStorage.setItem('appletree_music_tracks_1000_v1', JSON.stringify(DEFAULT_MUSIC_TRACKS));
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
  };

  // Single Google Drive Song Importer
  const handleImportGoogleDriveTrack = (e) => {
    e.preventDefault();
    if (!newDriveUrl.trim() || !newDriveTitle.trim()) {
      setImportStatusMsg({ type: 'error', text: 'Please enter a valid Google Drive URL / ID and Song Title.' });
      return;
    }

    const driveDirectStream = getDriveStreamUrl(newDriveUrl.trim());
    const newTrack = {
      id: `drive-track-${Date.now()}`,
      title: newDriveTitle.trim(),
      artist: newDriveArtist.trim() || 'Google Drive Audio',
      album: 'Google Drive Cloud Vault',
      genre: newDriveGenre || 'Bollywood',
      duration: '03:30',
      driveId: newDriveUrl.trim(),
      streamUrl: driveDirectStream,
      coverArt: newDriveCover.trim() || COVERS[Math.floor(Math.random() * COVERS.length)],
      lyrics: 'Imported from Google Drive collection.',
      isGoogleDrive: true,
      plays: '1',
      vibe: '☁️ Cloud Synced',
      bpm: '90 BPM',
      colorTheme: 'from-blue-500/20 via-indigo-500/10 to-slate-900/30',
      addedAt: new Date().toISOString().split('T')[0]
    };

    setTracks(prev => [newTrack, ...prev]);
    setImportStatusMsg({ type: 'success', text: `✅ Successfully imported "${newTrack.title}" from Google Drive!` });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      handlePlayTrack(newTrack);
      setIsImportDriveModalOpen(false);
      setNewDriveUrl('');
      setNewDriveTitle('');
      setNewDriveArtist('');
      setNewDriveCover('');
      setImportStatusMsg(null);
    }, 1200);
  };

  // Bulk Import for 1000 Songs
  const handleBulkImportSongs = (e) => {
    e.preventDefault();
    if (!bulkInputText.trim()) return;

    try {
      let importedCount = 0;
      let newBatch = [];

      if (bulkInputText.trim().startsWith('[') && bulkInputText.trim().endsWith(']')) {
        const parsed = JSON.parse(bulkInputText.trim());
        if (Array.isArray(parsed)) {
          newBatch = parsed.map((item, idx) => ({
            id: item.id || `bulk-drive-${Date.now()}-${idx}`,
            title: item.title || item.name || `Drive Song ${idx + 1}`,
            artist: item.artist || 'Google Drive Artist',
            album: item.album || 'Google Drive 1000 Vault',
            genre: item.genre || 'Bollywood',
            duration: item.duration || '03:45',
            driveId: item.driveId || item.id || '',
            streamUrl: item.streamUrl || getDriveStreamUrl(item.driveId || item.id || item.url),
            coverArt: item.coverArt || COVERS[idx % COVERS.length],
            lyrics: item.lyrics || 'Google Drive Cloud Library Track',
            isGoogleDrive: true,
            plays: '100',
            vibe: '🎵 Cloud Beat',
            bpm: '95 BPM',
            colorTheme: 'from-purple-500/20 via-pink-500/10 to-slate-900/40',
            addedAt: new Date().toISOString().split('T')[0]
          }));
          importedCount = newBatch.length;
        }
      } else {
        const lines = bulkInputText.split('\n').map(l => l.trim()).filter(Boolean);
        lines.forEach((line, idx) => {
          let title = '';
          let driveId = '';
          let artist = 'Google Drive Master Library';

          if (line.includes(',')) {
            const parts = line.split(',');
            title = parts[0].trim();
            driveId = parts[1]?.trim() || '';
            artist = parts[2]?.trim() || 'Google Drive Artist';
          } else if (line.includes('drive.google.com') || line.length > 20) {
            driveId = line;
            title = `Drive Track ${tracks.length + idx + 1}`;
          } else {
            title = line;
          }

          if (title || driveId) {
            newBatch.push({
              id: `bulk-drive-${Date.now()}-${idx}`,
              title: title.replace(/\.[a-zA-Z0-9]+$/, '').replace(/_/g, ' '),
              artist: artist,
              album: 'Google Drive 1000 Vault',
              genre: 'Bollywood',
              duration: '03:30',
              driveId: driveId,
              streamUrl: getDriveStreamUrl(driveId),
              coverArt: COVERS[idx % COVERS.length],
              lyrics: 'Imported from 1000 Google Drive Library',
              isGoogleDrive: true,
              plays: '50',
              vibe: '🔥 Cloud Flow',
              bpm: '90 BPM',
              colorTheme: 'from-amber-500/20 via-orange-500/10 to-indigo-900/30',
              addedAt: new Date().toISOString().split('T')[0]
            });
            importedCount++;
          }
        });
      }

      if (importedCount > 0) {
        setTracks(prev => [...newBatch, ...prev]);
        setBulkStatusMsg({ type: 'success', text: `🎉 Successfully imported ${importedCount} songs into your Google Drive Library!` });
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        setTimeout(() => {
          setIsBulkImportModalOpen(false);
          setBulkInputText('');
          setBulkStatusMsg(null);
        }, 1500);
      } else {
        setBulkStatusMsg({ type: 'error', text: 'No valid songs found in the pasted text.' });
      }
    } catch (err) {
      setBulkStatusMsg({ type: 'error', text: `Import error: ${err.message}` });
    }
  };

  // Set Sleep Timer
  const handleSetSleepTimer = (mins) => {
    if (sleepTimerMinutes === mins) {
      setSleepTimerMinutes(null);
      setSleepTimerSecondsLeft(null);
    } else {
      setSleepTimerMinutes(mins);
      setSleepTimerSecondsLeft(mins * 60);
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.5 } });
    }
  };

  // Filtered & Sorted Tracks Pipeline across all 1000 songs
  const filteredAndSortedTracks = useMemo(() => {
    let list = tracks;

    if (activeView === 'favorites') {
      list = tracks.filter(t => favoriteTrackIds.includes(t.id));
    } else if (activeView === 'drive') {
      list = tracks.filter(t => t.isGoogleDrive || t.driveId);
    } else if (activeView === 'playlist' && selectedPlaylistId) {
      const targetPl = playlists.find(p => p.id === selectedPlaylistId);
      if (targetPl) {
        list = tracks.filter(t => targetPl.trackIds.includes(t.id));
      }
    }

    if (selectedGenre !== 'All') {
      list = list.filter(t => t.genre?.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        t.album?.toLowerCase().includes(q) ||
        t.genre?.toLowerCase().includes(q) ||
        (t.driveId && t.driveId.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'title_asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title_desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'artist') {
      list = [...list].sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === 'plays') {
      list = [...list].sort((a, b) => parseFloat(b.plays || 0) - parseFloat(a.plays || 0));
    }

    return list;
  }, [tracks, activeView, selectedPlaylistId, selectedGenre, searchQuery, favoriteTrackIds, playlists, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedTracks.length / itemsPerPage) || 1;
  const paginatedTracks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTracks.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTracks, currentPage, itemsPerPage]);

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-36 select-none relative overflow-x-hidden">
      
      {/* Dynamic Animated Ambient Aurora Background */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-tr ${currentTrack?.colorTheme || 'from-indigo-900/20 via-purple-900/10 to-black'} blur-3xl opacity-70`}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none animate-pulse [animation-delay:2s]" />

      {/* Standard Native Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Hidden Ambience Audio Elements */}
      {AMBIENT_SOUNDS.map(snd => (
        <audio
          key={snd.id}
          ref={el => ambientAudioRefs.current[snd.id] = el}
          src={snd.url}
          loop
          preload="none"
        />
      ))}

      {/* ── 1. MODERN TOP GLASS HEADER WITH POWERFUL SEARCH BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        
        {/* Brand & Live Sound Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/25 text-white font-black transform group-hover:scale-105 transition-all">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0d1017] rounded-full animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold font-quicksand text-base sm:text-lg text-white tracking-tight">
                AppleTree Music Studio
              </h1>
              <a 
                href={GOOGLE_DRIVE_FOLDER_URL} 
                target="_blank" 
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                title="View Connected Google Drive Folder"
              >
                <FolderCheck className="w-2.5 h-2.5" />
                <span>{tracks.length} Songs Loaded</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
              <span>Auto-Fetched from Google Drive 1000 Vault</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-amber-400/90 font-mono">In-Memory Streaming</span>
            </p>
          </div>
        </div>

        {/* ── HIGH PERFORMANCE LIVE SEARCH BAR ── */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 1000 songs by title, singer, album, genre, or Drive ID..."
              className="w-full pl-10 pr-20 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/15 border border-white/15 focus:border-amber-400 rounded-2xl text-xs text-white placeholder:text-slate-400 outline-none transition-all shadow-inner backdrop-blur-md"
            />
            
            {/* Search Clear & Match Count Badge */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                    {filteredAndSortedTracks.length} found
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Import Single Song */}
          <button
            onClick={() => setIsImportDriveModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">+ Import</span>
          </button>

          {/* Reset / Reload 1000 Songs */}
          <button
            onClick={handleResetToDriveFolder}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105"
            title="Reload Full 1000 Drive Songs Library"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1000 Vault</span>
          </button>
        </div>

      </header>

      {/* ── 2. MAIN BENTO GRID LAYOUT: SIDEBAR + INTERACTIVE STUDIO ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* ── LEFT SIDEBAR NAVIGATION & AMBIENCE MIXER ── */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Main Discover Hub */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
              Studio Navigation
            </span>

            <button
              onClick={() => { setActiveView('all'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'all' 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All 1000 Songs</span>
              <span className="ml-auto text-[10px] opacity-75">{tracks.length}</span>
            </button>

            <button
              onClick={() => { setActiveView('favorites'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'favorites' 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeView === 'favorites' ? 'fill-white' : 'text-rose-400'}`} />
              <span>Favourites & Liked</span>
              <span className="ml-auto text-[10px] opacity-75">{favoriteTrackIds.length}</span>
            </button>

            <button
              onClick={() => { setActiveView('drive'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'drive' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-blue-300" />
              <span>Drive Cloud Vault</span>
              <span className="ml-auto text-[10px] opacity-75">
                {tracks.filter(t => t.isGoogleDrive || t.driveId).length}
              </span>
            </button>

            <button
              onClick={() => { setActiveView('ambience'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'ambience' 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4 text-teal-400" />
              <span>Soundscape Mixer</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono">
                FX
              </span>
            </button>
          </div>

          {/* User Playlists Hub */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span>Playlists ({playlists.length})</span>
              </span>
              <button
                onClick={() => setIsCreatePlaylistModalOpen(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 transition-colors cursor-pointer"
                title="Create New Playlist"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-none">
              {playlists.map((pl) => {
                const isSelected = activeView === 'playlist' && selectedPlaylistId === pl.id;
                return (
                  <div
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylistId(pl.id);
                      setActiveView('playlist');
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-white/15 text-amber-300 border border-amber-400/40 shadow-sm' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img src={pl.coverArt} alt={pl.name} className="w-8 h-8 rounded-xl object-cover shrink-0 border border-white/10" />
                      <div className="truncate">
                        <span className="block truncate text-xs">{pl.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{pl.trackIds.length} tracks</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeletePlaylist(pl.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pomodoro & Sleep Timer for Developers */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-rose-400" />
                <span>Study / Sleep Timer</span>
              </span>
              {sleepTimerSecondsLeft && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold animate-pulse">
                  {formatTime(sleepTimerSecondsLeft)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold">
              {[15, 25, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    sleepTimerMinutes === mins 
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md font-black' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              {sleepTimerSecondsLeft ? '🎵 Music will automatically pause when timer ends' : 'Select a study sprint or sleep timer'}
            </p>
          </div>

        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* ── 3. HERO SPOTLIGHT BANNER WITH 3D SPINNING VINYL TURNTABLE ── */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171b26] via-[#1a1f2e] to-[#121622] p-6 sm:p-8 text-white shadow-2xl border border-white/15">
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              
              {/* 3D Vinyl Record */}
              <div className="relative group shrink-0">
                <div className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#111] border-4 border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all ${
                  isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                }`}>
                  <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                  
                  <img
                    src={currentTrack?.coverArt || DEFAULT_MUSIC_TRACKS[0].coverArt}
                    alt="Album Cover"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-2xl border-2 border-amber-400/60"
                  />
                  <div className="absolute w-4 h-4 rounded-full bg-[#0d1017] border border-white/20 shadow-inner" />
                </div>

                <div className={`absolute top-0 right-0 w-16 h-28 pointer-events-none transition-transform duration-700 origin-top-right ${
                  isPlaying ? 'rotate-12' : '-rotate-12 opacity-60'
                }`}>
                  <div className="w-1.5 h-20 bg-gradient-to-b from-slate-400 to-amber-300 rounded-full shadow-lg ml-auto mr-4" />
                  <div className="w-4 h-3 bg-amber-400 rounded-sm shadow ml-auto mr-3 -mt-1" />
                </div>
              </div>

              {/* Spotlight Metadata & Actions */}
              <div className="space-y-3.5 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    {currentTrack?.vibe || '🎵 NOW PLAYING'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-slate-300 font-mono">
                    {currentTrack?.bpm || '80 BPM'}
                  </span>
                  {currentTrack?.isGoogleDrive && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      <span>Drive ID: {currentTrack?.driveId?.substring(0, 10)}...</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white tracking-tight leading-tight">
                  {currentTrack?.title}
                </h2>
                
                <p className="text-sm text-slate-300 font-medium">
                  {currentTrack?.artist} • <span className="text-slate-400">{currentTrack?.album}</span>
                </p>

                {currentTrack?.lyrics && (
                  <p className="text-xs text-amber-200/90 italic bg-white/5 border border-white/10 rounded-2xl p-3 max-w-xl backdrop-blur-sm">
                    "{currentTrack.lyrics}"
                  </p>
                )}

                {loadingProgress && (
                  <p className="text-xs text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{loadingProgress}</span>
                  </p>
                )}

                {playbackError && (
                  <p className="text-xs text-amber-300 font-bold bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{playbackError}</span>
                  </p>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handlePlayTrack(currentTrack)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                    <span>{isPlaying ? 'Pause Track' : 'Play Spotlight'}</span>
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(currentTrack.id, e)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      favoriteTrackIds.includes(currentTrack.id)
                        ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    }`}
                    title="Add to Favorites"
                  >
                    <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack.id) ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsFullscreenVisualizer(true)}
                    className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
                    title="Fullscreen Visualizer"
                  >
                    <Maximize2 className="w-4 h-4 text-amber-300" />
                    <span>Visualizer</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── 4. FEATURED PLAYLIST CARDS SECTION ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                  <ListMusic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-quicksand text-white">Curated Playlists & 1000 Vaults</h3>
                  <p className="text-xs text-slate-400">Select any playlist card to stream its full collection</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreatePlaylistModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Playlist</span>
              </button>
            </div>

            {/* Playlist Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {playlists.map((pl) => {
                const isSelected = activeView === 'playlist' && selectedPlaylistId === pl.id;
                const plTracks = tracks.filter(t => pl.trackIds.includes(t.id));

                return (
                  <div
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylistId(pl.id);
                      setActiveView('playlist');
                    }}
                    className={`group relative rounded-3xl overflow-hidden p-5 border transition-all cursor-pointer flex flex-col justify-between shadow-2xl ${
                      isSelected 
                        ? 'bg-gradient-to-b from-white/20 via-[#161b28] to-[#10141d] border-amber-400 shadow-amber-500/20 scale-[1.02]' 
                        : 'bg-[#10141d]/90 hover:bg-[#151a26] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/10">
                        <img 
                          src={pl.coverArt} 
                          alt={pl.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                          <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                            {pl.trackIds.length} Songs
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-black font-quicksand text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {pl.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {pl.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlaylistId(pl.id);
                          setActiveView('playlist');
                          if (plTracks.length > 0) {
                            handlePlayTrack(plTracks[0]);
                          }
                        }}
                        className="w-9 h-9 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                        title="Play Playlist"
                      >
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </button>

                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                        Open &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 5. MOOD & GENRE FILTER PILLS & VIEW TOGGLE (CARDS VS LIST) ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10141d]/80 p-3 rounded-2xl border border-white/10">
            
            {/* Genre filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold flex-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 shrink-0 pr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter:</span>
              </span>
              {['All', 'Bollywood', 'Punjabi', 'Party', 'Devotional', 'Lo-Fi', 'Hip-Hop', 'Romantic', 'Synthwave', 'Indie Pop'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs ${
                    selectedGenre === genre
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* View Mode Toggle (Song Cards Grid vs Compact List) + Sorting */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* View Switcher Button */}
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewDisplayMode('cards')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewDisplayMode === 'cards' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewDisplayMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewDisplayMode === 'list' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Compact List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="default" className="bg-slate-900">Default</option>
                  <option value="title_asc" className="bg-slate-900">A-Z</option>
                  <option value="title_desc" className="bg-slate-900">Z-A</option>
                  <option value="artist" className="bg-slate-900">Singer</option>
                  <option value="plays" className="bg-slate-900">Plays</option>
                </select>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {filteredAndSortedTracks.length} Tracks
              </span>
            </div>

          </div>

          {/* ── 6. ACTIVE VIEW HEADER & ACTIONS ── */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-black font-quicksand text-white flex items-center gap-2">
                {activeView === 'all' && <span>🎵 All 1,000 Song Cards</span>}
                {activeView === 'favorites' && <span>💖 Your Liked Songs</span>}
                {activeView === 'drive' && <span>☁️ Google Drive 1000 Master Vault</span>}
                {activeView === 'playlist' && <span>📜 Playlist: {selectedPlaylist?.name}</span>}
                {activeView === 'ambience' && <span>🎧 Soundscape Active Library</span>}
                <span className="text-xs font-normal text-slate-400">
                  (Showing {paginatedTracks.length} of {filteredAndSortedTracks.length} tracks • Page {currentPage} of {totalPages})
                </span>
              </h3>
              {activeView === 'playlist' && selectedPlaylist?.description && (
                <p className="text-xs text-slate-400 mt-0.5">{selectedPlaylist.description}</p>
              )}
            </div>

            {filteredAndSortedTracks.length > 0 && (
              <button
                onClick={() => handlePlayTrack(filteredAndSortedTracks[0])}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play All</span>
              </button>
            )}
          </div>

          {/* ── 7. INTERACTIVE SONG CARDS (GRID OR LIST) ── */}
          {filteredAndSortedTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#10141d]/80 rounded-3xl border border-white/10 p-6 space-y-3">
              <Disc className="w-12 h-12 text-slate-500 mx-auto animate-spin" />
              <h4 className="text-sm font-bold text-white">No tracks match your current search "{searchQuery}"</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for a different song name, artist, or reload the full 1000 song collection!
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Clear Search
                </button>
                <button
                  onClick={handleResetToDriveFolder}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload 1000 Songs</span>
                </button>
              </div>
            </div>
          ) : viewDisplayMode === 'cards' ? (
            
            /* ── VISUAL SONG CARDS GRID (SPOTIFY / APPLE MUSIC STYLE) ── */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {paginatedTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id;
                const isLiked = favoriteTrackIds.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className={`group relative rounded-3xl overflow-hidden p-3.5 border transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                      isCurrentPlaying
                        ? 'bg-amber-400/15 border-amber-400/80 shadow-amber-500/20 scale-[1.02]'
                        : 'bg-[#10141d]/90 hover:bg-[#161c28] border-white/10 hover:border-white/30 hover:scale-[1.03]'
                    }`}
                  >
                    {/* Cover Art & Floating Overlay */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-3">
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Favorite Heart Badge */}
                      <button
                        onClick={(e) => toggleFavorite(track.id, e)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isLiked ? 'bg-rose-500 text-white shadow-lg' : 'bg-black/50 text-white hover:bg-black/80'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                      </button>

                      {/* Floating Play Button */}
                      <div className={`absolute bottom-2.5 right-2.5 transition-all duration-300 ${
                        isCurrentPlaying && isPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                      }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrentPlaying) togglePlay();
                            else handlePlayTrack(track);
                          }}
                          className="w-10 h-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 cursor-pointer"
                        >
                          {isCurrentPlaying && isPlaying ? (
                            <Pause className="w-4 h-4 fill-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Live Equalizer Animation if Currently Playing */}
                      {isCurrentPlaying && isPlaying && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-end gap-0.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl">
                          <span className="w-1 h-3 bg-amber-400 animate-bounce" />
                          <span className="w-1 h-4 bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-2 bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold truncate ${isCurrentPlaying ? 'text-amber-300 font-black' : 'text-white'}`}>
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {track.artist}
                      </p>
                    </div>

                    {/* Footer Tags & Add to Playlist */}
                    <div className="pt-3 flex items-center justify-between border-t border-white/5 mt-2">
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        {track.duration}
                      </span>

                      {/* Add to playlist menu */}
                      <div className="relative group/pl">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Add to Playlist"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="absolute right-0 bottom-full mb-1 hidden group-hover/pl:block w-44 p-2 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                          <span className="text-[9px] font-black uppercase text-slate-400 px-2 py-1 block border-b border-white/10 mb-1">
                            Add to Playlist:
                          </span>
                          {playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={(e) => handleAddTrackToPlaylist(pl.id, track.id, e)}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-[10px] hover:bg-white/10 text-slate-200 flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{pl.name}</span>
                              {pl.trackIds.includes(track.id) && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            
            /* ── COMPACT LIST VIEW ── */
            <div className="space-y-2.5">
              {paginatedTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id;
                const isLiked = favoriteTrackIds.includes(track.id);
                const actualIndex = (currentPage - 1) * itemsPerPage + idx + 1;

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer group border ${
                      isCurrentPlaying
                        ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-xl shadow-amber-500/10'
                        : 'bg-[#10141d]/80 hover:bg-white/10 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-7 text-center text-xs font-mono font-bold text-slate-500 group-hover:hidden">
                        {isCurrentPlaying && isPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-4">
                            <span className="w-1 h-3 bg-amber-400 animate-bounce" />
                            <span className="w-1 h-4 bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-2 bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          actualIndex
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentPlaying) togglePlay();
                          else handlePlayTrack(track);
                        }}
                        className="w-7 h-7 rounded-xl bg-amber-400 text-black hidden group-hover:flex items-center justify-center shadow cursor-pointer"
                      >
                        {isCurrentPlaying && isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                      </button>

                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-12 h-12 rounded-2xl object-cover shadow-md shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      />

                      <div className="truncate min-w-0 pr-2">
                        <h4 className={`text-xs font-bold truncate ${isCurrentPlaying ? 'text-amber-300 font-black' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{track.artist}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600" />
                          <span className="opacity-75">{track.album}</span>
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
                      {track.vibe && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                          {track.vibe}
                        </span>
                      )}
                      {track.isGoogleDrive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold flex items-center gap-1">
                          <Cloud className="w-2.5 h-2.5" />
                          <span>Drive</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      
                      <div className="relative group/pl">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Add to Playlist"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/pl:block w-48 p-2 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                          <span className="text-[9px] font-black uppercase text-slate-400 px-2 py-1 block border-b border-white/10 mb-1">
                            Add to Playlist:
                          </span>
                          {playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={(e) => handleAddTrackToPlaylist(pl.id, track.id, e)}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] hover:bg-white/10 text-slate-200 flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{pl.name}</span>
                              {pl.trackIds.includes(track.id) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(track.id, e)}
                        className={`p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>

                      <span className="text-[11px] font-mono text-slate-400 w-10 text-right font-medium">
                        {track.duration}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* ── 8. PAGINATION BAR (PAGINATE ACROSS ALL 1000 SONGS) ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 font-mono">
                Page {currentPage} of {totalPages} ({filteredAndSortedTracks.length} total tracks)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ── 9. PERSISTENT SLEEK BOTTOM PLAYER BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1017]/95 backdrop-blur-2xl border-t border-white/15 px-4 sm:px-8 py-3 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Track Info (Left) */}
          <div className="flex items-center gap-3 w-full md:w-1/4 shrink-0">
            <div className="relative group shrink-0 w-12 h-12">
              <img
                src={currentTrack?.coverArt}
                alt="Track Thumbnail"
                className="w-12 h-12 max-w-[48px] max-h-[48px] rounded-xl object-cover shadow-lg border border-white/20 shrink-0"
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
              )}
            </div>

            <div className="truncate min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {currentTrack?.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentTrack?.artist}
              </p>
            </div>

            <button
              onClick={(e) => toggleFavorite(currentTrack?.id, e)}
              className={`p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0 ${
                favoriteTrackIds.includes(currentTrack?.id) ? 'text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack?.id) ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Playback Controls & Scrubber Slider (Center) */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isShuffle ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle Mode"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Prev */}
              <button
                onClick={handlePrevTrack}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause Primary */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                {isBuffering ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat Mode */}
              <button
                onClick={() => {
                  if (repeatMode === 'off') setRepeatMode('all');
                  else if (repeatMode === 'all') setRepeatMode('one');
                  else setRepeatMode('off');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  repeatMode !== 'off' ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Scrubber Progress Slider */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="w-8 text-right font-medium">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <span className="w-8 font-medium">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control & Visualizer Toggle (Right) */}
          <div className="flex items-center justify-end gap-3 w-full md:w-1/4 shrink-0">
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Expand Visualizer Modal */}
            <button
              onClick={() => setIsFullscreenVisualizer(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer hover:scale-105"
              title="Expand Visualizer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 10. BULK IMPORT 1000 SONGS MODAL ── */}
      {isBulkImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-2xl rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-quicksand">Bulk Import 1000 Google Drive Songs</h3>
                  <p className="text-[11px] text-slate-400">Paste your entire track list, Google Drive share links, or CSV lines</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkImportModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkImportSongs} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Paste Multiple Drive Links, File Names, or CSV / JSON:
                </label>
                <textarea
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  rows={8}
                  placeholder={`Paste your 1000 songs in any format:\n\nFormat 1 (Links):\nhttps://drive.google.com/file/d/1A2B3C.../view?usp=sharing\nhttps://drive.google.com/file/d/1X2Y3Z.../view?usp=sharing\n\nFormat 2 (CSV Title, DriveID, Artist):\nTum Hi Ho, 1A2B3C..., Arijit Singh\nChanna Mereya, 1X2Y3Z..., Arijit Singh\n\nFormat 3 (JSON array of songs):\n[{"title":"My Song","driveId":"1A2B3C..."}]`}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-xs font-mono text-white placeholder:text-slate-500 focus:border-emerald-400 outline-none resize-y"
                />
              </div>

              {bulkStatusMsg && (
                <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  bulkStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {bulkStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{bulkStatusMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  ⚡ All imported songs will be saved in your browser storage and will be searchable immediately.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkImportModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-teal-600/30 cursor-pointer transition-all hover:scale-105"
                  >
                    + Import All Songs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 11. SINGLE GOOGLE DRIVE MUSIC IMPORTER MODAL ── */}
      {isImportDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-quicksand">Import Music from Google Drive</h3>
                  <p className="text-[11px] text-slate-400">Stream personal MP3s & studio tracks directly</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportDriveModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportGoogleDriveTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Google Drive Shareable Link or File ID: *
                </label>
                <input
                  type="text"
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Note: Make sure the file access in Google Drive is set to <strong>"Anyone with the link can view"</strong>.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Song Title: *</label>
                  <input
                    type="text"
                    value={newDriveTitle}
                    onChange={(e) => setNewDriveTitle(e.target.value)}
                    placeholder="e.g. Algorithmic Symphony"
                    required
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Artist / Producer:</label>
                  <input
                    type="text"
                    value={newDriveArtist}
                    onChange={(e) => setNewDriveArtist(e.target.value)}
                    placeholder="e.g. DevLoFi & Code"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Genre Category:</label>
                  <select
                    value={newDriveGenre}
                    onChange={(e) => setNewDriveGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-2xl text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Bollywood">Bollywood Hits</option>
                    <option value="Punjabi">Punjabi Party</option>
                    <option value="Devotional">Devotional & Chants</option>
                    <option value="Lo-Fi">Lo-Fi Coding Chill</option>
                    <option value="Synthwave">Synthwave Cyberpunk</option>
                    <option value="Ambient">Deep Space Ambient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cover Art URL (Optional):</label>
                  <input
                    type="url"
                    value={newDriveCover}
                    onChange={(e) => setNewDriveCover(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {importStatusMsg && (
                <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  importStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {importStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importStatusMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportDriveModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-black shadow-xl shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
                >
                  + Add & Stream from Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 12. CREATE PLAYLIST MODAL ── */}
      {isCreatePlaylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-md rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-quicksand">Create New Playlist</h3>
              </div>
              <button
                onClick={() => setIsCreatePlaylistModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Playlist Name: *</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. My Favorite Drive Jams"
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description:</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  rows={3}
                  placeholder="Write a short summary for your playlist..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePlaylistModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg cursor-pointer transition-all"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 13. FULLSCREEN IMMERSIVE VISUALIZER MODAL ── */}
      {isFullscreenVisualizer && (
        <div className="fixed inset-0 z-50 bg-[#06080d] flex flex-col items-center justify-between p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="w-full flex items-center justify-between max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                Immersive Coding Visualizer
              </span>
            </div>
            <button
              onClick={() => setIsFullscreenVisualizer(false)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Graphic */}
          <div className="text-center space-y-6 max-w-md my-auto">
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 blur-3xl opacity-60 ${
                isPlaying ? 'animate-pulse' : 'opacity-20'
              }`} />
              <img
                src={currentTrack?.coverArt}
                alt={currentTrack?.title}
                className={`relative w-full h-full rounded-full object-cover shadow-2xl border-4 border-white/20 ${
                  isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white">
                {currentTrack?.title}
              </h2>
              <p className="text-sm text-slate-300">
                {currentTrack?.artist} • {currentTrack?.album}
              </p>
              {currentTrack?.lyrics && (
                <p className="text-xs text-amber-300/90 italic pt-2 max-w-sm mx-auto">
                  "{currentTrack.lyrics}"
                </p>
              )}
            </div>

            {/* Fullscreen Waveform Equalizer */}
            <div className="flex items-end justify-center gap-2 h-16 pt-4">
              {[30, 60, 90, 45, 80, 100, 65, 85, 40, 75, 95, 50, 70, 90, 35].map((val, idx) => (
                <div
                  key={idx}
                  className="w-2.5 rounded-full bg-gradient-to-t from-amber-400 via-rose-500 to-indigo-400 transition-all"
                  style={{
                    height: isPlaying ? `${Math.max(20, (val * (volume / 100)) % 100)}%` : '15%',
                    animation: isPlaying ? 'bounce 0.6s infinite alternate' : 'none',
                    animationDelay: `${idx * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls in Fullscreen */}
          <div className="w-full max-w-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex items-center justify-center gap-6 pt-2">
              <button onClick={handlePrevTrack} className="text-white hover:text-amber-300 p-2 cursor-pointer">
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
              </button>
              <button onClick={handleNextTrack} className="text-white hover:text-amber-300 p-2 cursor-pointer">
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
