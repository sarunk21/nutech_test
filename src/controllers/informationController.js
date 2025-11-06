const informationService = require('../services/informationService');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Information Controller
 * Handle HTTP requests untuk Information (Banner & Service)
 */
class InformationController {
  /**
   * Get all banners with pagination
   * GET /banner?page=1&limit=10
   */
  async getAllBanners(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validasi page dan limit
      if (isNaN(page) || page < 1) {
        return ResponseHelper.error(res, 'Parameter page harus berupa angka positif', 400);
      }

      if (isNaN(limit) || limit < 1) {
        return ResponseHelper.error(res, 'Parameter limit harus berupa angka positif', 400);
      }

      const result = await informationService.getAllBanners(page, limit);

      return ResponseHelper.success(res, result, 'Sukses');
    } catch (error) {
      console.error('Error getting banners:', error);
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  /**
   * Get all services with pagination
   * GET /services?page=1&limit=10
   */
  async getAllServices(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validasi page dan limit
      if (isNaN(page) || page < 1) {
        return ResponseHelper.error(res, 'Parameter page harus berupa angka positif', 400);
      }

      if (isNaN(limit) || limit < 1) {
        return ResponseHelper.error(res, 'Parameter limit harus berupa angka positif', 400);
      }

      const result = await informationService.getAllServices(page, limit);

      return ResponseHelper.success(res, result, 'Sukses');
    } catch (error) {
      console.error('Error getting services:', error);
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = new InformationController();
