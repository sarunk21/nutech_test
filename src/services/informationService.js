const bannerRepository = require('../repositories/bannerRepository');
const serviceRepository = require('../repositories/serviceRepository');

/**
 * Information Service
 * Handle business logic untuk Information (Banner & Service)
 */
class InformationService {
  /**
   * Get all banners with pagination
   * @param {Number} page - Page number
   * @param {Number} limit - Limit per page
   * @returns {Promise<Object>} Object with banners data and pagination info
   */
  async getAllBanners(page = 1, limit = 10) {
    const banners = await bannerRepository.findAll(page, limit);
    const total = await bannerRepository.count();
    
    // Format response sesuai dengan dokumentasi
    const formattedBanners = banners.map(banner => ({
      banner_name: banner.banner_name,
      banner_image: `${process.env.APP_URL}/uploads/${banner.banner_image}`,
      description: banner.description || ''
    }));

    return {
      data: formattedBanners,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get all services with pagination
   * @param {Number} page - Page number
   * @param {Number} limit - Limit per page
   * @returns {Promise<Object>} Object with services data and pagination info
   */
  async getAllServices(page = 1, limit = 10) {
    const services = await serviceRepository.findAll(page, limit);
    const total = await serviceRepository.count();
    
    // Format response sesuai dengan dokumentasi
    const formattedServices = services.map(service => ({
      service_code: service.service_code,
      service_name: service.service_name,
      service_icon: `${process.env.APP_URL}/uploads/${service.service_icon}`,
      service_tariff: service.service_tariff
    }));

    return {
      data: formattedServices,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new InformationService();

