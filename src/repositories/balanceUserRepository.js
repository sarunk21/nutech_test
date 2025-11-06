const db = require('../config/database');

/**
 * Balance User Repository
 * Handle semua database operations untuk Balance User
 */
class BalanceUserRepository {
    /**
     * Get balance user by user ID
     * @param {Number} userId - User ID
     * @returns {Promise<Object|null>} Balance user object or null
     */
    async findByUserId(userId) {
        const [rows] = await db.query(
            'SELECT id, user_id, balance, created_at, updated_at FROM balance_user WHERE user_id = ?',
            [userId]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Create new balance user
     * @param {Object} balanceUserData - Balance user data
     * @returns {Promise<Object>} Created balance user object
     */
    async create(balanceUserData) {
        const { user_id, balance } = balanceUserData;

        const [result] = await db.query(
            'INSERT INTO balance_user (user_id, balance) VALUES (?, ?)',
            [user_id, balance]
        );

        return {
            id: result.insertId,
            user_id,
            balance
        };
    }

    /**
     * Update balance user
     * @param {Number} userId - User ID
     * @param {Object} balanceUserData - Balance user data
     * @returns {Promise<Boolean>} Success status
     */
    async update(userId, balanceUserData) {
        const { balance } = balanceUserData;
        const [result] = await db.query(
            'UPDATE balance_user SET balance = ? WHERE user_id = ?',
            [balance, userId]
        );

        return result.affectedRows > 0;
    }

    /**
     * Get balance user by user ID with row lock (FOR UPDATE)
     * Digunakan dalam transaction untuk mencegah race condition
     * @param {Object} connection - MySQL connection object
     * @param {Number} userId - User ID
     * @returns {Promise<Object|null>} Balance user object or null
     */
    async findByUserIdWithLock(connection, userId) {
        const [rows] = await connection.query(
            'SELECT id, user_id, balance, created_at, updated_at FROM balance_user WHERE user_id = ? FOR UPDATE',
            [userId]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Update balance user menggunakan connection (dalam transaction)
     * @param {Object} connection - MySQL connection object
     * @param {Number} userId - User ID
     * @param {Object} balanceUserData - Balance user data
     * @returns {Promise<Boolean>} Success status
     */
    async updateWithConnection(connection, userId, balanceUserData) {
        const { balance } = balanceUserData;
        const [result] = await connection.query(
            'UPDATE balance_user SET balance = ? WHERE user_id = ?',
            [balance, userId]
        );

        return result.affectedRows > 0;
    }

    /**
     * Create new balance user menggunakan connection (dalam transaction)
     * @param {Object} connection - MySQL connection object
     * @param {Object} balanceUserData - Balance user data
     * @returns {Promise<Object>} Created balance user object
     */
    async createWithConnection(connection, balanceUserData) {
        const { user_id, balance } = balanceUserData;

        const [result] = await connection.query(
            'INSERT INTO balance_user (user_id, balance) VALUES (?, ?)',
            [user_id, balance]
        );

        return {
            id: result.insertId,
            user_id,
            balance
        };
    }
}

module.exports = new BalanceUserRepository();