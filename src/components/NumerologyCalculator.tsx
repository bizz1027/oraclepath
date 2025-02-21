'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumerologyResult {
  number: number;
  title: string;
  meaning: string;
  strengths: string[];
  challenges: string[];
  guidance: string;
  elements: string[];
}

const NUMEROLOGY_MEANINGS: Record<number, NumerologyResult> = {
  1: {
    number: 1,
    title: "The Divine Pioneer",
    meaning: "You walk the path of the sacred initiator, blessed with the cosmic energy of new beginnings and leadership.",
    strengths: ["Natural born leader", "Independent spirit", "Creative force", "Divine inspiration"],
    challenges: ["Learning to collaborate", "Balancing self-reliance", "Embracing vulnerability"],
    guidance: "Embrace your role as a cosmic catalyst, but remember that true power lies in unity with others.",
    elements: ["Fire", "Sun", "Gold"]
  },
  2: {
    number: 2,
    title: "The Sacred Mediator",
    meaning: "Your soul carries the divine energy of harmony and balance, bridging worlds both seen and unseen.",
    strengths: ["Intuitive wisdom", "Diplomatic nature", "Emotional depth", "Partnership abilities"],
    challenges: ["Standing in your power", "Decision making", "Self-trust"],
    guidance: "Trust in your innate ability to bring peace and harmony to all situations.",
    elements: ["Moon", "Silver", "Water"]
  },
  3: {
    number: 3,
    title: "The Mystic Creator",
    meaning: "You embody the sacred trinity of creation, expression, and joy, channeling divine creativity into earthly form.",
    strengths: ["Creative expression", "Joyful spirit", "Communication gifts", "Artistic vision"],
    challenges: ["Focus and discipline", "Emotional sensitivity", "Self-expression"],
    guidance: "Your creativity is a divine gift - use it to inspire and elevate others.",
    elements: ["Jupiter", "Purple", "Crystal"]
  },
  4: {
    number: 4,
    title: "The Foundation Builder",
    meaning: "You are blessed with the sacred geometry of stability and order, creating lasting structures in the material realm.",
    strengths: ["Reliability", "Organization", "Practical wisdom", "Steady progress"],
    challenges: ["Flexibility", "Embracing change", "Spiritual connection"],
    guidance: "Build your dreams on solid foundations while remaining open to divine inspiration.",
    elements: ["Earth", "Green", "Stone"]
  },
  5: {
    number: 5,
    title: "The Freedom Seeker",
    meaning: "Your spirit dances with the winds of change, bringing transformation and adventure to all you touch.",
    strengths: ["Adaptability", "Adventure spirit", "Quick mind", "Versatility"],
    challenges: ["Finding focus", "Commitment", "Grounding energy"],
    guidance: "Embrace change as your teacher while maintaining your spiritual center.",
    elements: ["Air", "Orange", "Feather"]
  },
  6: {
    number: 6,
    title: "The Divine Nurturer",
    meaning: "You carry the sacred responsibility of healing and nurturing, bringing harmony to home and heart.",
    strengths: ["Nurturing nature", "Responsibility", "Harmony creation", "Love giving"],
    challenges: ["Self-care", "Boundaries", "Perfectionism"],
    guidance: "As you care for others, remember to nurture your own divine light.",
    elements: ["Venus", "Pink", "Rose Quartz"]
  },
  7: {
    number: 7,
    title: "The Mystic Seeker",
    meaning: "Your path leads deep into the mysteries of existence, seeking wisdom in both spiritual and material realms.",
    strengths: ["Deep wisdom", "Analysis", "Spiritual connection", "Inner knowing"],
    challenges: ["Trust", "Material world", "Sharing wisdom"],
    guidance: "Balance your quest for knowledge with practical application and sharing.",
    elements: ["Neptune", "Silver", "Amethyst"]
  },
  8: {
    number: 8,
    title: "The Power Manifester",
    meaning: "You embody the infinite flow of abundance and power, bridging material and spiritual success.",
    strengths: ["Manifestation", "Leadership", "Material success", "Power balance"],
    challenges: ["Power use", "Material attachment", "Control"],
    guidance: "Use your power to create positive change and elevate others.",
    elements: ["Saturn", "Gold", "Diamond"]
  },
  9: {
    number: 9,
    title: "The Universal Healer",
    meaning: "You carry the completion energy of the numerical cycle, bringing wisdom, healing, and universal love.",
    strengths: ["Universal love", "Wisdom", "Healing ability", "Completion"],
    challenges: ["Attachment", "Boundaries", "Personal needs"],
    guidance: "Share your healing gifts while honoring your own journey of growth.",
    elements: ["Mars", "Purple", "Opal"]
  },
  11: {
    number: 11,
    title: "The Mystical Master",
    meaning: "You bear the mark of spiritual mastery, carrying profound intuitive gifts and visionary potential.",
    strengths: ["Spiritual insight", "Visionary abilities", "Inspirational force", "Higher awareness"],
    challenges: ["Grounding energy", "Managing sensitivity", "Practical matters"],
    guidance: "Your role is to bridge the material and spiritual realms, bringing higher wisdom to earth.",
    elements: ["Light", "White", "Crystal"]
  },
  22: {
    number: 22,
    title: "The Grand Builder",
    meaning: "You carry the sacred geometry of the master builder, with the power to manifest great visions into reality.",
    strengths: ["Manifestation power", "Practical wisdom", "Universal understanding", "Material mastery"],
    challenges: ["Handling power", "Meeting potential", "Balancing grand visions"],
    guidance: "Your destiny is to build lasting structures that serve humanity's spiritual evolution.",
    elements: ["Earth", "Gold", "Diamond"]
  }
};

const NAME_NUMEROLOGY: Record<string, number> = {
  'A': 1, 'J': 1, 'S': 1,
  'B': 2, 'K': 2, 'T': 2,
  'C': 3, 'L': 3, 'U': 3,
  'D': 4, 'M': 4, 'V': 4,
  'E': 5, 'N': 5, 'W': 5,
  'F': 6, 'O': 6, 'X': 6,
  'G': 7, 'P': 7, 'Y': 7,
  'H': 8, 'Q': 8, 'Z': 8,
  'I': 9, 'R': 9
};

export function LifePathCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLifePath = (date: string) => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const numbers = date.split('-').join('').split('');
      let sum = numbers.reduce((acc, num) => acc + parseInt(num), 0);
      
      while (sum > 22 || (sum > 9 && sum !== 11 && sum !== 22)) {
        sum = sum.toString().split('').reduce((acc, num) => acc + parseInt(num), 0);
      }

      setResult(NUMEROLOGY_MEANINGS[sum]);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-lg border border-purple-700/50 backdrop-blur-sm shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Sacred Life Path Calculator
        </h3>
        <p className="text-purple-300 mt-2">Unveil the Divine Blueprint of Your Soul's Journey</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Enter Your Sacred Birth Date:
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-purple-800/30 border border-purple-600/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <button
          onClick={() => calculateLifePath(birthDate)}
          disabled={isCalculating || !birthDate}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-300 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 group-hover:scale-110 transform transition-all duration-700 ease-out"></span>
          <span className="relative flex items-center justify-center space-x-2">
            {isCalculating ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Consulting the Celestial Spheres...</span>
              </>
            ) : (
              <>
                <span>🔮</span>
                <span>Reveal Your Life Path</span>
              </>
            )}
          </span>
        </button>

        <AnimatePresence>
          {result && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 bg-purple-900/20 p-6 rounded-lg border border-purple-600/30"
            >
              <div className="text-center">
                <h4 className="text-xl font-semibold text-purple-200">
                  {result.title}
                </h4>
                <div className="text-3xl font-bold my-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {result.number}
                </div>
              </div>

              <p className="text-purple-200 italic text-center">{result.meaning}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-purple-300">Divine Gifts:</h5>
                  <ul className="list-none space-y-1">
                    {result.strengths.map((strength, i) => (
                      <li key={i} className="flex items-center text-purple-200">
                        <span className="mr-2">✨</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-purple-300">Soul Lessons:</h5>
                  <ul className="list-none space-y-1">
                    {result.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-center text-purple-200">
                        <span className="mr-2">🌙</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-purple-800/20 rounded-lg">
                <h5 className="font-medium text-purple-300 mb-2">Mystical Elements:</h5>
                <div className="flex flex-wrap gap-2">
                  {result.elements.map((element, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-700/30 rounded-full text-purple-200 text-sm"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-purple-300 italic">{result.guidance}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ExpressionCalculator() {
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateExpression = (name: string) => {
    setIsCalculating(true);

    setTimeout(() => {
      const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
      let sum = 0;
      
      for (const letter of cleanName) {
        sum += NAME_NUMEROLOGY[letter] || 0;
      }

      while (sum > 22 || (sum > 9 && sum !== 11 && sum !== 22)) {
        sum = sum.toString().split('').reduce((acc, num) => acc + parseInt(num), 0);
      }

      setResult(NUMEROLOGY_MEANINGS[sum]);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-lg border border-purple-700/50 backdrop-blur-sm shadow-lg mt-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Mystical Expression Calculator
        </h3>
        <p className="text-purple-300 mt-2">Decode the Sacred Vibrations of Your Name</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Enter Your Full Name:
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="As written on your soul's scroll..."
            className="w-full p-3 rounded-lg bg-purple-800/30 border border-purple-600/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <button
          onClick={() => calculateExpression(fullName)}
          disabled={isCalculating || !fullName}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-300 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 group-hover:scale-110 transform transition-all duration-700 ease-out"></span>
          <span className="relative flex items-center justify-center space-x-2">
            {isCalculating ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Decoding Sacred Vibrations...</span>
              </>
            ) : (
              <>
                <span>🔮</span>
                <span>Reveal Your Expression Number</span>
              </>
            )}
          </span>
        </button>

        <AnimatePresence>
          {result && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 bg-purple-900/20 p-6 rounded-lg border border-purple-600/30"
            >
              <div className="text-center">
                <h4 className="text-xl font-semibold text-purple-200">
                  {result.title}
                </h4>
                <div className="text-3xl font-bold my-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {result.number}
                </div>
              </div>

              <p className="text-purple-200 italic text-center">{result.meaning}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-purple-300">Divine Gifts:</h5>
                  <ul className="list-none space-y-1">
                    {result.strengths.map((strength, i) => (
                      <li key={i} className="flex items-center text-purple-200">
                        <span className="mr-2">✨</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-purple-300">Soul Lessons:</h5>
                  <ul className="list-none space-y-1">
                    {result.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-center text-purple-200">
                        <span className="mr-2">🌙</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-purple-800/20 rounded-lg">
                <h5 className="font-medium text-purple-300 mb-2">Mystical Elements:</h5>
                <div className="flex flex-wrap gap-2">
                  {result.elements.map((element, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-700/30 rounded-full text-purple-200 text-sm"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-purple-300 italic">{result.guidance}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 