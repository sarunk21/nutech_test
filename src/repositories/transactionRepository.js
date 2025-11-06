const db = require('../config/database');

/**
 * Transaction Repository
 * Handle semua database operations untuk Transaction
 */
class TransactionRepository {
    /**
     * Get all transactions with pagination
     * @param {Number} userId - User ID
     * @param {Number} page - Page number (starting from 1)
     * @param {Number} limit - Limit of transactions per page
     * @returns {Promise<Array>} Array of transactions
     */
    async findAll(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await db.query(
            'SELECT id, user_id, service_id, transaction_type, total_amount, invoice_number, created_at, updated_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?',
            [userId, offset, limit]
        );
        return rows;
    }

    /**
     * Count total transactions by user ID
     * @param {Number} userId - User ID
     * @returns {Promise<Number>} Total count of transactions
     */
    async countByUserId(userId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
            [userId]
        );
        return rows[0].total;
    }

    /**
     * Create new transaction
     * @param {Object} transactionData - Transaction data
     * @returns {Promise<Object>} Created transaction object
     */
    async create(transactionData) {
        const { user_id, service_id, transaction_type, total_amount, invoice_number } = transactionData;
        const [result] = await db.query(
            'INSERT INTO transactions (user_id, service_id, transaction_type, total_amount, invoice_number) VALUES (?, ?, ?, ?, ?)',
            [user_id, service_id, transaction_type, total_amount, invoice_number]
        );
        return {
            id: result.insertId,
            user_id,
            service_id,
            transaction_type,
            total_amount,
            invoice_number
        };
    }

    /**
     * Update transaction
     * @returns {Promise<String|null>} Last invoice number or null
     */
    async getLastInvoiceNumber() {
        const [rows] = await db.query(
            'SELECT invoice_number FROM transactions ORDER BY id DESC LIMIT 1'
        );
        return rows.length > 0 ? rows[0].invoice_number : null;
    }

    /**
     * Create new transaction menggunakan connection (dalam transaction)
     * @param {Object} connection - MySQL connection object
     * @param {Object} transactionData - Transaction data
     * @returns {Promise<Object>} Created transaction object
     */
    async createWithConnection(connection, transactionData) {
        const { user_id, service_id, transaction_type, total_amount, invoice_number } = transactionData;
        const [result] = await connection.query(
            'INSERT INTO transactions (user_id, service_id, transaction_type, total_amount, invoice_number) VALUES (?, ?, ?, ?, ?)',
            [user_id, service_id, transaction_type, total_amount, invoice_number]
        );
        return {
            id: result.insertId,
            user_id,
            service_id,
            transaction_type,
            total_amount,
            invoice_number,
            created_at: new Date()
        };
    }

    /**
     * Get last invoice number menggunakan connection (dalam transaction)
     * Dengan FOR UPDATE untuk mencegah race condition
     * @param {Object} connection - MySQL connection object
     * @returns {Promise<String|null>} Last invoice number or null
     */
    async getLastInvoiceNumberWithConnection(connection) {
        const [rows] = await connection.query(
            'SELECT invoice_number FROM transactions ORDER BY id DESC LIMIT 1 FOR UPDATE'
        );
        return rows.length > 0 ? rows[0].invoice_number : null;
    }
}
module.exports = new TransactionRepository();