import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetch('/api/public/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const eventTypes = [
    { name: 'ALL EVENTS', value: 'all' },
    { name: 'PTM MEETS', value: 'ptm' },
    { name: 'HOLIDAYS', value: 'holiday' },
    { name: 'EXAMS', value: 'exam' },
    { name: 'CELEBRATIONS', value: 'celebration' }
  ];

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'holiday': return 'bg-red-50 text-red-600 border border-red-100';
      case 'ptm': return 'bg-brandSky/10 text-brandSky-dark border border-brandSky/30';
      case 'exam': return 'bg-brandLavender/10 text-brandLavender-dark border border-brandLavender/30';
      default: return 'bg-brandYellow/10 text-brandYellow-dark border border-brandYellow/30';
    }
  };

  const filteredEvents = filterType === 'all'
    ? events
    : events.filter(ev => ev.type === filterType);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-brandCoral font-bold text-xs uppercase tracking-widest bg-brandCoral/10 px-3 py-1 rounded-full border border-brandCoral/20">SCHOOL TIMELINE</span>
        <h1 className="text-4xl font-quicksand font-bold text-slate-800">School Calendar & Events</h1>
        <p className="text-sm text-slate-500">
          Stay aligned on examination schedules, holidays, upcoming field trips, and Parent-Teacher Meetings (PTMs).
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {eventTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilterType(t.value)}
            className={`px-4 py-2 rounded-full font-quicksand font-bold text-xs transition-all border ${
              filterType === t.value
                ? 'bg-brandCoral text-white border-brandCoral shadow-sm'
                : 'bg-white text-slate-600 border-orange-50 hover:bg-orange-50/20'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-brandCoral rounded-full" />
          <p className="mt-2 text-xs text-slate-500 font-quicksand">Fetching calendar logs...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white border border-orange-50 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="mt-2 text-sm text-slate-500 font-quicksand">No matching calendar entries found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const startDate = new Date(ev.startDate);
            const endDate = new Date(ev.endDate);
            const month = startDate.toLocaleString('en-US', { month: 'short' });
            const day = startDate.getDate();
            const year = startDate.getFullYear();

            return (
              <div
                key={ev._id}
                className="bg-white border border-orange-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 items-stretch"
              >
                {/* Date Plate */}
                <div className="md:w-28 flex flex-col items-center justify-center bg-brandCream rounded-xl border border-orange-100/50 p-3 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-brandCoral tracking-wider">{month}</span>
                  <span className="text-3xl font-extrabold text-slate-800 font-quicksand">{day}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{year}</span>
                </div>

                {/* Details */}
                <div className="flex-grow space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${getBadgeStyle(ev.type)}`}>
                      {ev.type}
                    </span>
                    <h3 className="font-quicksand font-bold text-slate-800 text-lg leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{ev.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {startDate.toDateString() !== endDate.toDateString() && ` - ${endDate.toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>School Campus</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
