const bannerRepository = require('../repositories/bannerRepository');
const serviceRepository = require('../repositories/serviceRepository');

/**
 * Information Service
 * Handle business logic untuk Information (Banner & Service)
 */
class InformationService {
  /**
   * Get all banners
   * @returns {Promise<Array>} Array of banners
   */
  async getAllBanners() {
    const banners = await bannerRepository.findAll();
    
    // Format response sesuai dengan dokumentasi
    return banners.map(banner => ({
      banner_name: banner.banner_name,
      banner_image: `${process.env.APP_URL}/uploads/${banner.banner_image}`,
      description: banner.description || ''
    }));
  }

  /**
   * Get all services
   * @returns {Promise<Array>} Array of services
   */
  async getAllServices() {
    const services = await serviceRepository.findAll();
    
    // Format response sesuai dengan dokumentasi
    return services.map(service => ({
      service_code: service.service_code,
      service_name: service.service_name,
      service_icon: `${process.env.APP_URL}/uploads/${service.service_icon}`,
      service_tariff: service.service_tariff
    }));
  }
}

module.exports = new InformationService();

