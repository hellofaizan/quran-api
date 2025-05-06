const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const quranPath = path.join(__dirname, '../data/quran.json');
const quranData = require(quranPath);

const MAX_RETRIES = 3;
const DELAY_MS = 1000;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      if (attempt < retries) {
        console.warn(`Retry ${attempt} for ${url}...`);
        await new Promise(res => setTimeout(res, DELAY_MS));
      } else {
        throw err;
      }
    }
  }
}

async function addUrduToAllSurahs() {
  for (let surahNumber = 2; surahNumber <= 114; surahNumber++) {
    const surah = quranData.data[surahNumber - 1];
    if (!surah) {
      console.error(`Surah ${surahNumber} not found in quran.json`);
      continue;
    }
    for (let i = 0; i < surah.verses.length; i++) {
      const ayahNumber = i + 1;
      const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-muhammadjunagar/${surahNumber}/${ayahNumber}.json`;
      try {
        const data = await fetchWithRetry(url);
        surah.verses[i].text.urdu = data.text;
        console.log(`Added Urdu for Surah ${surahNumber}, Ayah ${ayahNumber}`);
      } catch (err) {
        console.error(`Failed for Surah ${surahNumber}, Ayah ${ayahNumber}:`, err.message);
      }
    }
    // Save after each surah
    fs.writeFileSync(quranPath, JSON.stringify(quranData, null, 2));
    console.log(`Urdu translation added for Surah ${surahNumber} in quran.json`);
  }
  console.log('All surahs processed.');
}

addUrduToAllSurahs();
