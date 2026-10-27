import React, { useEffect, useState } from 'react';
import { Video, Clock, Users, ExternalLink, AlertCircle, CalendarClock } from 'lucide-react';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/meetings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMeetings(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getAudienceBadge = (audience) => {
    switch (audience) {
      case 'parents': return 'bg-brandSky/10 text-brandSky-dark border border-brandSky/30';
      case 'teachers': return 'bg-brandLavender/10 text-brandLavender-dark border border-brandLavender/30';
      default: return 'bg-brandMint/10 text-brandMint-dark border border-brandMint/30';
    }
  };

  const handleJoin = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">

      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-brandCoral font-bold text-xs uppercase tracking-widest bg-brandCoral/10 px-3 py-1 rounded-full border border-brandCoral/20">LIVE SESSIONS</span>
        <h1 className="text-4xl font-quicksand font-bold text-slate-800">Online Meetings</h1>
        <p className="text-sm text-slate-500">
          Join upcoming live classes, PTMs, and faculty syncs on Google Meet. Click JOIN at the scheduled time to enter the meeting.
        </p>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-brandCoral rounded-full" />
          <p className="mt-2 text-xs text-slate-500 font-quicksand">Fetching upcoming meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 bg-white border border-orange-50 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="mt-2 text-sm text-slate-500 font-quicksand">No upcoming meetings scheduled right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => {
            const startDate = new Date(m.startTime);
            const month = startDate.toLocaleString('en-US', { month: 'short' });
            const day = startDate.getDate();
            const year = startDate.getFullYear();

            return (
              <div
                key={m._id}
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
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${getAudienceBadge(m.targetAudience)}`}>
                      {m.targetAudience}
                    </span>
                    <h3 className="font-quicksand font-bold text-slate-800 text-lg leading-snug">{m.title}</h3>
                    {m.description && <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {startDate.toLocaleDateString([], { weekday: 'short' })}, {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {m.durationMinutes || 60} min
                      </span>
                    </div>
                    {m.hostName && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Host: {m.hostName}</span>
                      </div>
                    )}
                    {m.classFilter && (
                      <div className="flex items-center space-x-1">
                        <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.classFilter}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <div className="flex md:flex-col items-center justify-center gap-2 shrink-0">
                  <button
                    onClick={() => handleJoin(m.joinUrl)}
                    className="flex items-center space-x-1.5 font-quicksand font-bold text-xs text-white bg-brandSky hover:bg-brandSky-dark px-5 py-2.5 rounded-full shadow-sm transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>JOIN</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
