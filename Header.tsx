'use client';

import { formatDateNorwegian } from '../lib/data';

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function Header({ selectedDate, onDateChange }: HeaderProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const goToPrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    if (prevDay >= today) {
      onDateChange(prevDay);
    }
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    // Maks 7 dager frem
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);
    if (nextDay <= maxDate) {
      onDateChange(nextDay);
    }
  };
  
  const goToToday = () => {
    onDateChange(new Date(today));
  };
  
  const isToday = selectedDate.toDateString() === today.toDateString();
  const canGoPrev = selectedDate > today;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7);
  const canGoNext = selectedDate < maxDate;

  return (
    <header className="header-glow">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Logo og tittel */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="ball-bounce">
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
                <path d="M12 2C12 2 12 6 8 8C4 10 2 12 2 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
                <path d="M12 2C12 2 12 6 16 8C20 10 22 12 22 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
                <path d="M12 22C12 22 12 18 8 16C4 14 2 12 2 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
                <path d="M12 22C12 22 12 18 16 16C20 14 22 12 22 12" stroke="currentColor" strokeWidth="1.5" className="text-green-400"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" className="text-green-400"/>
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              Ledig Bane
            </h1>
          </div>
          <p className="text-green-200/80 text-base sm:text-lg max-w-xl mx-auto">
            Finn ledige tider for løkkefotball på Grunerløkka, Torshov og Sagene
          </p>
        </div>
        
        {/* Dato-navigasjon */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-100">
          <div className="flex items-center gap-2 bg-pitch-700/50 rounded-full p-1 border border-green-500/20">
            <button
              onClick={goToPrevDay}
              disabled={!canGoPrev}
              className={`p-2 rounded-full transition-all ${
                canGoPrev 
                  ? 'hover:bg-green-500/20 text-green-300 hover:text-green-200' 
                  : 'text-green-700 cursor-not-allowed'
              }`}
              aria-label="Forrige dag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="px-4 py-2 min-w-[200px] text-center">
              <div className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold text-white capitalize">
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
              aria-label="Neste dag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {!isToday && (
            <button
              onClick={goToToday}
              className="text-sm text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors"
            >
              Gå til i dag
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
