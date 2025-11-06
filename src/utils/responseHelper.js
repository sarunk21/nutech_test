class ResponseHelper {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      data
    });
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {*} error - Error details
   */
  static error(res, message = 'Terjadi kesalahan', statusCode = 500, error = null) {
    const response = {
      status: statusCode,
      message,
      data: null
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   */
  static validationError(res, errors) {
    return res.status(422).json({
      status: 422,
      message: 'Parameter tidak valid',
      data: null
    });
  }

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      status: 401,
      message,
      data: null
    });
  }

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      status: 403,
      message,
      data: null
    });
  }

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      status: 404,
      message,
      data: null
    });
  }
}

module.exports = ResponseHelper;
