import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Yes, Confirm', 
  cancelText = 'No, Cancel', 
  type = 'submit' 
}) {
  
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return (
          <svg className="w-6 h-6 text-rose-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'logout':
        return (
          <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case 'submit':
      default:
        return (
          <svg className="w-6 h-6 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getConfirmBtnColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-rose-500 hover:bg-rose-600';
      case 'logout':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'submit':
      default:
        return 'bg-emerald-500 hover:bg-emerald-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.85, rotate: -2, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              transition: { type: 'spring', stiffness: 320, damping: 18 }
            }}
            exit={{ 
              scale: 0.85, 
              rotate: 2, 
              opacity: 0,
              transition: { duration: 0.15 } 
            }}
            className="bg-white border-[5px] border-white rounded-[2rem] w-full max-w-[280px] p-5 shadow-2xl relative text-slate-800 text-center space-y-3"
          >
            {/* Mascot/Icon Container */}
            <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center mx-auto shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.05)]">
              {getIcon()}
            </div>

            {/* Content Text */}
            <div className="space-y-1">
              <h4 className="font-quicksand font-bold text-slate-800 text-sm leading-snug">
                {title}
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal font-medium font-sans max-w-[220px] mx-auto">
                {message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-[0.97] cursor-pointer select-none"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 py-2 px-3 rounded-xl text-white transition-all active:scale-[0.97] cursor-pointer shadow-sm select-none ${getConfirmBtnColor()}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

