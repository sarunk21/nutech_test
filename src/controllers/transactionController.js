const transactionService = require('../services/transactionService');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Transaction Controller
 * Handle HTTP requests untuk transaction dan balance
 */
class TransactionController {
  /**
   * Get balance by user ID
   * GET /balance
   */
  async getBalanceByUserId(req, res) {
    try {
      const userId = req.user.id;
      const balance = await transactionService.getBalanceByUserId(userId);

      return ResponseHelper.success(res, { balance: balance.balance }, 'Get Balance Berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  /**
   * Topup balance by user ID
   * POST /topup
   */
  async topupByUserId(req, res) {
    try {
      const userId = req.user.id;
      const { top_up_amount } = req.body;

      // Validasi amount
      if (!top_up_amount || isNaN(top_up_amount) || top_up_amount <= 0) {
        return ResponseHelper.error(res, 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0', 400);
      }

      const result = await transactionService.topupByUserId(userId, top_up_amount);

      return ResponseHelper.success(res, result, 'Top Up Balance berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  /**
   * Create payment transaction
   * POST /transaction
   */
  async transactionPayment(req, res) {
    try {
      const userId = req.user.id;
      const { service_code } = req.body;

      // Validasi service_code
      if (!service_code) {
        return ResponseHelper.error(res, 'Service code tidak boleh kosong', 400);
      }

      const result = await transactionService.transactionPayment(service_code, userId);

      return ResponseHelper.success(res, result, 'Transaksi berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  /**
   * Get transactions by user ID with pagination
   * GET /transaction/history?page=1&limit=10
   */
  async getTransactionsByUserId(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Validasi page dan limit
      if (isNaN(page) || page < 1) {
        return ResponseHelper.error(res, 'Parameter page harus berupa angka positif', 400);
      }

      if (isNaN(limit) || limit < 1) {
        return ResponseHelper.error(res, 'Parameter limit harus berupa angka positif', 400);
      }

      const result = await transactionService.getTransactionsByUserId(userId, page, limit);

      return ResponseHelper.success(res, result, 'Get History Berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = new TransactionController();
