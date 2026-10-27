import React from 'react';
import { Monitor, ShieldCheck, HeartPulse, Bus, BookOpen, ToyBrick, School, Cpu } from 'lucide-react';

export default function Facilities() {
  const facilityList = [
    {
      title: 'Smart Classrooms',
      desc: 'All classrooms are air-conditioned and feature touch visual screens, interactive audio units, and toddler-proof curved furniture layouts.',
      icon: Monitor,
      color: 'bg-brandSky/10 text-brandSky-dark border-brandSky/30'
    },
    {
      title: 'Theme Play Area',
      desc: 'Featuring specialized rubber flooring, padded slides, safety swings, a sandbox pool, and climbing towers designed for fine motor skill gains.',
      icon: ToyBrick,
      color: 'bg-brandYellow/10 text-brandYellow-dark border-brandYellow/30'
    },
    {
      title: 'CCTV Security Coverage',
      desc: '24/7 security guard presence combined with camera feeds tracking all entry gates, play areas, classrooms, and cafeteria halls.',
      icon: ShieldCheck,
      color: 'bg-red-50 text-red-600 border-red-100'
    },
    {
      title: 'Safe Bus Transport',
      desc: 'Modern school buses equipped with tracking GPS units, speed governors, female care attendants, and automated SMS alerts to parents on pick-up/drop.',
      icon: Bus,
      color: 'bg-brandMint/10 text-brandMint-dark border-brandMint/30'
    },
    {
      title: 'Medical Care Room',
      desc: 'In-house certified pediatrician nurse available during school hours, first aid stations in every hall, and emergency tie-up hospitals.',
      icon: HeartPulse,
      color: 'bg-brandCoral/10 text-brandCoral-dark border-brandCoral/30'
    },
    {
      title: 'Early Years Library',
      desc: 'A colorful room with hundreds of tactile board books, audio stories, pop-up books, and cozy floor pillows to foster initial reading habits.',
      icon: BookOpen,
      color: 'bg-brandLavender/10 text-brandLavender-dark border-brandLavender/30'
    },
    {
      title: 'Creative Activity Rooms',
      desc: 'Dedicated spaces for clay sculpting, canvas painting, musical instruments classes (xylophones, drums), and theatrical drama plays.',
      icon: School,
      color: 'bg-orange-50 text-orange-600 border-orange-100'
    },
    {
      title: 'Kids Computer Lab',
      desc: 'Featuring tablets and touch monitors with specialized early years logic reasoning puzzles, basic coding animations, and digital drawing tools.',
      icon: Cpu,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-brandCoral font-bold text-xs uppercase tracking-widest bg-brandCoral/10 px-3 py-1 rounded-full border border-brandCoral/20">INFRASTRUCTURE</span>
        <h1 className="text-4xl font-quicksand font-bold text-slate-800">Our Facilities & Security</h1>
        <p className="text-sm text-slate-500">
          We maintain premium environment specifications to keep children healthy, protected, and intellectually active throughout their day.
        </p>
      </div>

      {/* Facilities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {facilityList.map((fac, idx) => (
          <div key={idx} className="bg-white border border-orange-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${fac.color}`}>
                <fac.icon className="w-6 h-6" />
              </div>
              <h3 className="font-quicksand font-bold text-lg text-slate-800">{fac.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Campus Tour CTA */}
      <section className="bg-[#FAF8F5] border border-orange-50 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2 text-left">
          <h3 className="font-quicksand font-bold text-2xl text-slate-800">Want to see our campus in person?</h3>
          <p className="text-xs text-slate-500 max-w-lg">
            We hold parents campus tours every Saturday morning. Schedule a slots to see classrooms, meet the faculty, and evaluate safety locks.
          </p>
        </div>
        <div className="md:col-span-4 text-left md:text-right">
          <a
            href="/contact"
            className="inline-block bg-brandYellow hover:bg-brandYellow-dark text-slate-800 font-quicksand font-bold text-sm px-6 py-3 rounded-full transition-all shadow-sm"
          >
            SCHEDULE CAMPUS TOUR →
          </a>
        </div>
      </section>

    </div>
  );
}
