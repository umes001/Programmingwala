import React from 'react';

/**
 * PortfolioSlicedImage
 * Replicates the multi-layer diagonal geometric sliced slat mask with 3D drop-shadows
 * and tinted accent ribbon bands from the reference design.
 * 
 * Supports theme colors:
 * - terracotta (reference design): warm clay (#c87a5a), sand (#b89d87), charcoal (#1f2024)
 * - amber: warm amber (#f59e0b), gold (#eab308), slate (#0f172a)
 * - obsidian: burnished gold (#fbbf24), dark bronze (#78350f), midnight (#09090b)
 * - emerald: emerald (#10b981), sage (#059669), deep forest (#064e3b)
 */
export default function PortfolioSlicedImage({
  photoUrl,
  theme = 'terracotta',
  zoom = 1,
  panX = 0,
  panY = 0,
  className = ''
}) {
  const defaultPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85';
  const activePhoto = photoUrl || defaultPhoto;

  // Theme palettes for ribbons and shadows
  const palettes = {
    terracotta: {
      ribbon1: '#a37b67', // muted clay / sand
      ribbon2: '#c97a5b', // warm terracotta
      ribbon3: '#1a191d', // dark charcoal
      ribbon4: '#7e5a48', // deep clay
      shadow: 'rgba(50, 30, 20, 0.28)'
    },
    amber: {
      ribbon1: '#fbbf24', // yellow amber
      ribbon2: '#d97706', // deep amber
      ribbon3: '#0f172a', // dark slate
      ribbon4: '#b45309', // burnished bronze
      shadow: 'rgba(217, 119, 6, 0.25)'
    },
    obsidian: {
      ribbon1: '#f59e0b', // gold
      ribbon2: '#78350f', // bronze
      ribbon3: '#09090b', // obsidian
      ribbon4: '#451a03', // dark umber
      shadow: 'rgba(0, 0, 0, 0.5)'
    },
    emerald: {
      ribbon1: '#34d399', // bright mint
      ribbon2: '#059669', // rich emerald
      ribbon3: '#022c22', // deep forest
      ribbon4: '#047857', // forest green
      shadow: 'rgba(5, 150, 105, 0.25)'
    }
  };

  const p = palettes[theme] || palettes.terracotta;

  // Diagonal clip path polygons for 5 parallel slats (-28 deg aesthetic slope)
  // Each polygon coordinates: [top-left, top-right, bottom-right, bottom-left]
  const slats = [
    {
      id: 'slat-1',
      clip: 'polygon(0% 0%, 100% 0%, 100% 21%, 0% 41%)',
      offsetX: 0,
      offsetY: 0,
      zIndex: 10
    },
    {
      id: 'slat-2',
      clip: 'polygon(0% 24%, 100% 4%, 100% 39%, 0% 59%)',
      offsetX: -4,
      offsetY: 0,
      zIndex: 14
    },
    {
      id: 'slat-3',
      clip: 'polygon(0% 42%, 100% 22%, 100% 58%, 0% 78%)',
      offsetX: 0,
      offsetY: 0,
      zIndex: 18
    },
    {
      id: 'slat-4',
      clip: 'polygon(0% 61%, 100% 41%, 100% 77%, 0% 97%)',
      offsetX: 5,
      offsetY: 0,
      zIndex: 14
    },
    {
      id: 'slat-5',
      clip: 'polygon(0% 80%, 100% 60%, 100% 100%, 0% 100%)',
      offsetX: -2,
      offsetY: 0,
      zIndex: 10
    }
  ];

  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      
      {/* ─── STAGE CONTAINER ────────────────────────────────────────── */}
      <div className="relative w-[300px] sm:w-[360px] md:w-[410px] aspect-[1/1.42] flex items-center justify-center">

        {/* ─── BACKGROUND GEOMETRIC ACCENT RIBBONS (poking out) ───────── */}
        
        {/* Top-Right Upper Ribbon (Clay/Sand) */}
        <div
          className="absolute -top-5 right-2 w-28 h-48 rounded-sm pointer-events-none opacity-90 transition-all duration-500"
          style={{
            backgroundColor: p.ribbon1,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 0% 90%)',
            boxShadow: `0 12px 25px ${p.shadow}`
          }}
        />

        {/* Left Mid-Upper Ribbon (Warm Terracotta - prominent in reference) */}
        <div
          className="absolute top-[23%] -left-8 sm:-left-12 w-40 sm:w-48 h-28 rounded-sm pointer-events-none opacity-95 transition-all duration-500 z-12"
          style={{
            backgroundColor: p.ribbon2,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 20%, 100% 0%, 100% 70%, 0% 95%)',
            boxShadow: `0 16px 30px ${p.shadow}`
          }}
        />

        {/* Bottom-Left Lower Ribbon (Terracotta / Dark) */}
        <div
          className="absolute bottom-[16%] -left-6 w-32 h-24 rounded-sm pointer-events-none opacity-95 transition-all duration-500 z-12"
          style={{
            backgroundColor: p.ribbon2,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 15%, 100% 0%, 100% 80%, 0% 100%)',
            boxShadow: `0 12px 24px ${p.shadow}`
          }}
        />

        {/* Right Mid Accent Ribbon (Sand/Muted) */}
        <div
          className="absolute top-[34%] -right-7 sm:-right-10 w-36 sm:w-44 h-24 rounded-sm pointer-events-none opacity-90 transition-all duration-500 z-10"
          style={{
            backgroundColor: p.ribbon1,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 0%, 100% 20%, 100% 90%, 0% 70%)',
            boxShadow: `0 12px 24px ${p.shadow}`
          }}
        />

        {/* Right Lower Triangular Slat (Warm Taupe/Clay) */}
        <div
          className="absolute bottom-[20%] -right-8 sm:-right-12 w-32 sm:w-40 h-28 rounded-sm pointer-events-none opacity-90 transition-all duration-500 z-10"
          style={{
            backgroundColor: p.ribbon4 || p.ribbon1,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 0%, 100% 30%, 100% 90%, 0% 65%)',
            boxShadow: `0 12px 24px ${p.shadow}`
          }}
        />

        {/* ─── SLICED PHOTO LAYERS ────────────────────────────────────── */}
        <div className="relative w-full h-full">
          {slats.map((slat, idx) => (
            <div
              key={slat.id}
              className="absolute inset-0 transition-transform duration-300 pointer-events-none"
              style={{
                zIndex: slat.zIndex,
                transform: `translate(${slat.offsetX}px, ${slat.offsetY}px)`,
                filter: `drop-shadow(0 14px 20px ${p.shadow})`
              }}
            >
              <div
                className="w-full h-full overflow-hidden"
                style={{
                  clipPath: slat.clip
                }}
              >
                {/* Underlay shadow edge for 3D slat separation */}
                <div 
                  className="w-full h-full relative"
                  style={{
                    backgroundColor: '#18181b'
                  }}
                >
                  <img
                    src={activePhoto}
                    alt="Portfolio Portrait"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    style={{
                      transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out'
                    }}
                    loading="eager"
                  />
                  {/* Subtle tonal film overlay matching theme mood */}
                  <div
                    className="absolute inset-0 mix-blend-soft-light opacity-20 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${p.ribbon2}, ${p.ribbon1})`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── BOTTOM ACCENT GEOMETRIC CHIP (Dark Charcoal block) ───── */}
        <div
          className="absolute -bottom-5 left-[24%] w-36 h-28 rounded-sm pointer-events-none opacity-95 transition-all duration-500 z-11"
          style={{
            backgroundColor: p.ribbon3,
            transform: 'skewY(-22deg)',
            clipPath: 'polygon(0% 20%, 100% 0%, 100% 85%, 0% 100%)',
            boxShadow: `0 18px 30px ${p.shadow}`
          }}
        />

      </div>

    </div>
  );
}
