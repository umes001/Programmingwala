import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Gamepad2, 
  Users, 
  UserPlus, 
  Trophy, 
  Play, 
  RefreshCw, 
  Flame, 
  Sparkles, 
  Swords, 
  Check, 
  X, 
  MessageSquare, 
  Copy, 
  Share2, 
  Bot, 
  Crown, 
  Award, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ArrowLeft, 
  ShieldAlert, 
  Zap, 
  RotateCcw, 
  Smile, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6,
  CircleDot,
  Radio,
  Clock,
  Send,
  HelpCircle,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// SOUND FX HELPER (Web Audio API Synthesizer - 0 External Dependencies)
// ─────────────────────────────────────────────────────────────────────────────
const playSynthSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'dice') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'move') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'snake') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'ladder') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME ASSETS & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const GAMES_LIST = [
  {
    id: 'ludo',
    name: '🎲 Ludo Classic Arena',
    category: 'Board Game',
    players: '2-4 Players',
    badge: 'HOT MULTIPLAYER',
    description: 'Roll dice, advance your 4 tokens home, capture rivals, and become the Ludo King!',
    gradient: 'from-amber-500 via-rose-500 to-indigo-600',
    cover: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'snakes',
    name: '🪜 Snakes & Ladders (1-100)',
    category: 'Dice & Luck',
    players: '2 Players / Vs AI',
    badge: 'POPULAR',
    description: 'Climb high ladders, dodge tricky snakes, and race to square 100 first!',
    gradient: 'from-emerald-500 via-teal-500 to-indigo-600',
    cover: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'retro_snake',
    name: '🐍 Cyber Retro Snake',
    category: 'Arcade Classic',
    players: 'Single Player / High Score',
    badge: 'CLASSIC ARCADE',
    description: 'Control the neon snake, eat cyber apples, grab multipliers, and set high scores!',
    gradient: 'from-purple-600 via-pink-500 to-cyan-500',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tictactoe',
    name: '❌⭕ Neon Tic Tac Toe',
    category: 'Strategy & Quick PvP',
    players: '2 Players / Vs AI',
    badge: 'FAST MATCH',
    description: 'Align 3 glowing markers in a row, play vs friends online or challenge Master AI!',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
    cover: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=600&q=80'
  }
];

const QUICK_EMOJIS = ['🔥', '🎉', '💀', '👏', '🤣', '💥', '👑', '😎'];

export default function Games() {
  // ── User Profile ──
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('appletree_gamer_name') || `Player_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [playerAvatar, setPlayerAvatar] = useState(() => {
    return localStorage.getItem('appletree_gamer_avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  });
  const [winsCount, setWinsCount] = useState(() => {
    return parseInt(localStorage.getItem('appletree_gamer_wins') || '0');
  });

  // ── Selected Active Game ──
  const [selectedGame, setSelectedGame] = useState(null); // null | 'ludo' | 'snakes' | 'retro_snake' | 'tictactoe'
  const [gameMode, setGameMode] = useState('online'); // 'online' | 'ai' | 'local'

  // ── Socket State ──
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // ── Matchmaking & Challenges ──
  const [incomingChallenge, setIncomingChallenge] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null); // { roomId, gameType, players, currentTurn }
  const [customRoomCodeInput, setCustomRoomCodeInput] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [quickChatList, setQuickChatList] = useState([]);
  const [customMessage, setCustomMessage] = useState('');

  // ── Connect Socket.IO on Mount ──
  useEffect(() => {
    const backendUrl = window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin;
    const s = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('join_lobby', {
        username: playerName,
        avatar: playerAvatar,
        wins: winsCount,
        level: Math.floor(winsCount / 3) + 1
      });
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('online_users_updated', (users) => {
      setOnlineUsers(users);
    });

    s.on('incoming_challenge', (data) => {
      playSynthSound('move');
      setIncomingChallenge(data);
    });

    s.on('challenge_declined', (data) => {
      alert(`❌ ${data.declinerName} ${data.reason}`);
    });

    s.on('game_match_started', (matchData) => {
      playSynthSound('win');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setActiveMatch(matchData);
      setSelectedGame(matchData.gameType.toLowerCase().replace(/[^a-z_]/g, '') || 'ludo');
      setIncomingChallenge(null);
      setCreatedRoomCode(null);
    });

    s.on('room_created', ({ roomCode }) => {
      setCreatedRoomCode(roomCode);
    });

    s.on('join_room_error', ({ message }) => {
      alert(message);
    });

    s.on('quick_chat_received', (chatData) => {
      setQuickChatList(prev => [...prev.slice(-15), chatData]);
    });

    s.on('opponent_left', ({ message }) => {
      alert(`⚠️ ${message}`);
      setActiveMatch(null);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [playerName, playerAvatar, winsCount]);

  // Send Match Challenge
  const handleSendChallenge = (targetUser, gameType) => {
    if (!socket) return;
    socket.emit('send_challenge', {
      targetSocketId: targetUser.socketId,
      gameType: gameType || 'Ludo',
      challengerInfo: { username: playerName, avatar: playerAvatar }
    });
    alert(`⚔️ Match challenge sent to ${targetUser.username}! Waiting for their response...`);
  };

  // Accept Challenge
  const handleAcceptChallenge = () => {
    if (!socket || !incomingChallenge) return;
    socket.emit('accept_challenge', {
      challengerSocketId: incomingChallenge.challengerSocketId,
      gameType: incomingChallenge.gameType
    });
    setIncomingChallenge(null);
  };

  // Decline Challenge
  const handleDeclineChallenge = () => {
    if (!socket || !incomingChallenge) return;
    socket.emit('decline_challenge', {
      challengerSocketId: incomingChallenge.challengerSocketId,
      reason: 'is not available right now.'
    });
    setIncomingChallenge(null);
  };

  // Create Room
  const handleCreateRoom = (gameType) => {
    if (!socket) return;
    socket.emit('create_room', {
      gameType: gameType || 'Ludo',
      maxPlayers: 2,
      hostInfo: { username: playerName, avatar: playerAvatar }
    });
  };

  // Join Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!socket || !customRoomCodeInput.trim()) return;
    socket.emit('join_room', {
      roomCode: customRoomCodeInput.trim().toUpperCase(),
      playerInfo: { username: playerName, avatar: playerAvatar }
    });
    setCustomRoomCodeInput('');
  };

  // Send In-Match Quick Chat
  const handleSendQuickChat = (emoji, msg) => {
    if (!socket || !activeMatch) return;
    socket.emit('send_quick_chat', {
      roomId: activeMatch.roomId,
      emoji: emoji || '',
      message: msg || customMessage
    });
    setCustomMessage('');
  };

  // Record Win
  const handleRecordWin = () => {
    const newWins = winsCount + 1;
    setWinsCount(newWins);
    localStorage.setItem('appletree_gamer_wins', newWins.toString());
    playSynthSound('win');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-24 relative overflow-x-hidden select-none">
      
      {/* Dynamic Ambient Neon Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-600/10 blur-[140px] pointer-events-none animate-pulse [animation-delay:2s]" />

      {/* ── INCOMING CHALLENGE MODAL / TOAST ── */}
      {incomingChallenge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121622] max-w-md w-full rounded-3xl border-2 border-amber-400 p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl animate-bounce">
              ⚔️
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Live Match Challenge!
              </span>
              <h3 className="text-xl font-black font-quicksand text-white mt-2">
                {incomingChallenge.challengerName}
              </h3>
              <p className="text-xs text-slate-400">
                Wants to play <strong className="text-amber-300">{incomingChallenge.gameType}</strong> with you!
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDeclineChallenge}
                className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptChallenge}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 cursor-pointer transition-all hover:scale-105"
              >
                Accept Challenge ⚔️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. TOP HEADER & GAMING STATUS ── */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/25 text-white font-black">
            <Gamepad2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold font-quicksand text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
              <span>AppleTree Game Arena</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-400/30">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>{onlineUsers.length || 1} Online</span>
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Multiplayer Ludo • Snakes & Ladders • Cyber Snake • Tic-Tac-Toe
            </p>
          </div>
        </div>

        {/* User Gamer Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
            <img src={playerAvatar} alt="Avatar" className="w-7 h-7 rounded-xl object-cover border border-amber-400/40" />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">{playerName}</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">🏆 {winsCount} Wins</span>
            </div>
          </div>
        </div>

      </header>

      {/* ── 2. MAIN CONTAINER: LOBBY OR ACTIVE GAME ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* IF A GAME IS SELECTED: RENDER SPECIFIC GAME */}
        {selectedGame ? (
          <div className="space-y-6">
            
            {/* Game Navigation Top Bar */}
            <div className="flex items-center justify-between bg-[#10141d]/90 p-4 rounded-3xl border border-white/10 shadow-2xl">
              <button
                onClick={() => {
                  if (activeMatch && socket) {
                    socket.emit('leave_game', { roomId: activeMatch.roomId });
                  }
                  setSelectedGame(null);
                  setActiveMatch(null);
                }}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Games Arena</span>
              </button>

              {/* In-Match Indicator & Mode Selector */}
              <div className="flex items-center gap-2">
                {activeMatch ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5" />
                    <span>Live Match: {activeMatch.roomId}</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-bold">
                    <button
                      onClick={() => setGameMode('ai')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        gameMode === 'ai' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      🤖 Vs Bot AI
                    </button>
                    <button
                      onClick={() => setGameMode('local')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        gameMode === 'local' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      👥 Pass & Play
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── EMBEDDED GAME VIEW ── */}
            {selectedGame === 'ludo' && (
              <LudoGameView 
                mode={activeMatch ? 'online' : gameMode} 
                activeMatch={activeMatch} 
                socket={socket} 
                onWin={handleRecordWin}
                playerName={playerName}
              />
            )}

            {selectedGame === 'snakes' && (
              <SnakesAndLaddersView 
                mode={activeMatch ? 'online' : gameMode} 
                activeMatch={activeMatch} 
                socket={socket} 
                onWin={handleRecordWin}
                playerName={playerName}
              />
            )}

            {selectedGame === 'retro_snake' && (
              <RetroSnakeView onWin={handleRecordWin} />
            )}

            {selectedGame === 'tictactoe' && (
              <TicTacToeView 
                mode={activeMatch ? 'online' : gameMode} 
                activeMatch={activeMatch} 
                socket={socket} 
                onWin={handleRecordWin}
                playerName={playerName}
              />
            )}

            {/* In-Match Quick Chat Bar (If in Online Match) */}
            {activeMatch && (
              <div className="bg-[#10141d] p-4 rounded-3xl border border-white/10 space-y-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>In-Match Quick Reaction Emotes:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {QUICK_EMOJIS.map(em => (
                    <button
                      key={em}
                      onClick={() => handleSendQuickChat(em, '')}
                      className="text-lg p-2 rounded-2xl bg-white/5 hover:bg-white/15 hover:scale-125 transition-all cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                {/* Quick Chat Feeds */}
                {quickChatList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    {quickChatList.slice(-4).map((chat, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold text-amber-300">
                        {chat.senderName}: {chat.emoji} {chat.message}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          /* ── MAIN ARENA LOBBY (SHOW GAMES & ONLINE USERS) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ── LEFT: GAMES CATALOG (8 COLS) ── */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-quicksand text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    <span>Choose Your Game</span>
                  </h2>
                  <p className="text-xs text-slate-400">Play solo vs smart AI or challenge any online player in real-time!</p>
                </div>
              </div>

              {/* Games Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAMES_LIST.map((game) => (
                  <div
                    key={game.id}
                    className="relative group rounded-3xl overflow-hidden bg-[#10141d]/90 border border-white/10 p-5 shadow-2xl hover:border-amber-400/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase">
                          {game.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{game.players}</span>
                      </div>

                      <h3 className="text-lg font-black font-quicksand text-white group-hover:text-amber-300 transition-colors">
                        {game.name}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {game.description}
                      </p>
                    </div>

                    <div className="pt-5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedGame(game.id);
                          setGameMode('ai');
                        }}
                        className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Play Now</span>
                      </button>

                      <button
                        onClick={() => handleCreateRoom(game.name)}
                        className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Create Private Room"
                      >
                        <Hash className="w-3.5 h-3.5" />
                        <span>Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Private Room Joining Card */}
              <div className="p-6 rounded-3xl bg-[#10141d]/90 border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-quicksand text-white">Join Private Match via Room Code</h3>
                      <p className="text-[11px] text-slate-400">Enter the 6-digit room code shared by your friend</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleJoinRoom} className="flex gap-2">
                  <input
                    type="text"
                    value={customRoomCodeInput}
                    onChange={(e) => setCustomRoomCodeInput(e.target.value)}
                    placeholder="e.g. LUDO-8492"
                    required
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs uppercase font-mono text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all hover:scale-105"
                  >
                    Join Room
                  </button>
                </form>

                {createdRoomCode && (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-emerald-300 block">Your Private Room Code:</span>
                      <span className="font-mono text-lg font-black text-white tracking-widest">{createdRoomCode}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdRoomCode);
                        alert('Room code copied to clipboard!');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-black text-xs cursor-pointer shadow"
                    >
                      Copy Code
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* ── RIGHT: LIVE ONLINE USERS & CHALLENGES (4 COLS) ── */}
            <aside className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#10141d]/90 p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-black text-sm">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Online Players ({onlineUsers.length || 1})</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {onlineUsers.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Connecting to live player matchmaking...
                    </div>
                  ) : (
                    onlineUsers.map((u) => {
                      const isMe = socket && socket.id === u.socketId;
                      return (
                        <div
                          key={u.socketId}
                          className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={u.avatar} alt={u.username} className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0" />
                            <div className="truncate min-w-0">
                              <span className="text-xs font-bold text-white truncate block">
                                {u.username} {isMe && <span className="text-amber-400 font-normal">(You)</span>}
                              </span>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{u.status || 'Online'}</span>
                              </span>
                            </div>
                          </div>

                          {!isMe && (
                            <button
                              onClick={() => handleSendChallenge(u, 'Ludo')}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                            >
                              <Swords className="w-3 h-3" />
                              <span>Challenge</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Hall of Fame / Leaderboard Card */}
              <div className="bg-gradient-to-br from-[#10141d] to-[#121622] p-5 rounded-3xl border border-white/10 shadow-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-black text-sm">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Arena Leaderboard</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold">
                    <span>🥇 Grand Master</span>
                    <span>42 Wins</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-slate-300 font-bold">
                    <span>🥈 Cyber Knight</span>
                    <span>28 Wins</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-slate-300 font-bold">
                    <span>🥉 Ludo Champion</span>
                    <span>19 Wins</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        )}

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 1: 🎲 LUDO CLASSIC ARENA (2-4 PLAYERS, REAL DICE & TOKENS)
// ─────────────────────────────────────────────────────────────────────────────
function LudoGameView({ mode, activeMatch, socket, onWin, playerName }) {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [turnColor, setTurnColor] = useState('red'); // 'red' | 'green' | 'yellow' | 'blue'
  const [hasRolled, setHasRolled] = useState(false);
  const [winner, setWinner] = useState(null);

  // 4 Tokens each: position: -1 (in base), 0-51 (track), 52-57 (home stretch), 100 (home/won)
  const [tokens, setTokens] = useState({
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1]
  });

  const rollDice = () => {
    if (isRolling || hasRolled || winner) return;
    setIsRolling(true);
    playSynthSound('dice');

    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(1 + Math.random() * 6));
      rolls++;
      if (rolls > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(1 + Math.random() * 6);
        setDiceValue(finalVal);
        setIsRolling(false);
        setHasRolled(true);

        // Check if any move is possible
        const currentPositions = tokens[turnColor];
        const canMove = currentPositions.some(pos => pos !== -1 || finalVal === 6);
        if (!canMove) {
          setTimeout(() => switchTurn(), 900);
        }
      }
    }, 50);
  };

  const moveToken = (color, tokenIdx) => {
    if (color !== turnColor || !hasRolled || winner) return;
    const currentPos = tokens[color][tokenIdx];

    if (currentPos === -1 && diceValue !== 6) return; // Need 6 to come out

    playSynthSound('move');
    let newPos = currentPos === -1 ? 0 : currentPos + diceValue;
    if (newPos >= 56) newPos = 100; // Reached Home!

    setTokens(prev => {
      const updated = { ...prev, [color]: [...prev[color]] };
      updated[color][tokenIdx] = newPos;

      // Check win condition (all 4 tokens home)
      if (updated[color].every(p => p === 100)) {
        setWinner(color);
        onWin();
      }
      return updated;
    });

    setHasRolled(false);
    if (diceValue !== 6) {
      switchTurn();
    }
  };

  const switchTurn = () => {
    setHasRolled(false);
    setTurnColor(prev => (prev === 'red' ? 'green' : 'red'));
  };

  return (
    <div className="bg-[#10141d] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
      
      {/* Game Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-black font-quicksand text-white flex items-center gap-2">
            <span>🎲 Ludo Arena</span>
            <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
              turnColor === 'red' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {turnColor.toUpperCase()}'S TURN
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Roll a 6 to bring tokens out of base. Reach center with all tokens to win!</p>
        </div>

        {/* Dice Controller */}
        <div className="flex items-center gap-4">
          <button
            onClick={rollDice}
            disabled={isRolling || hasRolled || !!winner}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black border-2 shadow-2xl transition-all cursor-pointer ${
              turnColor === 'red' ? 'bg-rose-600 text-white border-rose-400' : 'bg-emerald-600 text-white border-emerald-400'
            } ${isRolling ? 'animate-spin' : 'hover:scale-110 active:scale-95'} disabled:opacity-50`}
          >
            {diceValue === 1 && <Dice1 className="w-8 h-8" />}
            {diceValue === 2 && <Dice2 className="w-8 h-8" />}
            {diceValue === 3 && <Dice3 className="w-8 h-8" />}
            {diceValue === 4 && <Dice4 className="w-8 h-8" />}
            {diceValue === 5 && <Dice5 className="w-8 h-8" />}
            {diceValue === 6 && <Dice6 className="w-8 h-8 text-amber-300 animate-pulse" />}
          </button>
        </div>
      </div>

      {winner && (
        <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400 text-center text-amber-300 font-black text-lg animate-bounce">
          🏆 PLAYER {winner.toUpperCase()} WINS THE LUDO MATCH! 🎉
        </div>
      )}

      {/* LUDO BOARD GRID VISUALIZATION */}
      <div className="max-w-md mx-auto aspect-square bg-[#1a1f2e] rounded-3xl border-4 border-slate-700 p-4 relative grid grid-cols-3 grid-rows-3 gap-2 shadow-2xl">
        
        {/* Red Home Base (Top-Left) */}
        <div className="bg-rose-950/60 border-2 border-rose-500/50 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2 relative">
          <span className="absolute top-2 left-2 text-[10px] font-black text-rose-400">RED BASE</span>
          {tokens.red.map((pos, idx) => (
            <button
              key={idx}
              onClick={() => moveToken('red', idx)}
              disabled={turnColor !== 'red' || !hasRolled}
              className={`w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-black text-white transition-transform ${
                turnColor === 'red' && hasRolled ? 'animate-bounce cursor-pointer' : 'opacity-80'
              }`}
            >
              {pos === 100 ? '👑' : pos === -1 ? '🔴' : pos}
            </button>
          ))}
        </div>

        {/* Top Pathway */}
        <div className="bg-slate-900/60 rounded-2xl p-1 flex items-center justify-center text-[10px] font-bold text-slate-500">
          Track
        </div>

        {/* Green Home Base (Top-Right) */}
        <div className="bg-emerald-950/60 border-2 border-emerald-500/50 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2 relative">
          <span className="absolute top-2 right-2 text-[10px] font-black text-emerald-400">GREEN BASE</span>
          {tokens.green.map((pos, idx) => (
            <button
              key={idx}
              onClick={() => moveToken('green', idx)}
              disabled={turnColor !== 'green' || !hasRolled}
              className={`w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-black text-white transition-transform ${
                turnColor === 'green' && hasRolled ? 'animate-bounce cursor-pointer' : 'opacity-80'
              }`}
            >
              {pos === 100 ? '👑' : pos === -1 ? '🟢' : pos}
            </button>
          ))}
        </div>

        {/* Left Pathway */}
        <div className="bg-slate-900/60 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-500">
          Track
        </div>

        {/* Center Home Triangle */}
        <div className="bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-center text-xs shadow-inner">
          ⭐ HOME ⭐
        </div>

        {/* Right Pathway */}
        <div className="bg-slate-900/60 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-500">
          Track
        </div>

        {/* Bottom Bases */}
        <div className="bg-amber-950/30 rounded-2xl flex items-center justify-center text-[10px] font-bold text-amber-500">
          Yellow Base
        </div>
        <div className="bg-slate-900/60 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-500">
          Track
        </div>
        <div className="bg-blue-950/30 rounded-2xl flex items-center justify-center text-[10px] font-bold text-blue-500">
          Blue Base
        </div>

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 2: 🪜 SNAKES & LADDERS (1-100 CLASSIC BOARD)
// ─────────────────────────────────────────────────────────────────────────────
function SnakesAndLaddersView({ mode, onWin }) {
  const [player1Pos, setPlayer1Pos] = useState(1);
  const [player2Pos, setPlayer2Pos] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1); // 1 or 2
  const [diceRoll, setDiceRoll] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);

  const LADDERS = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };
  const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };

  const handleRollDice = () => {
    if (isRolling || winner) return;
    setIsRolling(true);
    playSynthSound('dice');

    let rolls = 0;
    const interval = setInterval(() => {
      setDiceRoll(Math.floor(1 + Math.random() * 6));
      rolls++;
      if (rolls > 6) {
        clearInterval(interval);
        const rolled = Math.floor(1 + Math.random() * 6);
        setDiceRoll(rolled);
        setIsRolling(false);

        // Move active player
        if (currentTurn === 1) {
          let nextPos = player1Pos + rolled;
          if (nextPos > 100) nextPos = player1Pos; // exact landing
          if (LADDERS[nextPos]) {
            playSynthSound('ladder');
            nextPos = LADDERS[nextPos];
          } else if (SNAKES[nextPos]) {
            playSynthSound('snake');
            nextPos = SNAKES[nextPos];
          }
          setPlayer1Pos(nextPos);

          if (nextPos === 100) {
            setWinner('Player 1');
            onWin();
            return;
          }
          setCurrentTurn(2);
        } else {
          let nextPos = player2Pos + rolled;
          if (nextPos > 100) nextPos = player2Pos;
          if (LADDERS[nextPos]) {
            playSynthSound('ladder');
            nextPos = LADDERS[nextPos];
          } else if (SNAKES[nextPos]) {
            playSynthSound('snake');
            nextPos = SNAKES[nextPos];
          }
          setPlayer2Pos(nextPos);

          if (nextPos === 100) {
            setWinner('Player 2');
            onWin();
            return;
          }
          setCurrentTurn(1);
        }
      }
    }, 60);
  };

  return (
    <div className="bg-[#10141d] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-black font-quicksand text-white">🪜 Snakes & Ladders (1-100)</h3>
          <p className="text-xs text-slate-400">Player 1: Square {player1Pos} • Player 2: Square {player2Pos}</p>
        </div>

        <button
          onClick={handleRollDice}
          disabled={isRolling || !!winner}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <span>Roll Dice ({diceRoll})</span>
        </button>
      </div>

      {winner && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center text-emerald-300 font-black text-lg">
          🎉 {winner} WINS THE MATCH! 🏆
        </div>
      )}

      {/* 100 Cell Board Grid */}
      <div className="grid grid-cols-10 gap-1 bg-[#151924] p-3 rounded-3xl border border-white/10 max-w-lg mx-auto">
        {Array.from({ length: 100 }, (_, i) => {
          const num = 100 - i;
          const isP1 = player1Pos === num;
          const isP2 = player2Pos === num;
          const isLadder = LADDERS[num];
          const isSnake = SNAKES[num];

          return (
            <div
              key={num}
              className={`aspect-square rounded-xl border border-white/5 flex flex-col items-center justify-center relative text-[9px] font-bold ${
                isLadder ? 'bg-teal-900/40 text-teal-300' : isSnake ? 'bg-rose-950/40 text-rose-300' : 'bg-white/5 text-slate-400'
              }`}
            >
              <span>{num}</span>
              {isLadder && <span className="text-[7px]">🪜</span>}
              {isSnake && <span className="text-[7px]">🐍</span>}
              <div className="flex gap-0.5 absolute bottom-0.5">
                {isP1 && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                {isP2 && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 3: 🐍 CYBER RETRO SNAKE ARCADE
// ─────────────────────────────────────────────────────────────────────────────
function RetroSnakeView({ onWin }) {
  const [snake, setSnake] = useState([[5, 5], [5, 4], [5, 3]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = [...prev[0]];
        if (direction === 'UP') head[0] -= 1;
        if (direction === 'DOWN') head[0] += 1;
        if (direction === 'LEFT') head[1] -= 1;
        if (direction === 'RIGHT') head[1] += 1;

        // Collision with walls
        if (head[0] < 0 || head[0] >= 15 || head[1] < 0 || head[1] >= 15) {
          setIsGameOver(true);
          return prev;
        }

        // Collision with self
        if (prev.some(seg => seg[0] === head[0] && seg[1] === head[1])) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        // Food check
        if (head[0] === food[0] && head[1] === food[1]) {
          playSynthSound('move');
          setScore(s => s + 10);
          setFood([Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 160);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused]);

  // Keyboard Arrows
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  const restartGame = () => {
    setSnake([[5, 5], [5, 4], [5, 3]]);
    setFood([10, 10]);
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="bg-[#10141d] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-center">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-black font-quicksand text-white">🐍 Cyber Snake Arcade</h3>
          <p className="text-xs text-slate-400">Score: {score} pts</p>
        </div>

        <button
          onClick={restartGame}
          className="px-4 py-2 rounded-2xl bg-amber-400 text-black font-black text-xs shadow"
        >
          Restart
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-15 grid-rows-15 gap-1 bg-[#151924] p-3 rounded-3xl border-2 border-purple-500/40 max-w-sm mx-auto aspect-square">
        {Array.from({ length: 225 }, (_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isSnakeHead = snake[0][0] === r && snake[0][1] === c;
          const isSnakeBody = snake.slice(1).some(seg => seg[0] === r && seg[1] === c);
          const isFood = food[0] === r && food[1] === c;

          return (
            <div
              key={i}
              className={`rounded-md transition-all ${
                isSnakeHead ? 'bg-cyan-400 shadow-lg shadow-cyan-400' : isSnakeBody ? 'bg-purple-500' : isFood ? 'bg-rose-500 animate-ping' : 'bg-white/5'
              }`}
            />
          );
        })}
      </div>

      {/* On-Screen Touch D-Pad for Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto pt-2">
        <div />
        <button onClick={() => direction !== 'DOWN' && setDirection('UP')} className="p-3 rounded-2xl bg-white/10 text-white font-bold">⬆️</button>
        <div />
        <button onClick={() => direction !== 'RIGHT' && setDirection('LEFT')} className="p-3 rounded-2xl bg-white/10 text-white font-bold">⬅️</button>
        <button onClick={() => direction !== 'UP' && setDirection('DOWN')} className="p-3 rounded-2xl bg-white/10 text-white font-bold">⬇️</button>
        <button onClick={() => direction !== 'LEFT' && setDirection('RIGHT')} className="p-3 rounded-2xl bg-white/10 text-white font-bold">➡️</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 4: ❌⭕ NEON TIC TAC TOE (GLOW EDITION)
// ─────────────────────────────────────────────────────────────────────────────
function TicTacToeView({ mode, onWin }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(Boolean)) return 'Draw';
    return null;
  };

  const handleClick = (idx) => {
    if (board[idx] || winner) return;

    playSynthSound('move');
    const newBoard = [...board];
    newBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      if (win !== 'Draw') onWin();
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="bg-[#10141d] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-center">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-black font-quicksand text-white">❌⭕ Neon Tic-Tac-Toe</h3>
          <p className="text-xs text-slate-400">Turn: {isXNext ? '❌ Player X' : '⭕ Player O'}</p>
        </div>

        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-2xl bg-amber-400 text-black font-black text-xs shadow"
        >
          Reset
        </button>
      </div>

      {winner && (
        <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 font-black text-base animate-bounce">
          {winner === 'Draw' ? "It's a Draw! 🤝" : `🎉 Player ${winner} Wins! 🏆`}
        </div>
      )}

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto aspect-square">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`rounded-3xl border-2 flex items-center justify-center text-4xl font-black transition-all cursor-pointer ${
              cell === 'X' 
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : cell === 'O'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
