const informationService = require('../services/informationService');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Information Controller
 * Handle HTTP requests untuk Information (Banner & Service)
 */
class InformationController {
  /**
   * Get all banners
   * GET /banner
   */
  async getAllBanners(req, res) {
    try {
      const banners = await informationService.getAllBanners();

      return ResponseHelper.success(res, banners, 'Sukses');
    } catch (error) {
      console.error('Error getting banners:', error);
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  /**
   * Get all services
   * GET /services
   */
  async getAllServices(req, res) {
    try {
      const services = await informationService.getAllServices();

      return ResponseHelper.success(res, services, 'Sukses');
    } catch (error) {
      console.error('Error getting services:', error);
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = new InformationController();
