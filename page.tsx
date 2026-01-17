'use client';

import { useState, useMemo } from 'react';
import { Header, VenueCard, QuickStats, Footer } from './components';
import { 
  venues, 
  generateMockAvailability, 
  getTotalAvailableHours,
  getTimeStatus 
} from './lib/data';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Generer tilgjengelighetsdata for alle baner
  const venueData = useMemo(() => {
    return venues.map(venue => ({
      venue,
      slots: generateMockAvailability(venue, selectedDate),
    }));
  }, [selectedDate]);

  // Beregn statistikk
  const venueStats = useMemo(() => {
    return venueData.map(({ venue, slots }) => {
      const availableSlots = slots.filter(s => s.available);
      const hasNow = availableSlots.some(
        slot => getTimeStatus(slot.start, selectedDate) === 'now'
      );
      return {
        name: venue.shortName,
        totalAvailable: getTotalAvailableHours(slots),
        hasNow,
      };
    });
  }, [venueData, selectedDate]);

  return (
    <main className="min-h-screen">
      <Header 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />
      
      <QuickStats 
        venueStats={venueStats} 
        selectedDate={selectedDate}
      />
      
      {/* Bane-kort */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 stagger-children">
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
      
      {/* Info-seksjon */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-pitch-700/20 rounded-2xl p-6 sm:p-8 border border-green-500/10 animate-fade-in">
          <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-white mb-4">
            Om Ledig Bane
          </h2>
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
          
          {/* Bane-lenker */}
          <div className="mt-6 pt-6 border-t border-green-500/10">
            <h3 className="text-green-300 font-semibold mb-3 text-sm">Offisielle kalendere:</h3>
            <div className="flex flex-wrap gap-3">
              {venues.map(venue => (
                venue.bookingUrl && (
                  <a
                    key={venue.id}
                    href={venue.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-full text-xs text-green-300 hover:text-green-200 transition-colors border border-green-500/20"
                  >
                    <span>{venue.shortName}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
