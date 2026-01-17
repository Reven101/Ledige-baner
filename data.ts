export interface Venue {
  id: string;
  name: string;
  shortName: string;
  address: string;
  district: string;
  surface: string;
  pitchSize: string;
  lighting: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  bookingUrl?: string;
  nffId?: number;
  color: string;
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
  available: boolean;
  activity?: string;
}

export interface VenueAvailability {
  venue: Venue;
  date: string;
  slots: TimeSlot[];
}

// Bane-informasjon
export const venues: Venue[] = [
  {
    id: "molleparken",
    name: "Mølleparken",
    shortName: "Mølleparken",
    address: "Seilduksgata 25, 0553 Oslo",
    district: "Grunerløkka",
    surface: "Kunstgress",
    pitchSize: "7er-bane",
    lighting: true,
    coordinates: { lat: 59.9282, lng: 10.7598 },
    bookingUrl: "https://fotball.gruner.no/next/p/97386/molleparken",
    color: "#22c55e",
  },
  {
    id: "daelenga",
    name: "Dælenenga",
    shortName: "Dælenga",
    address: "Seilduksgata 30, 0553 Oslo",
    district: "Grunerløkka",
    surface: "Kunstgress",
    pitchSize: "11er-bane",
    lighting: true,
    coordinates: { lat: 59.9288, lng: 10.7622 },
    bookingUrl: "https://fotball.gruner.no/next/page/kalender",
    nffId: 2703,
    color: "#10b981",
  },
  {
    id: "muselunden",
    name: "Muselunden",
    shortName: "Muselunden",
    address: "Åsensvingen 3C, 0488 Oslo",
    district: "Torshov",
    surface: "Kunstgress",
    pitchSize: "11er + 7er-bane",
    lighting: true,
    coordinates: { lat: 59.9456, lng: 10.7765 },
    nffId: 8729,
    color: "#059669",
  },
  {
    id: "nordre-asen",
    name: "Nordre Åsen",
    shortName: "Nordre Åsen",
    address: "Kjelsåsveien 9, 0468 Oslo",
    district: "Sagene",
    surface: "Kunstgress / Naturgress",
    pitchSize: "11er + flere småbaner",
    lighting: true,
    coordinates: { lat: 59.9510, lng: 10.7701 },
    bookingUrl: "https://arena.club.no/club/skeid",
    nffId: 7716,
    color: "#047857",
  },
];

// Genererer mock-data for ledige tider
// I en ekte implementasjon ville dette komme fra API-et
export function generateMockAvailability(venue: Venue, date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Åpningstider basert på dag
  const startHour = isWeekend ? 8 : 7;
  const endHour = 22;
  
  // Generer timelukker
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // Simuler at noen tider er opptatt (basert på venue ID og time for konsistens)
    const seed = venue.id.charCodeAt(0) + hour + date.getDate();
    const isBooked = (seed % 3 === 0) || (hour >= 16 && hour <= 19 && seed % 2 === 0);
    
    slots.push({
      start: startTime,
      end: endTime,
      available: !isBooked,
      activity: isBooked ? getRandomActivity(seed) : undefined,
    });
  }
  
  return slots;
}

function getRandomActivity(seed: number): string {
  const activities = [
    "Trening G14",
    "Trening J12",
    "Kamp Senior",
    "Trening G16",
    "Keepertrening",
    "Reservert",
    "Kamp G15",
    "Trening J16",
  ];
  return activities[seed % activities.length];
}

// Hent kun ledige tider
export function getAvailableSlots(slots: TimeSlot[]): TimeSlot[] {
  return slots.filter(slot => slot.available);
}

// Gruppert ledige tider (sammenhengende perioder)
export interface AvailablePeriod {
  start: string;
  end: string;
  duration: number; // i timer
}

export function getAvailablePeriods(slots: TimeSlot[]): AvailablePeriod[] {
  const periods: AvailablePeriod[] = [];
  let currentPeriod: AvailablePeriod | null = null;
  
  for (const slot of slots) {
    if (slot.available) {
      if (!currentPeriod) {
        currentPeriod = {
          start: slot.start,
          end: slot.end,
          duration: 1,
        };
      } else {
        currentPeriod.end = slot.end;
        currentPeriod.duration += 1;
      }
    } else {
      if (currentPeriod) {
        periods.push(currentPeriod);
        currentPeriod = null;
      }
    }
  }
  
  if (currentPeriod) {
    periods.push(currentPeriod);
  }
  
  return periods;
}

// Formater dato til norsk
export function formatDateNorwegian(date: Date): string {
  const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 
                  'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  
  return `${dayName} ${dayNum}. ${monthName}`;
}

export function formatDateShort(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
}

// Sjekk om en tid er "nå" eller "snart"
export function getTimeStatus(startTime: string, date: Date): 'past' | 'now' | 'soon' | 'future' {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Hvis ikke i dag, er det fremtid
  if (slotDate > today) return 'future';
  if (slotDate < today) return 'past';
  
  // Sjekk time
  const [hours] = startTime.split(':').map(Number);
  const currentHour = now.getHours();
  
  if (hours < currentHour) return 'past';
  if (hours === currentHour) return 'now';
  if (hours === currentHour + 1) return 'soon';
  return 'future';
}

// Telle totalt antall ledige timer
export function getTotalAvailableHours(slots: TimeSlot[]): number {
  return slots.filter(slot => slot.available).length;
}
