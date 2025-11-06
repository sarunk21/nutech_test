const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWTHelper {
  /**
   * Generate access token
   * @param {Object} payload - Data to encode in token
   * @returns {String} JWT token
   */
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    });
  }

  /**
   * Verify access token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token data
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token tidak valid atau sudah kadaluarsa');
    }
  }

  /**
   * Decode token without verification
   * @param {String} token - JWT token to decode
   * @returns {Object} Decoded token data
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTHelper;
