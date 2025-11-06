const db = require('../config/database');

/**
 * Service Repository
 * Handle semua database operations untuk Service
 */
class ServiceRepository {
  /**
   * Get all services
   * @returns {Promise<Array>} Array of services
   */
  async findAll() {
    const [rows] = await db.query(
      'SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at FROM services ORDER BY service_code ASC'
    );
    return rows;
  }

  /**
   * Find service by ID
   * @param {Number} id - Service ID
   * @returns {Promise<Object|null>} Service object or null
   */
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at FROM services WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find service by service_code
   * @param {String} serviceCode - Service code
   * @returns {Promise<Object|null>} Service object or null
   */
  async findByServiceCode(serviceCode) {
    const [rows] = await db.query(
      'SELECT id, service_code, service_name, service_icon, service_tariff, created_at, updated_at FROM services WHERE service_code = ?',
      [serviceCode]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = new ServiceRepository();

