const fs = require("fs");
const path = require("path");

// Read the original quran.json
const quranPath = path.join(__dirname, "../data/quran.json");
const quranData = require(quranPath);

// Transform the data
const transformedData = {
  ...quranData,
  data: quranData.data.map((surah) => {
    // Create a new surah object without tafsir and sequence
    const { tafsir, sequence, ...surahWithoutExcluded } = surah;

    return {
      ...surahWithoutExcluded,
      name: {
        long: surah.name.long, // Preserve original Unicode format
        translation: surah.name.translation.en,
        transliteration: surah.name.transliteration.en,
      },
      revelation: {
        arab: surah.revelation.arab,
        en: surah.revelation.en,
      },
      verses: surah.verses.map((verse) => {
        // Remove tafsir from verse data
        const { tafsir, translation, ...verseWithoutTafsirAndTranslation } =
          verse;
        return {
          ...verseWithoutTafsirAndTranslation,
          text: {
            arab: verse.text.arab, // Preserve original Unicode format
            en: verse.text.transliteration.en,
            translation: verse.translation.en,
          },
        };
      }),
    };
  }),
};

// Write the transformed data back to quran.json with Unicode escapes
const jsonString = JSON.stringify(transformedData, null, 2);
fs.writeFileSync(quranPath, jsonString);
