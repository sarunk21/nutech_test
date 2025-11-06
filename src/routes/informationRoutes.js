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
 *     summary: Get Banner
 *     tags: [Module Information]
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
 *                     - banner_name: Banner 1
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 *                     - banner_name: Banner 2
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 *                     - banner_name: Banner 3
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 *                     - banner_name: Banner 4
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 *                     - banner_name: Banner 5
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 *                     - banner_name: Banner 6
 *                       banner_image: https://nutech-integrasi.app/dummy.jpg
 *                       description: Lerem Ipsum Dolor sit amet
 */
bannerRouter.get('/', informationController.getAllBanners);

// Router untuk services
const serviceRouter = express.Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get Services
 *     tags: [Module Information]
 *     security:
 *       - bearerAuth: []
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
 *                     - service_code: PAJAK
 *                       service_name: Pajak PBB
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 40000
 *                     - service_code: PLN
 *                       service_name: Listrik
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 10000
 *                     - service_code: PDAM
 *                       service_name: PDAM Berlangganan
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 40000
 *                     - service_code: PULSA
 *                       service_name: Pulsa
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 40000
 *                     - service_code: PGN
 *                       service_name: PGN Berlangganan
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 50000
 *                     - service_code: MUSIK
 *                       service_name: Musik Berlangganan
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 50000
 *                     - service_code: TV
 *                       service_name: TV Berlangganan
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 50000
 *                     - service_code: PAKET_DATA
 *                       service_name: Paket data
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 50000
 *                     - service_code: VOUCHER_GAME
 *                       service_name: Voucher Game
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 100000
 *                     - service_code: VOUCHER_MAKANAN
 *                       service_name: Voucher Makanan
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 100000
 *                     - service_code: QURBAN
 *                       service_name: Qurban
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 200000
 *                     - service_code: ZAKAT
 *                       service_name: Zakat
 *                       service_icon: https://nutech-integrasi.app/dummy.jpg
 *                       service_tariff: 300000
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
