import { solar, planetposition, julian } from 'astronomia';

export interface CelestialPosition {
  zodiacSign: string;
  sunPosition: number;
  moonPosition: number;
  ascendant?: number;
}

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function calculateZodiacSign(date: Date): string {
  // Convert date to Julian Day
  const jde = solar.toJDE(date.getFullYear(), date.getMonth() + 1, date.getDate());
  
  // Calculate sun's position
  const T = julian.JDEToJulianMillennium(jde);
  const sunLong = solar.apparentLongitude(T);
  
  // Convert longitude to zodiac sign (each sign spans 30 degrees)
  const signIndex = Math.floor(sunLong / 30) % 12;
  return zodiacSigns[signIndex];
}

export function calculateCelestialPositions(
  date: Date,
  latitude: number,
  longitude: number
): CelestialPosition {
  // Convert date to Julian Day
  const jde = solar.toJDE(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const T = julian.JDEToJulianMillennium(jde);

  // Calculate sun's position
  const sunLong = solar.apparentLongitude(T);
  
  // Calculate moon's position (placeholder - will implement with proper moon calculations)
  const moonLong = 0; // This will be replaced with actual moon calculations
  
  return {
    zodiacSign: zodiacSigns[Math.floor(sunLong / 30) % 12],
    sunPosition: sunLong,
    moonPosition: moonLong,
  };
}

export function getZodiacDescription(sign: string): string {
  const descriptions: { [key: string]: string } = {
    'Aries': 'The pioneer and leader of the zodiac. Aries energy is ambitious, energetic, and passionate.',
    'Taurus': 'The steadfast provider. Taurus energy is grounded, practical, and sensual.',
    'Gemini': 'The curious communicator. Gemini energy is versatile, intellectual, and playful.',
    'Cancer': 'The nurturing protector. Cancer energy is intuitive, emotional, and caring.',
    'Leo': 'The creative performer. Leo energy is confident, dramatic, and generous.',
    'Virgo': 'The analytical perfectionist. Virgo energy is practical, diligent, and health-conscious.',
    'Libra': 'The harmonious mediator. Libra energy is diplomatic, artistic, and social.',
    'Scorpio': 'The intense transformer. Scorpio energy is passionate, mysterious, and powerful.',
    'Sagittarius': 'The adventurous philosopher. Sagittarius energy is optimistic, expansive, and truthful.',
    'Capricorn': 'The ambitious achiever. Capricorn energy is disciplined, responsible, and traditional.',
    'Aquarius': 'The innovative rebel. Aquarius energy is progressive, humanitarian, and independent.',
    'Pisces': 'The mystical dreamer. Pisces energy is compassionate, artistic, and spiritual.',
  };

  return descriptions[sign] || 'Description not available';
}

export function getCompatibleSigns(sign: string): string[] {
  const compatibility: { [key: string]: string[] } = {
    'Aries': ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    'Taurus': ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    'Gemini': ['Libra', 'Aquarius', 'Aries', 'Leo'],
    'Cancer': ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    'Leo': ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    'Virgo': ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    'Libra': ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    'Scorpio': ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    'Sagittarius': ['Aries', 'Leo', 'Libra', 'Aquarius'],
    'Capricorn': ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    'Aquarius': ['Gemini', 'Libra', 'Sagittarius', 'Aries'],
    'Pisces': ['Cancer', 'Scorpio', 'Capricorn', 'Taurus'],
  };

  return compatibility[sign] || [];
} 