'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateCelestialPositions, getZodiacDescription, getCompatibleSigns } from '@/lib/astrology';

interface BirthInfo {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
}

interface AstrologyResult {
  zodiacSign: string;
  description: string;
  compatibleSigns: string[];
  sunPosition: number;
  moonPosition: number;
}

export default function AstrologyClient() {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: '',
    time: '',
    latitude: '',
    longitude: '',
  });
  const [result, setResult] = useState<AstrologyResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBirthInfo(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateAstrology = () => {
    try {
      if (!birthInfo.date) {
        setError('Please enter your birth date');
        return;
      }

      const date = new Date(birthInfo.date);
      const latitude = parseFloat(birthInfo.latitude) || 0;
      const longitude = parseFloat(birthInfo.longitude) || 0;

      const positions = calculateCelestialPositions(date, latitude, longitude);
      const description = getZodiacDescription(positions.zodiacSign);
      const compatibleSigns = getCompatibleSigns(positions.zodiacSign);

      setResult({
        zodiacSign: positions.zodiacSign,
        description,
        compatibleSigns,
        sunPosition: positions.sunPosition,
        moonPosition: positions.moonPosition,
      });
    } catch (err) {
      setError('Error calculating astrological positions. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Celestial Insights
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 text-white rounded-lg border border-purple-600/30 transition-all flex items-center space-x-2"
          >
            <span>Return to Oracle</span>
          </Link>
        </div>

        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">
            Discover Your Astrological Profile
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-300 mb-2">Birth Date</label>
                <input
                  type="date"
                  name="date"
                  value={birthInfo.date}
                  onChange={handleInputChange}
                  className="w-full bg-purple-900/50 border border-purple-600/30 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Birth Time (optional)</label>
                <input
                  type="time"
                  name="time"
                  value={birthInfo.time}
                  onChange={handleInputChange}
                  className="w-full bg-purple-900/50 border border-purple-600/30 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Latitude (optional)</label>
                <input
                  type="text"
                  name="latitude"
                  placeholder="e.g., 40.7128"
                  value={birthInfo.latitude}
                  onChange={handleInputChange}
                  className="w-full bg-purple-900/50 border border-purple-600/30 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Longitude (optional)</label>
                <input
                  type="text"
                  name="longitude"
                  placeholder="e.g., -74.0060"
                  value={birthInfo.longitude}
                  onChange={handleInputChange}
                  className="w-full bg-purple-900/50 border border-purple-600/30 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              onClick={calculateAstrology}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Calculate Celestial Position
            </button>

            {result && (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-purple-900/40 border border-purple-600/30 rounded-lg">
                  <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                    Your Sun Sign: {result.zodiacSign}
                  </h3>
                  <p className="text-gray-200 mb-4">{result.description}</p>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-purple-300">Compatible Signs</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.compatibleSigns.map((sign) => (
                        <span
                          key={sign}
                          className="px-3 py-1 bg-purple-800/50 rounded-full text-sm"
                        >
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-purple-900/40 border border-purple-600/30 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2 text-purple-300">Sun Position</h4>
                    <p className="text-gray-200">{result.sunPosition.toFixed(2)}°</p>
                  </div>
                  <div className="p-6 bg-purple-900/40 border border-purple-600/30 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2 text-purple-300">Moon Position</h4>
                    <p className="text-gray-200">{result.moonPosition.toFixed(2)}°</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 