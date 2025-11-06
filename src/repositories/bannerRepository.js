const db = require('../config/database');

/**
 * Banner Repository
 * Handle semua database operations untuk Banner
 */
class BannerRepository {
  /**
   * Get all banners with pagination
   * @param {Number} page - Page number (starting from 1)
   * @param {Number} limit - Limit of banners per page
   * @returns {Promise<Array>} Array of banners
   */
  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      'SELECT id, banner_name, banner_image, description, created_at, updated_at FROM banners ORDER BY created_at DESC LIMIT ?, ?',
      [offset, limit]
    );
    return rows;
  }

  /**
   * Count total banners
   * @returns {Promise<Number>} Total count of banners
   */
  async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM banners');
    return rows[0].total;
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

