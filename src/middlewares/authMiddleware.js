const JWTHelper = require('../utils/jwtHelper');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Middleware untuk memverifikasi JWT token
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token dari header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ResponseHelper.unauthorized(res, 'Token tidak ditemukan');
    }

    // Check format: Bearer <token>
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return ResponseHelper.unauthorized(res, 'Format token tidak valid. Format: Bearer <token>');
    }

    const token = parts[1];

    // Verify token
    const decoded = JWTHelper.verifyAccessToken(token);

    // Attach user info ke request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      first_name: decoded.first_name,
      last_name: decoded.last_name
    };

    next();
  } catch (error) {
    return ResponseHelper.unauthorized(res, error.message);
  }
};

/**
 * Middleware optional auth - tidak wajib login tapi jika ada token akan diverifikasi
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const decoded = JWTHelper.verifyAccessToken(token);
        
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name
        };
      }
    }

    next();
  } catch (error) {
    // Jika error, tetap lanjutkan tanpa user info
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
