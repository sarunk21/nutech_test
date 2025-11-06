const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Module Transaction
 *   description: API untuk transaksi (balance, topup, payment, history)
 */

// Router untuk balance user
const balanceUserRouter = express.Router();

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Get Balance
 *     tags: [Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sukses mendapatkan balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceResponse'
 *             examples:
 *               success:
 *                 summary: Berhasil mendapatkan balance
 *                 value:
 *                   status: 0
 *                   message: Get Balance Berhasil
 *                   data:
 *                     balance: 1000000
 *       401:
 *         description: Unauthorized - Token tidak valid atau kadaluwarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *             examples:
 *               tokenInvalid:
 *                 summary: Token tidak valid
 *                 value:
 *                   status: 108
 *                   message: Token tidak tidak valid atau kadaluwarsa
 *                   data: null
 */
balanceUserRouter.get('/balance', authMiddleware, transactionController.getBalanceByUserId);

/**
 * @swagger
 * /topup:
 *   post:
 *     summary: Top Up Balance
 *     tags: [Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopUpRequest'
 *           examples:
 *             success:
 *               summary: Request yang valid
 *               value:
 *                 top_up_amount: 1000000
 *             invalidAmount:
 *               summary: Amount tidak valid (negatif)
 *               value:
 *                 top_up_amount: -1000
 *             invalidType:
 *               summary: Amount bukan angka
 *               value:
 *                 top_up_amount: "seribu"
 *     responses:
 *       200:
 *         description: Top Up berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopUpResponse'
 *             examples:
 *               success:
 *                 summary: Top Up berhasil
 *                 value:
 *                   status: 0
 *                   message: Top Up Balance berhasil
 *                   data:
 *                     balance: 2000000
 *       400:
 *         description: Bad Request - Parameter tidak sesuai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *             examples:
 *               invalidAmount:
 *                 summary: Amount tidak valid
 *                 value:
 *                   status: 102
 *                   message: Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0
 *                   data: null
 *       401:
 *         description: Unauthorized - Token tidak valid atau kadaluwarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *             examples:
 *               tokenInvalid:
 *                 summary: Token tidak valid
 *                 value:
 *                   status: 108
 *                   message: Token tidak tidak valid atau kadaluwarsa
 *                   data: null
 */
balanceUserRouter.post('/topup', authMiddleware, transactionController.topupByUserId);

// Router untuk transaction
const transactionRouter = express.Router();

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Transaction Payment
 *     tags: [Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *           examples:
 *             success:
 *               summary: Request yang valid
 *               value:
 *                 service_code: PULSA
 *             invalidService:
 *               summary: Service tidak ditemukan
 *               value:
 *                 service_code: INVALID_CODE
 *     responses:
 *       200:
 *         description: Transaksi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *             examples:
 *               success:
 *                 summary: Transaksi berhasil
 *                 value:
 *                   status: 0
 *                   message: Transaksi berhasil
 *                   data:
 *                     invoice_number: INV17082023-001
 *                     service_code: PULSA
 *                     service_name: Pulsa
 *                     transaction_type: PAYMENT
 *                     total_amount: 40000
 *                     created_on: 2023-08-17T10:10:10.000Z
 *       400:
 *         description: Bad Request - Service tidak ditemukan atau saldo tidak cukup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serviceNotFound:
 *                 summary: Service tidak ditemukan
 *                 value:
 *                   status: 102
 *                   message: Service atau Layanan tidak ditemukan
 *                   data: null
 *               insufficientBalance:
 *                 summary: Saldo tidak cukup
 *                 value:
 *                   status: 102
 *                   message: Saldo tidak cukup
 *                   data: null
 *       401:
 *         description: Unauthorized - Token tidak valid atau kadaluwarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *             examples:
 *               tokenInvalid:
 *                 summary: Token tidak valid
 *                 value:
 *                   status: 108
 *                   message: Token tidak tidak valid atau kadaluwarsa
 *                   data: null
 */
transactionRouter.post('/', authMiddleware, transactionController.transactionPayment);

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary: Get Transaction History
 *     tags: [Module Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: Offset transaksi (default 0)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *           example: 0
 *       - name: limit
 *         in: query
 *         description: Jumlah transaksi yang diambil (default 10)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 3
 *     responses:
 *       200:
 *         description: Sukses mendapatkan history transaksi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionHistoryResponse'
 *             examples:
 *               success:
 *                 summary: Berhasil mendapatkan history
 *                 value:
 *                   status: 0
 *                   message: Get History Berhasil
 *                   data:
 *                     offset: 0
 *                     limit: 3
 *                     records:
 *                       - invoice_number: INV17082023-001
 *                         transaction_type: TOPUP
 *                         description: Top Up balance
 *                         total_amount: 100000
 *                         created_on: 2023-08-17T10:10:10.000Z
 *                       - invoice_number: INV17082023-002
 *                         transaction_type: PAYMENT
 *                         description: Pulsa
 *                         total_amount: 40000
 *                         created_on: 2023-08-17T11:10:10.000Z
 *                       - invoice_number: INV17082023-003
 *                         transaction_type: PAYMENT
 *                         description: Listrik
 *                         total_amount: 10000
 *                         created_on: 2023-08-17T12:10:10.000Z
 *       401:
 *         description: Unauthorized - Token tidak valid atau kadaluwarsa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *             examples:
 *               tokenInvalid:
 *                 summary: Token tidak valid
 *                 value:
 *                   status: 108
 *                   message: Token tidak tidak valid atau kadaluwarsa
 *                   data: null
 */
transactionRouter.get('/history', authMiddleware, transactionController.getTransactionsByUserId);

module.exports = {
  balanceUserRouter,
  transactionRouter
};
