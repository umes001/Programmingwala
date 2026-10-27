import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldCheck, Flame, ArrowUp, ArrowDown, UserCheck, AlertOctagon, Sparkles } from 'lucide-react';
import { KBC_PRIZE_LADDER } from '../../data/kbcQuestions.js';

export default function ContestantPointsLeaderboard({
  players = [],
  currentLevel = 1,
  totalQuestions = 16,
  currentUserIndex = -1
}) {
  // Determine next safe padav milestone based on 16 or 30 questions
  const getNextSafePadav = (level, totalQ) => {
    const lvl = Math.max(1, parseInt(level, 10) || 1);
    const milestones = totalQ > 16 
      ? [5, 10, 15, 20, 25, 30]
      : [5, 10, 15, 16];
    
    const next = milestones.find(m => m >= lvl);
    if (!next) return null;
    const ladderItem = KBC_PRIZE_LADDER[next - 1] || { prize: `₹${next * 10000}` };
    const safePoints = (next * (next + 1) / 2) * 100;
    return {
      level: next,
      prize: ladderItem.prize,
      points: safePoints
    };
  };

  const nextSafe = getNextSafePadav(currentLevel, totalQuestions);
  const progressPercent = Math.min(100, Math.round((currentLevel / totalQuestions) * 100));

  // Count active vs out players
  const activeCount = players.filter(p => p.status !== 'OUT' && p.status !== 'ELIMINATED').length;
  const outCount = players.filter(p => p.status === 'OUT' || p.status === 'ELIMINATED').length;

  return (
    <div className="w-full bg-gradient-to-b from-[#0c102a]/95 via-[#080c21]/95 to-[#050819]/95 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-3.5">
      
      {/* ── LEADERBOARD HEADER ── */}
      <div className="space-y-2 border-b border-indigo-900/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Trophy className="w-4 h-4 font-black" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Live Points Leaderboard
              </h3>
              <p className="text-[10px] text-amber-400/80 font-mono">
                Real-time contestant standings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeCount} Active
            </span>
            {outCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {outCount} Out
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Question & Safe Padav Progress Indicator */}
        <div className="bg-[#12183a]/70 border border-indigo-500/30 rounded-2xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <span>Current:</span>
              <strong className="text-amber-300 font-mono text-xs">
                Question {currentLevel} of {totalQuestions}
              </strong>
            </span>
            <span className="font-mono text-xs font-bold text-indigo-300">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-indigo-900/60 p-[1px]">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* Next Safe Padav Pill */}
          {nextSafe && (
            <div className="flex items-center justify-between text-[10px] pt-0.5 text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Next Safe Padav:
              </span>
              <span className="font-mono font-bold text-amber-300">
                Q{nextSafe.level} ({nextSafe.prize} / {nextSafe.points} pts)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTESTANTS RANKED LIST (With Spring Layout Animation) ── */}
      <div className="space-y-2 max-h-[380px] sm:max-h-[460px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-indigo-900">
        <AnimatePresence>
          {players.map((p, idx) => {
            const rank = idx + 1;
            const isTop1 = rank === 1;
            const isTop2 = rank === 2;
            const isTop3 = rank === 3;
            const isOut = p.status === 'OUT' || p.status === 'ELIMINATED';

            return (
              <motion.div
                key={p.id}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative rounded-2xl p-2.5 sm:p-3 transition-all ${
                  p.isUser 
                    ? isOut
                      ? 'bg-gradient-to-r from-red-950/70 via-[#180a15]/80 to-slate-950/90 border-2 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : 'bg-gradient-to-r from-amber-950/60 via-[#1d1b46]/90 to-indigo-950/80 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
                    : isOut
                      ? 'bg-slate-950/60 border border-red-900/40 opacity-75'
                      : isTop1
                        ? 'bg-gradient-to-r from-[#211a05]/80 to-[#101432]/80 border border-amber-500/50 shadow-sm'
                        : 'bg-[#101538]/70 border border-indigo-900/40 hover:border-indigo-500/30'
                }`}
              >
                {/* User Highlight Ribbon */}
                {p.isUser && (
                  <div className="absolute -top-2 right-4 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" /> YOU
                  </div>
                )}

                <div className="flex items-center justify-between gap-2.5">
                  
                  {/* Left: Rank Badge + Avatar + Name */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center font-black text-xs ${
                      isTop1
                        ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30'
                        : isTop2
                          ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 shadow-sm'
                          : isTop3
                            ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-100'
                            : isOut
                              ? 'bg-red-950/80 text-red-400 border border-red-800/40'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {isTop1 ? '👑 1' : isTop2 ? '🥈 2' : isTop3 ? '🥉 3' : `#${rank}`}
                    </div>

                    {/* Avatar / Icon */}
                    <span className="text-base sm:text-lg shrink-0">
                      {isOut ? '💀' : p.avatar || '⚡'}
                    </span>

                    {/* Name + Status Tags */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          p.isUser ? 'text-amber-200 font-extrabold' : isOut ? 'text-slate-400 line-through' : 'text-white'
                        }`}>
                          {p.name}
                        </span>

                        {/* Rank delta indicator */}
                        {p.rankDelta > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center font-mono">
                            <ArrowUp className="w-2.5 h-2.5" />{p.rankDelta}
                          </span>
                        )}
                        {p.rankDelta < 0 && (
                          <span className="text-[10px] text-red-400 font-bold flex items-center font-mono">
                            <ArrowDown className="w-2.5 h-2.5" />{Math.abs(p.rankDelta)}
                          </span>
                        )}
                      </div>

                      {/* Sub-status label */}
                      <div className="flex items-center gap-1.5 text-[10px] pt-0.5">
                        {isOut ? (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold font-mono">
                            🔴 OUT (CUTOFF)
                          </span>
                        ) : (
                          <>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                              Q{p.currentLevel || 1}/{totalQuestions}
                            </span>
                            {p.status === 'HOTSEAT' && (
                              <span className="text-amber-400 flex items-center font-bold">
                                <Flame className="w-2.5 h-2.5 text-amber-400" /> Hotseat
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Points & Cutoff details */}
                  <div className="text-right shrink-0">
                    <div className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                      isOut 
                        ? 'text-red-400 line-through' 
                        : isTop1 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400' 
                          : 'text-amber-300'
                    }`}>
                      ⭐ {(p.points || 0).toLocaleString()} pts
                    </div>

                    {isOut ? (
                      <span className="text-[9px] text-red-400 font-mono block">
                        Cutoff Applied
                      </span>
                    ) : (
                      p.lastPointsGained > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold font-mono animate-pulse block">
                          +{p.lastPointsGained} pts
                        </span>
                      )
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── FOOTER: Safe Padav & Cutoff Rule Note ── */}
      <div className="pt-2 border-t border-indigo-900/40 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {totalQuestions > 16 
            ? 'Safe Padavs: Q5 (1,500 pts), Q10 (5,500 pts), Q15 (12,000 pts)...'
            : 'Safe Padavs: Q5 (1,500 pts), Q10 (5,500 pts), Q15 (12,000 pts)'}
        </span>
        <span className="text-red-400/90 font-mono text-[9px]">
          *Wrong answer = Points Cutoff
        </span>
      </div>

    </div>
  );
}
