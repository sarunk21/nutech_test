const db = require('../config/database');
const balanceUserRepository = require('../repositories/balanceUserRepository');
const transactionRepository = require('../repositories/transactionRepository');
const userRepository = require('../repositories/userRepository');
const serviceRepository = require('../repositories/serviceRepository');

/**
 * Transaction Service
 * Handle business logic untuk Transaction (Balance & Transactions)
 */
class TransactionService {
  /**
   * Generate invoice number
   * @param {String} lastInvoiceNumber - Last invoice number
   * @returns {String} Generated invoice number
   */
  generateInvoiceNumber(lastInvoiceNumber) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const todayDate = `${day}${month}${year}`;

    if (!lastInvoiceNumber) {
      return `INV${todayDate}-001`;
    }

    // Extract date and number from last invoice number
    // Format: INVDDMMYYYY-XXX
    const lastDate = lastInvoiceNumber.substring(3, 11); // Get DDMMYYYY part
    const lastNumber = parseInt(lastInvoiceNumber.split('-')[1]);

    // Jika tanggal invoice terakhir berbeda dengan hari ini, reset ke 001
    if (lastDate !== todayDate) {
      return `INV${todayDate}-001`;
    }

    // Increment nomor invoice
    const newInvoiceNumber = String(lastNumber + 1).padStart(3, '0');
    return `INV${todayDate}-${newInvoiceNumber}`;
  }

  /**
   * Get balance by user ID
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} Balance object
   */
  async getBalanceByUserId(userId) {
    const balance = await balanceUserRepository.findByUserId(userId);
    if (!balance) {
      // Create balance user
      const newBalance = await balanceUserRepository.create({
        user_id: userId,
        balance: 0
      });
      return newBalance;
    } else {
      return balance;
    }
  }

  /**
   * Create new balance
   * @param {Object} balanceData - Balance data
   * @returns {Promise<Object>} Created balance object
   */
  async createBalance(balanceData) {
    const balance = await balanceUserRepository.create(balanceData);
    return balance;
  }

  /**
   * Update balance
   * @param {Number} userId - User ID
   * @param {Object} balanceData - Balance data
   * @returns {Promise<Boolean>} Success status
   */
  async updateBalance(userId, balanceData) {
    const success = await balanceUserRepository.update(userId, balanceData);
    return success;
  }

  /**
   * Get all transactions by user ID with pagination
   * @param {Number} userId - User ID
   * @param {Number} page - Page number
   * @param {Number} limit - Limit for pagination
   * @returns {Promise<Object>} Object with transactions data and pagination info
   */
  async getTransactionsByUserId(userId, page = 1, limit = 10) {
    const transactions = await transactionRepository.findAll(userId, page, limit);
    const total = await transactionRepository.countByUserId(userId);

    // Format transactions untuk response
    const formattedTransactions = await Promise.all(transactions.map(async (transaction) => {
      let description = 'Top Up balance';

      if (transaction.transaction_type === 'PAYMENT' && transaction.service_id) {
        const service = await serviceRepository.findById(transaction.service_id);
        if (service) {
          description = service.service_name;
        }
      }

      return {
        invoice_number: transaction.invoice_number,
        transaction_type: transaction.transaction_type,
        description: description,
        total_amount: transaction.total_amount,
        created_at: transaction.created_at
      };
    }));

    return {
      items: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Create new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction object
   */
  async createTransaction(transactionData) {
    const transaction = await transactionRepository.create(transactionData);
    return transaction;
  }

  /**
   * Topup balance by user ID dengan MySQL transaction locking
   * @param {Number} userId - User ID
   * @param {Number} amount - Amount
   * @returns {Promise<Object>} Transaction object
   */
  async topupByUserId(userId, amount) {
    // Validasi amount 
    if (amount <= 0 || isNaN(amount)) {
      throw new Error('Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
    }

    // Get connection dari pool untuk transaction
    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Cek apakah user ada
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Lock row balance dan get balance dengan FOR UPDATE
      let balance = await balanceUserRepository.findByUserIdWithLock(connection, userId);
      if (!balance) {
        // Auto-create balance jika tidak ditemukan menggunakan connection yang sama
        await balanceUserRepository.createWithConnection(connection, { user_id: userId, balance: 0 });
        // Lock lagi setelah create
        balance = await balanceUserRepository.findByUserIdWithLock(connection, userId);
        if (!balance) {
          throw new Error('Gagal membuat balance');
        }
      }

      // Hitung balance baru
      const newBalance = parseFloat(balance.balance) + parseFloat(amount);

      // Update balance dengan connection
      const success = await balanceUserRepository.updateWithConnection(connection, userId, {
        balance: newBalance
      });

      if (!success) {
        throw new Error('Gagal mengupdate balance');
      }

      // Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber(await transactionRepository.getLastInvoiceNumberWithConnection(connection));

      // Create transaction dengan connection
      const transaction = await transactionRepository.createWithConnection(connection, {
        user_id: userId,
        service_id: null,
        transaction_type: 'TOPUP',
        total_amount: amount,
        invoice_number: invoiceNumber
      });

      if (!transaction) {
        throw new Error('Gagal membuat transaksi');
      }

      // Commit transaction
      await connection.commit();

      return {
        balance: newBalance
      };
    } catch (error) {
      // Rollback jika ada error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection kembali ke pool
      connection.release();
    }
  }

  /**
   * Create payment transaction dengan MySQL transaction locking
   * @param {String} serviceCode - Service code
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} Transaction object
   */
  async transactionPayment(serviceCode, userId) {
    // Get connection dari pool untuk transaction
    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Cek apakah service ada
      const service = await serviceRepository.findByServiceCode(serviceCode);
      if (!service) {
        throw new Error('Service atau Layanan tidak ditemukan');
      }

      // Cek apakah user ada
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Lock row balance dan get balance dengan FOR UPDATE
      let balance = await balanceUserRepository.findByUserIdWithLock(connection, userId);
      if (!balance) {
        // Auto-create balance jika tidak ditemukan menggunakan connection yang sama
        await balanceUserRepository.createWithConnection(connection, { user_id: userId, balance: 0 });
        // Lock lagi setelah create
        balance = await balanceUserRepository.findByUserIdWithLock(connection, userId);
        if (!balance) {
          throw new Error('Gagal membuat balance');
        }
      }

      // Cek apakah balance user cukup
      if (parseFloat(balance.balance) < parseFloat(service.service_tariff)) {
        throw new Error('Balance tidak cukup');
      }

      // Hitung balance baru
      const newBalance = parseFloat(balance.balance) - parseFloat(service.service_tariff);

      // Update balance dengan connection
      const success = await balanceUserRepository.updateWithConnection(connection, userId, {
        balance: newBalance
      });

      if (!success) {
        throw new Error('Gagal mengupdate balance');
      }

      // Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber(await transactionRepository.getLastInvoiceNumberWithConnection(connection));

      // Create transaction dengan connection
      const transaction = await transactionRepository.createWithConnection(connection, {
        user_id: userId,
        service_id: service.id,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        invoice_number: invoiceNumber
      });

      if (!transaction) {
        throw new Error('Gagal membuat transaksi');
      }

      // Commit transaction
      await connection.commit();

      return {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: 'PAYMENT',
        total_amount: service.service_tariff,
        created_at: transaction.created_at
      };
    } catch (error) {
      // Rollback jika ada error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection kembali ke pool
      connection.release();
    }
  }
}

module.exports = new TransactionService();
