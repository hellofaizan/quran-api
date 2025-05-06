const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

if (process.argv.length < 3) {
  console.error('Usage: node scripts/add-urdu-translation.js <surah_number>');
  process.exit(1);
}

const surahNumber = parseInt(process.argv[2]);
if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
  console.error('Invalid surah number. Must be between 1 and 114.');
  process.exit(1);
}

const quranPath = path.join(__dirname, '../data/quran.json');
const quranData = require(quranPath);

async function addUrduTranslation() {
  const surah = quranData.data[surahNumber - 1];
  if (!surah) {
    console.error('Surah not found in quran.json');
    process.exit(1);
  }

  for (let i = 0; i < surah.verses.length; i++) {
    const ayahNumber = i + 1;
    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-muhammadjunagar/${surahNumber}/${ayahNumber}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      surah.verses[i].text.urdu = data.text;
      console.log(`Added Urdu for Surah ${surahNumber}, Ayah ${ayahNumber}`);
    } catch (err) {
      console.error(`Failed for Surah ${surahNumber}, Ayah ${ayahNumber}:`, err.message);
    }
  }

  // Save the updated quran.json
  fs.writeFileSync(quranPath, JSON.stringify(quranData, null, 2));
  console.log(`Urdu translation added for Surah ${surahNumber} in quran.json`);
}

addUrduTranslation();
