'use client';

import { Venue, TimeSlot, getAvailablePeriods, getTimeStatus, getTotalAvailableHours } from '../lib/data';

interface VenueCardProps {
  venue: Venue;
  slots: TimeSlot[];
  selectedDate: Date;
}

export function VenueCard({ venue, slots, selectedDate }: VenueCardProps) {
  const availableSlots = slots.filter(s => s.available);
  const periods = getAvailablePeriods(slots);
  const totalHours = getTotalAvailableHours(slots);
  
  const hasAvailability = availableSlots.length > 0;

  return (
    <article 
      className="venue-card rounded-2xl p-5 sm:p-6 transition-all duration-300"
      style={{ 
        '--venue-color': venue.color,
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-white mb-1">
            {venue.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm text-green-200/70">
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
        
        {/* Status badge */}
        <div 
          className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
            hasAvailability 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          {hasAvailability ? `${totalHours} timer ledig` : 'Fullt'}
        </div>
      </div>
      
      {/* Ledige perioder */}
      {hasAvailability ? (
        <div className="space-y-3">
          <p className="text-sm text-green-200/60 font-medium">Ledige tider:</p>
          <div className="flex flex-wrap gap-2 stagger-children">
            {periods.map((period, idx) => {
              const status = getTimeStatus(period.start, selectedDate);
              const isNow = status === 'now';
              const isSoon = status === 'soon';
              const isPast = status === 'past';
              
              return (
                <div 
                  key={idx}
                  className={`
                    time-slot rounded-xl px-4 py-3 relative
                    ${isNow ? 'time-slot-available ring-2 ring-green-400/50' : ''}
                    ${isPast ? 'opacity-50' : ''}
                  `}
                >
                  {/* Nå-indikator */}
                  {isNow && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                    </span>
                  )}
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-white">
                      {period.start}
                    </span>
                    <span className="text-green-400/60">–</span>
                    <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-white">
                      {period.end}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-300/70">
                      {period.duration} {period.duration === 1 ? 'time' : 'timer'}
                    </span>
                    {isNow && (
                      <span className="text-xs text-green-400 font-semibold uppercase">
                        Ledig nå!
                      </span>
                    )}
                    {isSoon && (
                      <span className="text-xs text-yellow-400/80 font-medium">
                        Snart
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-3">
            <svg className="w-6 h-6 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-red-300/70 text-sm">
            Ingen ledige tider denne dagen
          </p>
        </div>
      )}
      
      {/* Footer med lenker */}
      <div className="mt-5 pt-4 border-t border-green-500/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs text-green-200/40">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
            <span>Se full kalender</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
