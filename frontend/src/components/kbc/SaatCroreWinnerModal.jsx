import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, Volume2, X, Star } from 'lucide-react';
import { kbcAudio } from '../../utils/kbcAudio.js';

export default function SaatCroreWinnerModal({ winner, onClose, isCurrentPlayer = false }) {
  useEffect(() => {
    // Grand celebration confetti burst on mount
    try {
      const duration = 4000;
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 35,
          spread: 360,
          ticks: 80,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#ef4444', '#10b981', '#3b82f6', '#ffffff']
        });
      }, 300);
      return () => clearInterval(interval);
    } catch (e) {}
  }, []);

  if (!winner) return null;

  const playerName = winner.leader_name || winner.team_name || 'Champion';
  const teamName = winner.team_name || 'Team KBC';
  const points = winner.points !== undefined ? winner.points : 0;
  const correctCount = winner.correct_count !== undefined ? winner.correct_count : 0;
  const prize = winner.prizeLabel || winner.winner_prize || (winner.score_amount ? `₹${winner.score_amount.toLocaleString('en-IN')}` : '₹7 Crore');

  const handleReplayAudio = () => {
    kbcAudio.playHighPoints();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-black border-4 border-amber-400/90 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.5)] overflow-hidden">
        
        {/* Glowing Background Radial Highlights */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-10"
          title="Close celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 animate-pulse">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{isCurrentPlayer ? '🎉 YOU ARE THE TOP SCORER! 🎉' : '🏆 KBC TOURNAMENT TOP SCORER 🏆'}</span>
        </div>

        {/* Amitabh Bachchan "SAAT CRORE!!" Meme Visual */}
        <div className="relative mx-auto my-2 w-44 h-44 sm:w-48 sm:h-48">
          {/* Animated Gold Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/60 animate-spin [animation-duration:15s]" />
          
          {/* Picture of Amitabh Bachchan Host */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl shadow-amber-500/50 bg-slate-900">
            <img
              src="/kbc-host.jpg"
              alt="Amitabh Bachchan - Saat Crore Meme"
              className="w-full h-full object-cover object-top scale-105 hover:scale-110 transition duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Comic Meme Shoutout Badge: "SAAT CRORE!!" */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-max px-4 py-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-2 border-yellow-200 rounded-xl shadow-xl shadow-red-600/50 transform -rotate-2 hover:rotate-0 transition">
            <span className="text-sm sm:text-base font-black text-yellow-100 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-1">
              💥 SAAT CRORE!! 💥
            </span>
          </div>
        </div>

        {/* Winner Name in Large Golden Letters */}
        <div className="mt-5 space-y-1">
          <p className="text-xs uppercase tracking-widest text-amber-300/80 font-bold">
            Maximum Points Leader
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-wide drop-shadow-md">
            👑 {playerName} 👑
          </h2>
          <p className="text-sm font-bold text-slate-300">
            Team: <span className="text-cyan-400">{teamName}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4 max-w-sm mx-auto">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 shadow-inner">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold uppercase mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Max Points
            </div>
            <div className="text-xl sm:text-2xl font-black text-yellow-300 font-mono">
              {points.toLocaleString('en-IN')} <span className="text-xs text-amber-400/80 font-sans">PTS</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3 shadow-inner">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold uppercase mb-1">
              <Award className="w-3.5 h-3.5" /> Prize Value
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-300 font-mono leading-7">
              {prize}
            </div>
          </div>
        </div>

        {correctCount > 0 && (
          <p className="text-xs text-emerald-400 font-medium">
            ✔ Answered {correctCount} questions correctly with precision!
          </p>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={handleReplayAudio}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Volume2 className="w-4 h-4" /> Replay "Saat Crore!"
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
