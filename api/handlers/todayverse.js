const path = require('path');
const quranData = require(path.join(__dirname, '../../data/quran.json'));

// Deterministic seeded random function based on date string
function seededRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  h += h << 13; h ^= h >>> 7;
  h += h << 3; h ^= h >>> 17;
  h += h << 5;
  return ((h >>> 0) % 100000) / 100000;
}

class TodayVerseHandler {
  static getTodayVerse(req, res) {
    // Flatten all verses with metadata
    const allVerses = [];
    quranData.data.forEach((surah) => {
      surah.verses.forEach((verse) => {
        allVerses.push({
          surahNumber: surah.number,
          surahName: surah.name,
          verseNumber: verse.number,
          text: verse.text,
        });
      });
    });
    // Get today's date as seed
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const rand = seededRandom(today);
    const idx = Math.floor(rand * allVerses.length);
    const todayVerse = allVerses[idx];
    res.status(200).send({
      code: 200,
      status: 'OK',
      data: todayVerse,
    });
  }
}

module.exports = TodayVerseHandler;
