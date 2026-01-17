import React, { useState, useMemo } from 'react';

// Data types
const venues = [
  {
    id: "molleparken",
    name: "Mølleparken",
    shortName: "Mølleparken",
    district: "Grunerløkka",
    pitchSize: "7er-bane",
    surface: "Kunstgress",
    lighting: true,
    bookingUrl: "https://fotball.gruner.no/next/p/97386/molleparken",
    color: "#22c55e",
  },
  {
    id: "daelenga",
    name: "Dælenenga",
    shortName: "Dælenga",
    district: "Grunerløkka",
    pitchSize: "11er-bane",
    surface: "Kunstgress",
    lighting: true,
    bookingUrl: "https://fotball.gruner.no/next/page/kalender",
    color: "#10b981",
  },
  {
    id: "muselunden",
    name: "Muselunden",
    shortName: "Muselunden",
    district: "Torshov",
    pitchSize: "11er + 7er-bane",
    surface: "Kunstgress",
    lighting: true,
    color: "#059669",
  },
  {
    id: "nordre-asen",
    name: "Nordre Åsen",
    shortName: "Nordre Åsen",
    district: "Sagene",
    pitchSize: "11er + småbaner",
    surface: "Kunstgress",
    lighting: true,
    bookingUrl: "https://arena.club.no/club/skeid",
    color: "#047857",
  },
];

// Generate mock availability
function generateMockSlots(venueId, date) {
  const slots = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const startHour = isWeekend ? 8 : 7;
  const endHour = 22;
  
  for (let hour = startHour; hour < endHour; hour++) {
    const seed = venueId.charCodeAt(0) + hour + date.getDate();
    const isBooked = (seed % 3 === 0) || (hour >= 16 && hour <= 19 && seed % 2 === 0);
    
    slots.push({
      start: `${hour.toString().padStart(2, '0')}:00`,
      end: `${(hour + 1).toString().padStart(2, '0')}:00`,
      available: !isBooked,
    });
  }
  return slots;
}

// Get available periods (contiguous slots)
function getAvailablePeriods(slots) {
  const periods = [];
  let current = null;
  
  for (const slot of slots) {
    if (slot.available) {
      if (!current) {
        current = { start: slot.start, end: slot.end, duration: 1 };
      } else {
        current.end = slot.end;
        current.duration += 1;
      }
    } else {
      if (current) {
        periods.push(current);
        current = null;
      }
    }
  }
  if (current) periods.push(current);
  return periods;
}

// Format date in Norwegian
function formatDateNorwegian(date) {
  const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 
                  'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  return `${days[date.getDay()]} ${date.getDate()}. ${months[date.getMonth()]}`;
}

// Ball icon component
const BallIcon = () => (
  <svg className="w-10 h-10 animate-bounce" viewBox="0 0 24 24" fill="none" style={{animationDuration: '2s'}}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
    <path d="M12 2C12 2 12 6 8 8C4 10 2 12 2 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
    <path d="M12 2C12 2 12 6 16 8C20 10 22 12 22 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
    <path d="M12 22C12 22 12 18 8 16C4 14 2 12 2 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
    <path d="M12 22C12 22 12 18 16 16C20 14 22 12 22 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
    <circle cx="12" cy="12" r="3" fill="currentColor" className="text-green-400"/>
  </svg>
);

// VenueCard component
const VenueCard = ({ venue, slots, selectedDate }) => {
  const periods = getAvailablePeriods(slots);
  const totalHours = slots.filter(s => s.available).length;
  const hasAvailability = totalHours > 0;

  return (
    <div className="bg-gradient-to-br from-green-900/60 to-green-950/80 rounded-2xl p-5 border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1" style={{fontFamily: 'Oswald, sans-serif'}}>{venue.name}</h2>
          <div className="flex items-center gap-2 text-sm text-green-200/70">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {venue.district}
            </span>
            <span className="text-green-500/40">•</span>
            <span>{venue.pitchSize}</span>
          </div>
        </div>
        
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
          hasAvailability 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {hasAvailability ? `${totalHours} timer` : 'Fullt'}
        </span>
      </div>
      
      {/* Time slots */}
      {hasAvailability ? (
        <div className="space-y-3">
          <p className="text-sm text-green-200/60 font-medium">Ledige tider:</p>
          <div className="flex flex-wrap gap-2">
            {periods.map((period, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-green-500/15 to-green-600/20 border border-green-500/30 rounded-xl px-4 py-3 hover:border-green-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white" style={{fontFamily: 'Oswald, sans-serif'}}>{period.start}</span>
                  <span className="text-green-400/60">–</span>
                  <span className="text-lg font-bold text-white" style={{fontFamily: 'Oswald, sans-serif'}}>{period.end}</span>
                </div>
                <span className="text-xs text-green-300/70">
                  {period.duration} {period.duration === 1 ? 'time' : 'timer'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-3">
            <svg className="w-6 h-6 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-red-300/70 text-sm">Ingen ledige tider</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-green-500/10 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-green-200/40">
          <span>{venue.surface}</span>
          {venue.lighting && (
            <>
              <span className="mx-1">•</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Flomlys</span>
            </>
          )}
        </div>
        
        {venue.bookingUrl && (
          <a 
            href={venue.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
          >
            <span>Se kalender</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

// Main component
export default function LedigBane() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const goToPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= today) setSelectedDate(prev);
  };
  
  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);
    if (next <= maxDate) setSelectedDate(next);
  };
  
  const isToday = selectedDate.toDateString() === today.toDateString();
  const canGoPrev = selectedDate > today;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7);
  const canGoNext = selectedDate < maxDate;

  const venueData = useMemo(() => {
    return venues.map(venue => ({
      venue,
      slots: generateMockSlots(venue.id, selectedDate),
    }));
  }, [selectedDate]);

  const totalHours = venueData.reduce((sum, { slots }) => 
    sum + slots.filter(s => s.available).length, 0
  );
  
  const venuesWithAvailability = venueData.filter(
    ({ slots }) => slots.some(s => s.available)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-950 to-green-950 text-white" style={{fontFamily: 'DM Sans, system-ui, sans-serif'}}>
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(34, 197, 94, 1) 40px, rgba(34, 197, 94, 1) 80px)`
      }} />
      
      <div className="relative">
        {/* Header */}
        <header className="pb-4" style={{background: 'radial-gradient(ellipse at center top, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'}}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <BallIcon />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase" style={{fontFamily: 'Oswald, sans-serif'}}>
                  Ledig Bane
                </h1>
              </div>
              <p className="text-green-200/80 text-lg max-w-xl mx-auto">
                Finn ledige tider for løkkefotball på Grunerløkka, Torshov og Sagene
              </p>
            </div>
            
            {/* Date navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-green-900/50 rounded-full p-1 border border-green-500/20">
                <button
                  onClick={goToPrevDay}
                  disabled={!canGoPrev}
                  className={`p-2 rounded-full transition-all ${
                    canGoPrev 
                      ? 'hover:bg-green-500/20 text-green-300 hover:text-green-200' 
                      : 'text-green-700 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="px-4 py-2 min-w-[200px] text-center">
                  <div className="text-xl font-semibold capitalize" style={{fontFamily: 'Oswald, sans-serif'}}>
                    {formatDateNorwegian(selectedDate)}
                  </div>
                  {isToday && (
                    <span className="text-xs text-green-400 uppercase tracking-wider font-medium">
                      I dag
                    </span>
                  )}
                </div>
                
                <button
                  onClick={goToNextDay}
                  disabled={!canGoNext}
                  className={`p-2 rounded-full transition-all ${
                    canGoNext 
                      ? 'hover:bg-green-500/20 text-green-300 hover:text-green-200' 
                      : 'text-green-700 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-sm text-green-400 hover:text-green-300 underline underline-offset-2"
                >
                  Gå til i dag
                </button>
              )}
            </div>
          </div>
        </header>
        
        {/* Quick stats */}
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/10">
              <div className="text-3xl font-bold" style={{fontFamily: 'Oswald, sans-serif'}}>{totalHours}</div>
              <div className="text-sm text-green-200/60 mt-1">timer totalt</div>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/10">
              <div className="text-3xl font-bold" style={{fontFamily: 'Oswald, sans-serif'}}>{venuesWithAvailability}/4</div>
              <div className="text-sm text-green-200/60 mt-1">baner med ledig</div>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-lg font-semibold text-green-400">Ledig nå!</span>
              </div>
              <div className="text-sm text-green-200/60 mt-1">Gå ut og spill</div>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/10">
              <div className="text-lg font-semibold truncate">
                {venueData.reduce((best, { venue, slots }) => {
                  const available = slots.filter(s => s.available).length;
                  return available > best.count ? { name: venue.shortName, count: available } : best;
                }, { name: '-', count: 0 }).name}
              </div>
              <div className="text-sm text-green-200/60 mt-1">mest ledig</div>
            </div>
          </div>
        </div>
        
        {/* Venue cards */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {venueData.map(({ venue, slots }) => (
              <VenueCard 
                key={venue.id}
                venue={venue}
                slots={slots}
                selectedDate={selectedDate}
              />
            ))}
          </div>
        </section>
        
        {/* Info section */}
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <div className="bg-green-900/20 rounded-2xl p-6 border border-green-500/10">
            <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Oswald, sans-serif'}}>Om Ledig Bane</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-green-200/70 text-sm leading-relaxed">
              <div>
                <h3 className="text-green-300 font-semibold mb-2">Hvordan fungerer det?</h3>
                <p>
                  Vi samler kalenderdataene fra Grüner Fotball, Skeid og NFF Oslo, 
                  og viser kun de tidene som ikke er booket til trening eller kamp. 
                  Perfekt for når du og vennene vil spille løkkefotball!
                </p>
              </div>
              <div>
                <h3 className="text-green-300 font-semibold mb-2">Tips for løkkefotball</h3>
                <p>
                  Ledige tider kan fylles opp på kort varsel. Sjekk gjerne rett før du 
                  drar. Har du spørsmål om bruk av banene, kontakt den aktuelle klubben 
                  som drifter anlegget.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-16 pb-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="border-t border-green-500/10 pt-8 text-center text-sm text-green-200/40">
              <p className="mb-2">Data fra Grüner Fotball, Skeid og NFF Oslo</p>
              <p className="text-xs text-green-200/30">
                Tips: Sjekk alltid den offisielle kalenderen før du drar. Tider kan endres på kort varsel.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}