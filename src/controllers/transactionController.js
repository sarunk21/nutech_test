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
   * Get transactions by user ID
   * GET /transaction/history
   */
  async getTransactionsByUserId(req, res) {
    try {
      const userId = req.user.id;
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      // Validasi offset dan limit
      if (isNaN(offset) || offset < 0) {
        return ResponseHelper.error(res, 'Parameter offset hanya boleh angka dan tidak boleh lebih kecil dari 0', 400);
      }

      if (isNaN(limit) || limit < 0) {
        return ResponseHelper.error(res, 'Parameter limit hanya boleh angka dan tidak boleh lebih kecil dari 0', 400);
      }

      const transactions = await transactionService.getTransactionsByUserId(userId, offset, limit);

      return ResponseHelper.success(res, {
        offset,
        limit,
        records: transactions
      }, 'Get History Berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = new TransactionController();
