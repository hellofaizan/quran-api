const surahData = require("../lib/surah.js");

class SurahHandler {
  static getAllSurah(req, res) {
    const { data: quran } = require("../../data/quran.json");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const allSurahs = quran.map((item) => {
      const surah = { ...item };
      const verseCount = surah.verses ? surah.verses.length : 0;
      delete surah.verses;
      delete surah.preBismillah;
      return {
        number: surah.number,
        name: {
          arab: surah.name.long,
          arabeng: surah.name.transliteration,
          translation: surah.name.translation,
        },
        revelation: surah.revelation.en,
        verse_count: verseCount
      };
    });

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(allSurahs.length / limit);
    const paginatedSurahs = allSurahs.slice(startIndex, endIndex);

    return res.status(200).send({
      code: 200,
      status: "OK.",
      message: "Success fetching all surah.",
      data: {
        pagination: {
          totalSurahs: allSurahs.length,
          totalPages,
          currentPage: page,
          surahsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        surahs: paginatedSurahs,
      },
    });
  }

  static getSurah(req, res) {
    const { surah } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = surahData(parseInt(surah), page, limit);

    if (!data) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Surah "${surah}" is not found.`,
        data: {},
      });
    }

    return res.status(200).send({
      code: 200,
      status: "OK.",
      message: "Success fetching surah.",
      data,
    });
  }

  static getAyahFromSurah(req, res) {
    const { surah, ayah } = req.params;
    const { data: quran } = require("../../data/quran.json");

    // Check if the ayah parameter contains a range (e.g., "1-6")
    const isRange = ayah.includes("-");

    const checkSurah = quran[surah - 1];
    if (!checkSurah) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Surah "${surah}" is not found.`,
        data: {},
      });
    }

    // Handle range request
    if (isRange) {
      const [startAyah, endAyah] = ayah.split("-").map((num) => parseInt(num));

      // Validate range numbers
      if (
        isNaN(startAyah) ||
        isNaN(endAyah) ||
        startAyah < 1 ||
        endAyah < startAyah
      ) {
        return res.status(400).send({
          code: 400,
          status: "Bad Request.",
          message:
            "Invalid ayah range format. Use format: startAyah-endAyah (e.g., 1-6)",
          data: {},
        });
      }

      // Check if range exceeds surah length
      if (
        startAyah > checkSurah.verses.length ||
        endAyah > checkSurah.verses.length
      ) {
        return res.status(404).send({
          code: 404,
          status: "Not Found.",
          message: `Ayah range ${startAyah}-${endAyah} exceeds surah length (${checkSurah.verses.length} verses)`,
          data: {},
        });
      }

      // Get verses in range
      const verses = checkSurah.verses
        .slice(startAyah - 1, endAyah)
        .map((verse) => ({
          number: verse.number,
          text: {
            arab: verse.text.arab,
            arabeng: verse.text.en,
            translation: verse.text.translation,
          },
          audio: verse.audio.primary,
        }));

      const data = {
        surah: {
          number: checkSurah.number,
          name: {
            arab: checkSurah.name.long,
            arabeng: checkSurah.name.transliteration,
            translation: checkSurah.name.translation,
          },
        },
        ayahRange: {
          start: startAyah,
          end: endAyah,
          total: verses.length,
        },
        verses,
      };

      return res.status(200).send({
        code: 200,
        status: "OK.",
        message: "Success fetching ayah range",
        data,
      });
    }

    // Handle single ayah request
    const checkAyah = checkSurah.verses[ayah - 1];
    if (!checkAyah) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Ayah "${ayah}" in surah "${surah}" is not found.`,
        data: {},
      });
    }

    const data = {
      number: checkAyah.number,
      text: {
        arab: checkAyah.text.arab,
        arabeng: checkAyah.text.en,
        translation: checkAyah.text.translation,
      },
      audio: checkAyah.audio.primary,
      surah: {
        number: checkSurah.number,
        name: {
          arab: checkSurah.name.long,
          arabeng: checkSurah.name.en,
          translation: checkSurah.name.translation,
        },
      },
    };

    return res.status(200).send({
      code: 200,
      status: "OK.",
      message: "Success fetching ayah",
      data,
    });
  }
}

module.exports = SurahHandler;
