const juzData = require('../lib/juz.js');

class JuzHandler {
  static getJuz(req, res) {
    const { juz } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = juzData(parseInt(juz), page, limit);

    if (!data) {
      return res.status(404).send({
        code: 404,
        status: 'Not Found.',
        message: `Juz "${juz}" is not found.`,
        data: {}
      });
    }

    return res.status(200).send({
      code: 200,
      status: 'OK.',
      message: 'Success fetching juz.',
      data
    });
  }

  static getAllJuz(req, res) {
    const { data: juzList } = require('../../data/juz.json');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const allJuz = juzList.map((juz) => ({
      index: juz.index,
      surahs: juz.surahs,
    }));

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(allJuz.length / limit);
    const paginatedJuz = allJuz.slice(startIndex, endIndex);

    return res.status(200).send({
      code: 200,
      status: 'OK.',
      message: 'Success fetching all juz.',
      data: {
        pagination: {
          totalJuz: allJuz.length,
          totalPages,
          currentPage: page,
          juzPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        juz: paginatedJuz,
      },
    });
  }
}

module.exports = JuzHandler;
