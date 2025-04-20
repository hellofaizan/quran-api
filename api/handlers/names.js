const names = require('../../data/allahnames.json');

class NamesHandler {
  static getAllNames(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(names.length / limit);
    const paginatedNames = names.slice(startIndex, endIndex);

    return res.status(200).send({
      code: 200,
      status: "OK.",
      message: "Success fetching all names.",
      data: {
        pagination: {
          totalNames: names.length,
          totalPages,
          currentPage: page,
          namesPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        names: paginatedNames,
      },
    });
  }

  static getNameByNumber(req, res) {
    const { number } = req.params;
    const name = names[number - 1];

    if (!name) {
      return res.status(404).send({
        code: 404,
        status: "Not Found.",
        message: `Name number "${number}" is not found.`,
        data: {},
      });
    }

    return res.status(200).send({
      code: 200,
      status: "OK.",
      message: "Success fetching name.",
      data: name,
    });
  }
}

module.exports = NamesHandler;
