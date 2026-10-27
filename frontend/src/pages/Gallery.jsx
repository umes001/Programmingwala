import React, { useEffect, useState } from 'react';
import { Eye, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/public/gallery?category=${filter}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItems(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [filter]);

  const categories = [
    { name: 'ALL', value: 'all' },
    { name: 'CLASSROOMS', value: 'classroom' },
    { name: 'EVENTS', value: 'events' },
    { name: 'SPORTS', value: 'sports' },
    { name: 'CELEBRATIONS', value: 'celebrations' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-12 space-y-8 select-none">
      
      {/* ── MASTER CANVAS CONTAINER (Crextio Golden-Butter Theme) ── */}
      <div className="bg-gradient-to-br from-[#faf8f2] via-[#fbf7eb] to-[#fdf2d2] rounded-[38px] border border-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10 space-y-8">
        
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#1c1d21] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>MEMORIES & MOMENTS</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Photo & Video Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A glimpse into the daily life, creative coding sessions, celebrations, and achievements of our young scholars and trainees.
          </p>
        </div>

        {/* Filter Segmented Pill Menu */}
        <div className="flex justify-center">
          <div className="bg-white/70 border border-slate-200/80 p-1.5 rounded-full flex flex-wrap items-center justify-center gap-1.5 shadow-sm backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-full font-sans font-bold text-xs transition-all cursor-pointer ${
                  filter === cat.value
                    ? 'bg-[#1c1d21] text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-slate-900 rounded-full" />
            <p className="mt-3 text-xs text-slate-500 font-bold">Loading albums...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white/70 border border-white rounded-3xl p-8">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="mt-3 text-sm text-slate-600 font-bold">No media items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <motion.div
                layout
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white/80 border border-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="overflow-hidden relative h-56 bg-slate-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <Eye className="w-5 h-5 text-slate-900" />
                    </div>
                  </div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-[#1c1d21]/90 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 bg-white/90 flex flex-col justify-between">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                    <span>{new Date(item.date).toLocaleDateString('en-GB')}</span>
                    <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform">View Media ↗</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-[#161a23] text-white rounded-[32px] overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-700 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition-colors z-10 cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-[320px] md:h-[480px] bg-black/90 flex items-center justify-center">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-2 bg-[#161a23]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedItem.description || 'Appletree Infotech Program & Creative Session Highlights.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
