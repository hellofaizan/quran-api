const surahData = require("../lib/surah.js");

class SurahHandler {
  static getAllSurah(req, res) {
    const { data: quran } = require("../../data/quran.json");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const allSurahs = quran.map((item) => {
      const surah = { ...item };
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
          hasPrevPage: page > 1
        },
        surahs: paginatedSurahs
      }
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
    const checkSurah = quran[surah - 1];

    if (!checkSurah) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Surah "${surah}" is not found.`,
        data: {},
      });
    }

    const checkAyah = checkSurah.verses[ayah - 1];
    if (!checkAyah) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Ayah "${ayah}" in surah "${surah}" is not found.`,
        data: {},
      });
    }

    const dataSurah = { ...checkSurah };
    delete dataSurah.verses;

    const data = {
      surah: {
        number: dataSurah.number,
        name: {
          arab: dataSurah.name.long,
          arabeng: dataSurah.name.transliteration,
          translation: dataSurah.name.translation,
        },
      },
      number: checkAyah.number,
      text: {
        arab: checkAyah.text.arab,
        arabeng: checkAyah.text.en,
        translation: checkAyah.text.translation,
      },
      audio: checkAyah.audio.primary,
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
