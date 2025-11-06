const db = require('../config/database');

/**
 * User Repository
 * Handle semua database operations untuk User
 */
class UserRepository {
  /**
   * Find user by ID
   * @param {Number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, profile_image, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, profile_image, password, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const { first_name, last_name, email, password } = userData;
    
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, password]
    );

    return {
      id: result.insertId,
      first_name,
      last_name,
      email
    };
  }

  /**
   * Update user
   * @param {Number} id - User ID
   * @param {Object} userData - Data to update
   * @returns {Promise<Boolean>} Success status
   */
  async update(id, userData) {
    const fields = [];
    const values = [];

    if (userData.first_name) {
      fields.push('first_name = ?');
      values.push(userData.first_name);
    }

    if (userData.last_name) {
      fields.push('last_name = ?');
      values.push(userData.last_name);
    }

    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }

    if (userData.profile_image !== undefined) {
      fields.push('profile_image = ?');
      values.push(userData.profile_image);
    }

    if (userData.password) {
      fields.push('password = ?');
      values.push(userData.password);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Check if email exists
   * @param {String} email - Email to check
   * @param {Number} excludeId - User ID to exclude from check
   * @returns {Promise<Boolean>} True if exists
   */
  async emailExists(email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE email = ?';
    const params = [email];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  }
}

module.exports = new UserRepository();
