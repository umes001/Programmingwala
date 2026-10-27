import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, X, Star } from 'lucide-react';

export default function MovingLeaderboardModal({
  players = [],
  onClose,
  currentUserTeam = null,
  currentLevel = 1,
  isAdmin = false
}) {
  // Use session participants provided from displayPlayers
  const sessionPlayers = Array.isArray(players) ? players : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border"
        style={{
          background: 'linear-gradient(180deg, rgba(11, 19, 43, 0.98) 0%, rgba(6, 10, 26, 0.98) 100%)',
          borderColor: 'rgba(251, 191, 36, 0.65)',
          color: '#ffffff'
        }}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-20"
            title="Dismiss Leaderboard"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Compact Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50 mb-3 relative z-10 pr-7">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                Live Session Leaderboard
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                {sessionPlayers.length} active player{sessionPlayers.length === 1 ? '' : 's'} in room
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
            Q{currentLevel}
          </span>
        </div>

        {/* Compact Players List with Framer Motion Spring Layout Reordering */}
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-0.5 relative z-10">
          {sessionPlayers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Waiting for participating players to submit answers...
            </div>
          ) : (
            <AnimatePresence>
              {sessionPlayers.map((player, index) => {
                const rank = index + 1;
                const isUser = player.isUser;
                const gainedPoints = player.lastPointsGained > 0;
                const rankDelta = player.rankDelta || 0;

                return (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 26,
                      mass: 0.7
                    }}
                    style={{
                      background: isUser
                        ? 'linear-gradient(135deg, rgba(8, 47, 73, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : rank === 1
                        ? 'linear-gradient(135deg, rgba(120, 53, 15, 0.6) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : gainedPoints
                        ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.65) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      border: isUser
                        ? '1.5px solid #22d3ee'
                        : rank === 1
                        ? '1px solid rgba(251, 191, 36, 0.7)'
                        : gainedPoints
                        ? '1px solid rgba(52, 211, 153, 0.6)'
                        : '1px solid rgba(71, 85, 105, 0.35)',
                      boxShadow: isUser
                        ? '0 0 14px rgba(6, 182, 212, 0.35)'
                        : 'none',
                      color: '#ffffff'
                    }}
                    className="flex items-center justify-between p-2 rounded-xl transition-all"
                  >
                    {/* Left: Rank & Player info */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`w-6 h-6 rounded-md font-black font-mono text-[11px] flex items-center justify-center shrink-0 ${
                          rank === 1 ? 'bg-amber-400 text-slate-950 font-black shadow-sm' :
                          rank === 2 ? 'bg-slate-200 text-slate-950' :
                          rank === 3 ? 'bg-amber-700 text-amber-100' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="font-bold text-xs truncate max-w-[130px] sm:max-w-[160px]"
                            style={{ color: isUser ? '#38bdf8' : '#ffffff' }}
                          >
                            {player.name}
                          </span>
                          {isUser && (
                            <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-sm">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] flex items-center gap-1.5 text-slate-400">
                          <span className="text-slate-300">{player.correctCount || 0} Correct</span>
                          <span>•</span>
                          {player.status === 'OUT' || player.status === 'ELIMINATED' ? (
                            <span className="text-red-400 font-medium">🔴 Cutoff</span>
                          ) : (
                            <span className="text-emerald-400 font-medium">🟢 Live</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Rank Movement & Points */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Movement indicator */}
                      <div className="w-12 text-center">
                        {rankDelta > 0 ? (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                            <ArrowUp className="w-3 h-3 stroke-[3]" /> +{rankDelta}
                          </span>
                        ) : rankDelta < 0 ? (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black">
                            <ArrowDown className="w-3 h-3 stroke-[3]" /> {rankDelta}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-mono">-</span>
                        )}
                      </div>

                      {/* Points */}
                      <div className="text-right min-w-[65px]">
                        <div className={`text-xs font-black font-mono ${
                          player.status === 'OUT' || player.status === 'ELIMINATED'
                            ? 'text-red-400 line-through'
                            : 'text-amber-400'
                        }`}>
                          {(player.points || 0).toLocaleString()} <span className="text-[9px] font-sans text-amber-300/80">pts</span>
                        </div>
                        {gainedPoints && (
                          <span className="text-[10px] font-black text-emerald-400 flex items-center justify-end gap-0.5">
                            <ArrowUp className="w-2.5 h-2.5 stroke-[3]" /> +{player.lastPointsGained}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Compact Footer */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
          <span>Auto-closes when next question arrives</span>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] cursor-pointer transition border border-slate-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
