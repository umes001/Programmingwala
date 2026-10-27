import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Stage Laser Lighting (Aurora Cobalt & Aurora Crimson Edition)
 * Inspired by high-end concert laser rigs (X-Laser Aurora Cobalt / Crimson).
 * 
 * Behaviors:
 * 1. Ambient: 6 thick, vibrant cobalt blue beams swaying continuously (smooth, 60 FPS).
 * 2. New Question: Sweeps up and holds there.
 * 3. Correct Answer: Moves up to middle -> flickers -> moves down -> flickers -> moves up.
 * 4. Wrong Answer: Red light moves SLOWLY DOWN with FLICKER over 3 SECONDS, then stops and holds!
 */
export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false,
  isWrongAnswer = false
}) {
  const [isQuestionHeldUp, setIsQuestionHeldUp] = useState(false);

  // When new question arrives, hold lasers high for a moment then resume ambient
  useEffect(() => {
    if (triggerUpwardSweep) {
      setIsQuestionHeldUp(true);
      const timer = setTimeout(() => {
        setIsQuestionHeldUp(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [triggerUpwardSweep]);

  // ── 1. Six Thick High-Power Floor Beams (Optimized for butter-smooth 60 FPS) ──
  const floorBeams = useMemo(() => [
    // Station 1: Left (~22%)
    { id: 1, baseLeft: '22%', baseAngle: -38, sweepUpAngle: -16, downAngle: -55, ambientRange: [-44, -30], delay: 0 },
    { id: 2, baseLeft: '22%', baseAngle: 22,  sweepUpAngle: 10,  downAngle: 36,  ambientRange: [16, 28],   delay: 0.15 },

    // Station 2: Center (~50%)
    { id: 3, baseLeft: '50%', baseAngle: -16, sweepUpAngle: -6,  downAngle: -28, ambientRange: [-22, -10], delay: 0.3 },
    { id: 4, baseLeft: '50%', baseAngle: 16,  sweepUpAngle: 6,   downAngle: 28,  ambientRange: [10, 22],   delay: 0.1 },

    // Station 3: Right (~78%)
    { id: 5, baseLeft: '78%', baseAngle: -22, sweepUpAngle: -10, downAngle: -36, ambientRange: [-28, -16], delay: 0.2 },
    { id: 6, baseLeft: '78%', baseAngle: 38,  sweepUpAngle: 16,  downAngle: 55,  ambientRange: [30, 44],   delay: 0.35 }
  ], []);

  // ── 2. Four Overhead Downward Red Lasers (Active on Wrong Answer) ──
  const overheadDownwardBeams = useMemo(() => [
    { id: 'top-1', left: '20%', angle: 36, delay: 0 },
    { id: 'top-2', left: '28%', angle: 20, delay: 0.1 },
    { id: 'top-3', left: '72%', angle: -20, delay: 0.1 },
    { id: 'top-4', left: '80%', angle: -36, delay: 0 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">

      {/* ── Floor Stage Ambient Glow (Clean, hardware-accelerated) ── */}
      <div 
        className={`absolute -bottom-8 left-0 right-0 h-28 blur-xl pointer-events-none transition-colors duration-700 ${
          isWrongAnswer
            ? 'bg-gradient-to-t from-red-950/70 via-red-900/30 to-transparent'
            : 'bg-gradient-to-t from-blue-950/50 via-blue-900/15 to-transparent'
        }`}
      />

      {/* 3 Floor Projector Bases */}
      {[22, 50, 78].map((pos) => (
        <div
          key={pos}
          style={{ left: `${pos}%` }}
          className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
        >
          {/* Intense Projector Spot Lens */}
          <div 
            className={`w-6 h-3 rounded-full transition-all duration-500 ${
              isWrongAnswer
                ? 'bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#ef4444]'
                : 'bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#38bdf8]'
            }`}
          />
          <div 
            className={`w-12 h-5 -mt-1 rounded-full blur-sm transition-colors duration-500 ${
              isWrongAnswer ? 'bg-red-500/60' : 'bg-cyan-500/50'
            }`}
          />
        </div>
      ))}

      {/* ── 6 THICK, SMOOTH HIGH-POWER FLOOR BEAMS ── */}
      {floorBeams.map((beam) => {
        let targetAngle;
        let targetOpacity;
        let targetScaleY;
        let transitionConfig;

        if (isWrongAnswer) {
          // ── WRONG ANSWER: Move SLOWLY DOWN with FLICKER in 3 SECONDS, then STOP ──
          targetAngle = [beam.baseAngle, beam.downAngle];
          targetOpacity = [1, 0.35, 1, 0.2, 0.9, 0.25, 1, 0.4, 0.9, 0.3, 1];
          targetScaleY = [1, 1.12];
          transitionConfig = {
            rotate: { duration: 3.0, ease: 'easeInOut' },
            scaleY: { duration: 3.0, ease: 'easeOut' },
            opacity: { 
              duration: 3.0, 
              times: [0, 0.1, 0.2, 0.35, 0.48, 0.62, 0.74, 0.82, 0.9, 0.96, 1.0], 
              ease: 'linear' 
            }
          };
        } else if (isCelebratingCorrect) {
          // ── CORRECT CELEBRATION: Move up to middle -> flicker -> move down -> flicker -> move up ──
          const midAngle = beam.sweepUpAngle * 0.4;
          const downAngle = beam.baseAngle * 1.35;
          const finalUpAngle = beam.sweepUpAngle * 0.8;

          targetAngle = [
            beam.baseAngle,
            midAngle,
            midAngle,
            downAngle,
            downAngle,
            finalUpAngle
          ];
          targetScaleY = [1, 1.15, 1.25, 0.85, 0.8, 1.2];
          targetOpacity = [0.9, 1, 0.25, 1, 0.25, 1];
          transitionConfig = {
            duration: 4.2,
            times: [0, 0.2, 0.35, 0.65, 0.8, 1],
            ease: 'easeInOut'
          };
        } else if (isQuestionHeldUp) {
          // ── NEW QUESTION: Sweeps up and stops/holds right there ──
          targetAngle = beam.sweepUpAngle;
          targetOpacity = 1.0;
          targetScaleY = 1.15;
          transitionConfig = {
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1]
          };
        } else {
          // ── NORMAL AMBIENT: Continuous smooth swaying (NEVER disappears) ──
          targetAngle = [beam.ambientRange[0], beam.ambientRange[1], beam.ambientRange[0]];
          targetOpacity = [0.95, 1.0, 0.95];
          targetScaleY = 1;
          transitionConfig = {
            duration: 5.5 + beam.delay * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: beam.delay
          };
        }

        return (
          <motion.div
            key={beam.id}
            style={{
              left: beam.baseLeft,
              bottom: 0,
              transformOrigin: 'bottom center',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            animate={{
              rotate: targetAngle,
              opacity: targetOpacity,
              scaleY: targetScaleY
            }}
            transition={transitionConfig}
            className="absolute h-[145vh] pointer-events-none flex items-center justify-center -translate-x-1/2"
          >
            {/* 1. Outer Electric Glow Mantle (Thick & Vibrant) */}
            <div 
              className={`absolute w-8 sm:w-11 h-full blur-[4px] pointer-events-none transition-colors duration-500 ${
                isWrongAnswer
                  ? 'bg-gradient-to-t from-red-600/90 via-rose-500/70 to-red-600/30 shadow-[0_0_30px_#ff0033]'
                  : 'bg-gradient-to-t from-cyan-400/90 via-sky-400/70 to-blue-500/30 shadow-[0_0_30px_#00e5ff]'
              }`}
            />

            {/* 2. Thick, Solid Piercing Laser Beam Shaft (Noticeably Thicker) */}
            <div 
              className="relative w-4 sm:w-5 h-full pointer-events-none"
              style={{
                background: isWrongAnswer
                  ? 'linear-gradient(90deg, #ff0033 0%, rgba(255,50,80,0.8) 15%, #ffffff 42%, #ffffff 58%, rgba(255,50,80,0.8) 85%, #ff0033 100%)'
                  : 'linear-gradient(90deg, #00b4d8 0%, rgba(0,229,255,0.8) 15%, #ffffff 42%, #ffffff 58%, rgba(0,229,255,0.8) 85%, #00b4d8 100%)',
                boxShadow: isWrongAnswer
                  ? '0 0 12px #ffffff, 0 0 25px #ef4444, 0 0 45px #dc2626'
                  : '0 0 12px #ffffff, 0 0 25px #38bdf8, 0 0 45px #0284c7'
              }}
            />

            {/* 3. Solid White-Hot Central Filament */}
            <div className="absolute w-1.5 sm:w-2 h-full bg-white shadow-[0_0_10px_#ffffff] pointer-events-none" />

            {/* 4. Floor Emitter Spark */}
            <div 
              className={`absolute bottom-0 w-4 h-4 rounded-full bg-white -translate-y-1 transition-all duration-500 ${
                isWrongAnswer 
                  ? 'shadow-[0_0_20px_#ffffff,0_0_35px_#ef4444]' 
                  : 'shadow-[0_0_20px_#ffffff,0_0_35px_#38bdf8]'
              }`}
            />
          </motion.div>
        );
      })}

      {/* ── 3. OVERHEAD HIGH-POWER DOWNWARD RED LASER RIG (Active on Wrong Answer) ── */}
      {isWrongAnswer && overheadDownwardBeams.map((beam) => (
        <motion.div
          key={beam.id}
          initial={{ scaleY: 0, opacity: 0, rotate: beam.angle }}
          animate={{ 
            scaleY: [0, 0.35, 0.7, 1.0, 1.15],
            opacity: [0.2, 1, 0.3, 0.9, 0.2, 1, 0.35, 1, 0.4, 1]
          }}
          transition={{ 
            scaleY: { duration: 3.0, ease: 'easeInOut' },
            opacity: { 
              duration: 3.0, 
              times: [0, 0.12, 0.25, 0.4, 0.55, 0.68, 0.78, 0.88, 0.95, 1.0], 
              ease: 'linear' 
            }
          }}
          style={{
            left: beam.left,
            top: 0,
            transformOrigin: 'top center',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
          className="absolute h-[155vh] pointer-events-none flex items-center justify-center -translate-x-1/2 z-20"
        >
          {/* Overhead Projector Lens Spark at Top */}
          <div className="absolute top-0 w-5 h-5 rounded-full bg-white shadow-[0_0_25px_#ffffff,0_0_45px_#ef4444] -translate-y-1" />

          {/* Thick Red Glow Aura */}
          <div className="absolute w-8 sm:w-11 h-full bg-gradient-to-b from-red-500 via-rose-500 to-red-600/60 blur-[4px] pointer-events-none shadow-[0_0_30px_#ff0033]" />

          {/* Thick Piercing Laser Beam Shaft */}
          <div 
            className="relative w-4 sm:w-5 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #ff0033 0%, rgba(255,50,80,0.8) 15%, #ffffff 42%, #ffffff 58%, rgba(255,50,80,0.8) 85%, #ff0033 100%)',
              boxShadow: '0 0 12px #ffffff, 0 0 25px #ef4444, 0 0 45px #dc2626'
            }}
          />

          {/* Solid White-Hot Filament */}
          <div className="absolute w-1.5 sm:w-2 h-full bg-white shadow-[0_0_10px_#ffffff] pointer-events-none" />

          {/* Floor Impact Spot */}
          <div className="absolute bottom-12 w-12 h-5 rounded-full bg-red-400/60 blur-[3px] pointer-events-none shadow-[0_0_25px_#ef4444]" />
        </motion.div>
      ))}

      {/* ── CELEBRATION WHOLE-STAGE STROBE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [
              0,
              0.5, 0.05, 0.75, 0.1, 0.6, 0.05, 0.2,
              0.7, 0.05, 0.8, 0.1, 0.65, 0.05, 0.35, 0
            ]
          }}
          transition={{ duration: 4.2, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/30 via-blue-500/15 to-transparent mix-blend-screen pointer-events-none z-30"
        />
      )}

    </div>
  );
}
