'use client';

import { TimeSlot, getTotalAvailableHours, getTimeStatus } from '../lib/data';

interface VenueStats {
  name: string;
  totalAvailable: number;
  hasNow: boolean;
}

interface QuickStatsProps {
  venueStats: VenueStats[];
  selectedDate: Date;
}

export function QuickStats({ venueStats, selectedDate }: QuickStatsProps) {
  const totalAvailable = venueStats.reduce((sum, v) => sum + v.totalAvailable, 0);
  const venuesWithAvailability = venueStats.filter(v => v.totalAvailable > 0).length;
  const anyAvailableNow = venueStats.some(v => v.hasNow);
  
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Totalt ledige timer */}
        <div className="bg-pitch-700/30 rounded-xl p-4 border border-green-500/10 animate-fade-in">
          <div className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-bold text-white">
            {totalAvailable}
          </div>
          <div className="text-xs sm:text-sm text-green-200/60 mt-1">
            timer totalt
          </div>
        </div>
        
        {/* Baner med ledig */}
        <div className="bg-pitch-700/30 rounded-xl p-4 border border-green-500/10 animate-fade-in animate-delay-100">
          <div className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-bold text-white">
            {venuesWithAvailability}/{venueStats.length}
          </div>
          <div className="text-xs sm:text-sm text-green-200/60 mt-1">
            baner med ledig
          </div>
        </div>
        
        {/* Status nå */}
        <div className="bg-pitch-700/30 rounded-xl p-4 border border-green-500/10 animate-fade-in animate-delay-200">
          {isToday && anyAvailableNow ? (
            <>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-lg sm:text-xl font-semibold text-green-400">Ledig nå!</span>
              </div>
              <div className="text-xs sm:text-sm text-green-200/60 mt-1">
                Gå ut og spill
              </div>
            </>
          ) : (
            <>
              <div className="text-lg sm:text-xl font-semibold text-green-200/50">
                {isToday ? 'Ingen nå' : 'Fremtid'}
              </div>
              <div className="text-xs sm:text-sm text-green-200/40 mt-1">
                {isToday ? 'Sjekk senere' : 'Planlegg fremover'}
              </div>
            </>
          )}
        </div>
        
        {/* Beste bane */}
        <div className="bg-pitch-700/30 rounded-xl p-4 border border-green-500/10 animate-fade-in animate-delay-300">
          {venuesWithAvailability > 0 ? (
            <>
              <div className="text-base sm:text-lg font-semibold text-white truncate">
                {venueStats.reduce((best, v) => 
                  v.totalAvailable > best.totalAvailable ? v : best
                ).name}
              </div>
              <div className="text-xs sm:text-sm text-green-200/60 mt-1">
                mest ledig
              </div>
            </>
          ) : (
            <>
              <div className="text-base sm:text-lg font-semibold text-green-200/50">
                Ingen
              </div>
              <div className="text-xs sm:text-sm text-green-200/40 mt-1">
                alt booket
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
