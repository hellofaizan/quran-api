const fs = require("fs");
const path = require("path");

const juzPath = path.join(__dirname, "../data/juz.json");
const quranPath = path.join(__dirname, "../data/quran.json");

const juzData = require(juzPath);
const quranData = require(quranPath);

// Helper to get surah info by index (1-based)
function getSurahInfo(index) {
  const surah = quranData.data[index - 1];
  return {
    number: surah.number,
    name: {
      arab: surah.name.long,
      transliteration: surah.name.transliteration,
      translation: surah.name.translation,
    },
  };
}

const transformedJuz = juzData.data.map((juz) => {
  const startSurahIdx = juz.start.index;
  const endSurahIdx = juz.end.index;
  // Collect all surah indices in this juz
  const surahIndices = [];
  for (let i = startSurahIdx; i <= endSurahIdx; i++) {
    surahIndices.push(i);
  }
  // Map to surah info
  const surahs = surahIndices.map(getSurahInfo);
  return {
    ...juz,
    surahs,
  };
});

const output = {
  ...juzData,
  data: transformedJuz,
};

fs.writeFileSync(juzPath, JSON.stringify(output, null, 2));
console.log("Successfully added surah names to each juz in juz.json");
