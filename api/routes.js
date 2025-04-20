const { Router } = require('express');

const { caching } = require('./middlewares');
const SurahHandler = require('./handlers/surah');
const JuzHandler = require('./handlers/juz');

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  next();
});

router.get('/', (req, res) => res.status(200).send({
  surah: {
    listSurah: '/surah',
    spesificSurah: {
      pattern: '/surah/{surah}',
      example: '/surah/18?page=1&limit=30'
    },
    spesificAyahInSurah: {
      pattern: '/surah/{surah}/{ayah}',
      example: '/surah/18/60?page=1&limit=30'
    },
    aayahRangeInSurah: {
      pattern: '/surah/{surah}/{ayahStart}-{ayahEnd}',
      example: '/surah/114/1-6?page=1&lim'
    },
    spesificJuz: {
      pattern: '/juz/{juz}',
      example: '/juz/30?page=1&limit=30'
    }
  },
  maintaner: 'HelloFaizan <mohammadfaizan.in>',
  source: 'https://github.com/hellofaizan/quran-api'
}));

router.get('/surah', caching, SurahHandler.getAllSurah);

router.get('/surah/:surah', caching, SurahHandler.getSurah);
router.get('/surah/:surah/:ayah', caching, SurahHandler.getAyahFromSurah);
router.get('/juz/:juz', caching, JuzHandler.getJuz);

// fallback router
router.all('*', (req, res) => res.status(404).send({
  code: 404,
  status: 'Not Found.',
  message: `Resource "${req.url}" is not found.`
}));

module.exports = router;
