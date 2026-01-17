export function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-green-500/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-green-200/40">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              <span>Ledig Bane</span>
            </div>
            
            <p className="text-center">
              Data fra Grüner Fotball og NFF Oslo. 
              <br className="sm:hidden" />
              Oppdateres automatisk.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://fotball.gruner.no" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                Grüner
              </a>
              <a 
                href="https://arena.club.no/club/skeid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                Skeid
              </a>
              <a 
                href="https://www.fotball.no/kretser/oslo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-300 transition-colors"
              >
                NFF Oslo
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-green-200/30">
              Tips: Sjekk alltid den offisielle kalenderen før du drar. 
              Tider kan endres på kort varsel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
