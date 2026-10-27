import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, MapPin, Check, ChevronDown, Plus, X, Loader2 } from 'lucide-react';

export default function CollegeSearchSelect({ value, onChange, placeholder = "Search & select your college...", disabled = false, required = false }) {
  const [query, setQuery] = useState(value?.collegeName || '');
  const [colleges, setColleges] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(value || null);
  const wrapperRef = useRef(null);

  // Sync internal state with external value changes
  useEffect(() => {
    if (value) {
      setSelectedCollege(value);
      setQuery(value.collegeName || value.name || '');
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced college fetch
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/test/colleges?search=${encodeURIComponent(query.trim())}&limit=25`);
        const data = await res.json();
        if (data.success && Array.isArray(data.colleges)) {
          setColleges(data.colleges);
        } else {
          setColleges([]);
        }
      } catch (err) {
        console.error('Error fetching colleges:', err);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (college) => {
    setSelectedCollege(college);
    setQuery(college.name);
    setIsOpen(false);
    onChange({
      collegeId: college.id,
      collegeName: college.name,
      city: college.city,
      state: college.state
    });
  };

  const handleCustomCollege = () => {
    if (!query.trim()) return;
    const custom = {
      collegeId: null,
      collegeName: query.trim(),
      city: '',
      state: ''
    };
    setSelectedCollege(custom);
    setIsOpen(false);
    onChange(custom);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedCollege(null);
    setQuery('');
    onChange({ collegeId: null, collegeName: '', city: '', state: '' });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`relative flex items-center border rounded-xl bg-white transition-all shadow-sm ${
          isOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-text'}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="pl-3 text-slate-400">
          <Building2 className="w-5 h-5 text-indigo-500" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (selectedCollege && selectedCollege.collegeName !== e.target.value) {
              setSelectedCollege(null);
              onChange({ collegeId: null, collegeName: e.target.value });
            }
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required && !selectedCollege?.collegeName}
          className="w-full py-3 px-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
        />

        <div className="flex items-center pr-3 space-x-1">
          {loading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
        </div>
      </div>

      {/* Selected badge */}
      {selectedCollege && selectedCollege.collegeName && (
        <div className="mt-1.5 flex items-center text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 w-fit">
          <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          <span className="font-medium truncate max-w-xs">{selectedCollege.collegeName}</span>
          {selectedCollege.city && <span className="text-indigo-400 ml-1">({selectedCollege.city})</span>}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100 text-sm">
          {loading && colleges.length === 0 ? (
            <div className="p-4 text-center text-slate-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Searching colleges...</span>
            </div>
          ) : colleges.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase bg-slate-50">
                Verified Colleges & Institutions
              </div>
              {colleges.map((college) => {
                const isSelected = selectedCollege?.collegeId === college.id || selectedCollege?.collegeName === college.name;
                return (
                  <div
                    key={college.id}
                    onClick={() => handleSelect(college)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-start justify-between hover:bg-indigo-50/70 transition-colors ${
                      isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-slate-800">{college.name}</span>
                        {college.code && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            {college.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5 space-x-2">
                        {college.city && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                            {college.city}{college.state ? `, ${college.state}` : ''}
                          </span>
                        )}
                        {college.university && (
                          <span className="text-slate-400">• {college.university}</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-slate-500 text-xs mb-2">No institution found matching "{query}".</p>
              {query.trim() && (
                <button
                  type="button"
                  onClick={handleCustomCollege}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Use "{query.trim()}" as custom college
                </button>
              )}
            </div>
          )}

          {/* Quick Custom add option if query is non-empty */}
          {query.trim() && colleges.length > 0 && !colleges.some(c => c.name.toLowerCase() === query.trim().toLowerCase()) && (
            <div className="p-2 bg-slate-50">
              <button
                type="button"
                onClick={handleCustomCollege}
                className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-100/60 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                <span>Not listed? Use "<strong>{query.trim()}</strong>" as my college</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
