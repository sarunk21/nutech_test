const db = require('../config/database');

/**
 * Banner Repository
 * Handle semua database operations untuk Banner
 */
class BannerRepository {
  /**
   * Get all banners
   * @returns {Promise<Array>} Array of banners
   */
  async findAll() {
    const [rows] = await db.query(
      'SELECT id, banner_name, banner_image, description, created_at, updated_at FROM banners ORDER BY created_at DESC'
    );
    return rows;
  }

  /**
   * Find banner by ID
   * @param {Number} id - Banner ID
   * @returns {Promise<Object|null>} Banner object or null
   */
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, banner_name, banner_image, description, created_at, updated_at FROM banners WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = new BannerRepository();

