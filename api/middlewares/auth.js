const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      code: 401,
      status: "Unauthorized",
      message: "No authorization token provided",
    });
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).send({
      code: 401,
      status: "Unauthorized",
      message: "Invalid token format. Use Bearer token",
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];
  const app_secret = process.env.SECRET_CODE;

  if (token !== app_secret) {
    return res.status(403).send({
      code: 403,
      status: "Forbidden",
      message: "Invalid API token provided",
    });
  }

  // Continue to the next middleware/route handler
  next();
};

module.exports = authMiddleware;
