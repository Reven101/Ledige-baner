# Ledig Bane ⚽

En nettside som viser ledige tider for løkkefotball på fotballbanene rundt Grunerløkka, Torshov og Sagene i Oslo.

## Baner

- **Mølleparken** - Grunerløkka (7er-bane)
- **Dælenga** - Grunerløkka (11er-bane)
- **Muselunden** - Torshov (11er + 7er-bane)
- **Nordre Åsen** - Sagene (11er + flere småbaner)

## Funksjoner

- 📅 Dagvisning - se kun ledige tider for valgt dag
- ⏰ Sanntidsstatus - se hva som er ledig akkurat nå
- 📱 Responsiv design - fungerer på mobil, nettbrett og desktop
- 🔗 Direkte lenker til offisielle kalendere

## Teknologi

- [Next.js 15](https://nextjs.org/) - React-rammeverk
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type-sikkerhet

## Kom i gang

### Installasjon

```bash
npm install
```

### Utvikling

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Bygg for produksjon

```bash
npm run build
```

### Deploy til Vercel

Den enkleste måten å deploye denne appen er med [Vercel](https://vercel.com):

1. Push koden til GitHub
2. Importer prosjektet i Vercel
3. Vercel vil automatisk bygge og deploye

Eller bruk Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Datakilder

Nettstedet henter data fra følgende kilder:

- **Grüner Fotball**: [fotball.gruner.no](https://fotball.gruner.no)
- **Skeid (Club Arena)**: [arena.club.no/club/skeid](https://arena.club.no/club/skeid)
- **NFF Oslo**: [fotball.no](https://www.fotball.no/kretser/oslo/)

### NFF Kalender-API

NFF har et offentlig kalender-API som returnerer iCal-data:

```
https://www.fotball.no/footballapi/Calendar/GetCalendarForArena?arenaId={ID}
```

Arena ID-er for aktuelle baner:
- Dælenga: 2703
- Muselunden: 8729
- Nordre Åsen: 7716

## Tilpasning

### Legge til nye baner

Rediger `app/lib/data.ts` og legg til nye baner i `venues`-arrayen:

```typescript
{
  id: "ny-bane",
  name: "Ny Bane",
  shortName: "Ny Bane",
  address: "Adresse, Oslo",
  district: "Bydel",
  surface: "Kunstgress",
  pitchSize: "11er",
  lighting: true,
  coordinates: { lat: 59.0, lng: 10.0 },
  bookingUrl: "https://...",
  nffId: 12345,
  color: "#22c55e",
}
```

### Koble til ekte data

For å koble til ekte kalenderdata, implementer en API-rute i `app/api/availability/route.ts` som henter data fra NFF eller andre kilder, og erstatt `generateMockAvailability` med et API-kall.

## Lisens

MIT

---

Laget med ❤️ for løkkefotball i Oslo
