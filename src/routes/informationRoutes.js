const express = require('express');
const informationController = require('../controllers/informationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Module Information
 *   description: API untuk mendapatkan informasi banner dan services
 */

// Router untuk banner
const bannerRouter = express.Router();

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get Banner with Pagination
 *     tags: [Module Information]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Halaman yang ingin ditampilkan (default 1)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Jumlah data per halaman (default 10)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data banner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BannerListResponse'
 *             examples:
 *               success:
 *                 summary: Berhasil mendapatkan banner
 *                 value:
 *                   status: 0
 *                   message: Sukses
 *                   data:
 *                     data:
 *                       - banner_name: Banner 1
 *                         banner_image: https://nutech-integrasi.app/dummy.jpg
 *                         description: Lerem Ipsum Dolor sit amet
 *                       - banner_name: Banner 2
 *                         banner_image: https://nutech-integrasi.app/dummy.jpg
 *                         description: Lerem Ipsum Dolor sit amet
 *                       - banner_name: Banner 3
 *                         banner_image: https://nutech-integrasi.app/dummy.jpg
 *                         description: Lerem Ipsum Dolor sit amet
 *                     pagination:
 *                       page: 1
 *                       limit: 10
 *                       total: 6
 *                       total_pages: 1
 */
bannerRouter.get('/', informationController.getAllBanners);

// Router untuk services
const serviceRouter = express.Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get Services with Pagination
 *     tags: [Module Information]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Halaman yang ingin ditampilkan (default 1)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Jumlah data per halaman (default 10)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data services
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceListResponse'
 *             examples:
 *               success:
 *                 summary: Berhasil mendapatkan services
 *                 value:
 *                   status: 0
 *                   message: Sukses
 *                   data:
 *                     data:
 *                       - service_code: PAJAK
 *                         service_name: Pajak PBB
 *                         service_icon: https://nutech-integrasi.app/dummy.jpg
 *                         service_tariff: 40000
 *                       - service_code: PLN
 *                         service_name: Listrik
 *                         service_icon: https://nutech-integrasi.app/dummy.jpg
 *                         service_tariff: 10000
 *                       - service_code: PDAM
 *                         service_name: PDAM Berlangganan
 *                         service_icon: https://nutech-integrasi.app/dummy.jpg
 *                         service_tariff: 40000
 *                     pagination:
 *                       page: 1
 *                       limit: 10
 *                       total: 12
 *                       total_pages: 2
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
serviceRouter.get('/', authMiddleware, informationController.getAllServices);

module.exports = {
  bannerRouter,
  serviceRouter
};
