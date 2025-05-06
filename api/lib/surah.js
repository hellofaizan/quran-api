const { data: quran } = require("../../data/quran.json");

const surahData = (_inputSurah, page = 1, limit = 10) => {
  const surah = quran[_inputSurah - 1];
  if (!surah) return null;

  const verseCount = surah.verses ? surah.verses.length : 0;

  // Simplify verses to only include necessary information
  const simplifiedVerses = surah.verses.map((verse) => ({
    number: verse.number,
    meta: verse.meta,
    text: {
      arab: verse.text.arab,
      arabeng: verse.text.en,
      translation: verse.text.translation,
      urdu: verse.text.urdu
    },
    audio: verse.audio.primary,
  }));

  // Implement pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPages = Math.ceil(simplifiedVerses.length / limit);

  const paginatedVerses = simplifiedVerses.slice(startIndex, endIndex);

  const data = {
    number: surah.number,
    name: {
      arab: surah.name.long,
      arabeng: surah.name.transliteration,
      translation: surah.name.translation,
    },
    revelation: surah.revelation.en,
    pagination: {
      totalVerses: simplifiedVerses.length,
      totalPages,
      currentPage: page,
      versesPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    verses: paginatedVerses,
    verse_count: verseCount
  };

  return data;
};

module.exports = surahData;
