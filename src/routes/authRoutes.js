const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authValidation } = require('../middlewares/validation');
const { uploadProfileImage, handleUploadError } = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Module Membership
 *   description: API untuk manajemen user (registrasi, login, profile)
 */

/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Registrasi User
 *     tags: [Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             success:
 *               summary: Request yang valid
 *               value:
 *                 email: user@nutech-integrasi.com
 *                 first_name: User
 *                 last_name: Nutech
 *                 password: abcdef1234
 *             invalidEmail:
 *               summary: Email tidak valid
 *               value:
 *                 email: user@nutech
 *                 first_name: User
 *                 last_name: Nutech
 *                 password: abcdef1234
 *     responses:
 *       200:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil silahkan login
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *             examples:
 *               success:
 *                 summary: Registrasi berhasil
 *                 value:
 *                   status: 0
 *                   message: Registrasi berhasil silahkan login
 *                   data: null
 *       400:
 *         description: Bad Request - Parameter tidak sesuai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidEmail:
 *                 summary: Format email tidak sesuai
 *                 value:
 *                   status: 102
 *                   message: Paramter email tidak sesuai format
 *                   data: null
 *               emailExists:
 *                 summary: Email sudah terdaftar
 *                 value:
 *                   status: 102
 *                   message: Email sudah terdaftar
 *                   data: null
 */
router.post('/registration', authValidation.register, authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login User
 *     tags: [Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             success:
 *               summary: Request yang valid
 *               value:
 *                 email: user@nutech-integrasi.com
 *                 password: abcdef1234
 *             wrongPassword:
 *               summary: Password salah
 *               value:
 *                 email: user@nutech-integrasi.com
 *                 password: wrongpassword
 *     responses:
 *       200:
 *         description: Login sukses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               success:
 *                 summary: Login berhasil
 *                 value:
 *                   status: 0
 *                   message: Login Sukses
 *                   data:
 *                     token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbnV0ZWNoLWludGVncmFzaS5jb20iLCJpYXQiOjE2OTYwMDAwMDAsImV4cCI6MTY5NjA4NjQwMH0.xxxxxxx
 *       400:
 *         description: Bad Request - Parameter tidak sesuai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidEmail:
 *                 summary: Format email tidak sesuai
 *                 value:
 *                   status: 102
 *                   message: Paramter email tidak sesuai format
 *                   data: null
 *       401:
 *         description: Unauthorized - Kredensial salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *             examples:
 *               wrongCredentials:
 *                 summary: Username atau password salah
 *                 value:
 *                   status: 103
 *                   message: Username atau password salah
 *                   data: null
 */
router.post('/login', authValidation.login, authController.login);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get Profile User
 *     tags: [Module Membership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sukses mendapatkan data profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             examples:
 *               success:
 *                 summary: Berhasil mendapatkan profile
 *                 value:
 *                   status: 0
 *                   message: Sukses
 *                   data:
 *                     email: user@nutech-integrasi.com
 *                     first_name: User
 *                     last_name: Nutech
 *                     profile_image: https://yoururlapi.com/profile.jpeg
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
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update Profile User
 *     tags: [Module Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             success:
 *               summary: Request yang valid
 *               value:
 *                 first_name: User Edited
 *                 last_name: Nutech Edited
 *     responses:
 *       200:
 *         description: Update Profile berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             examples:
 *               success:
 *                 summary: Update berhasil
 *                 value:
 *                   status: 0
 *                   message: Update Profile berhasil
 *                   data:
 *                     email: user@nutech-integrasi.com
 *                     first_name: User Edited
 *                     last_name: Nutech Edited
 *                     profile_image: https://yoururlapi.com/profile.jpeg
 *       400:
 *         description: Bad Request - Parameter tidak sesuai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               parameterInvalid:
 *                 summary: Parameter tidak sesuai
 *                 value:
 *                   status: 102
 *                   message: Parameter tidak sesuai
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
router.put('/profile/update', authMiddleware, authValidation.updateProfile, authController.updateProfile);

/**
 * @swagger
 * /profile/image:
 *   put:
 *     summary: Update Profile Image
 *     tags: [Module Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (JPEG, JPG, PNG only, max 2MB)
 *     responses:
 *       200:
 *         description: Update Profile Image berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             examples:
 *               success:
 *                 summary: Upload berhasil
 *                 value:
 *                   status: 0
 *                   message: Update Profile Image berhasil
 *                   data:
 *                     email: user@nutech-integrasi.com
 *                     first_name: User
 *                     last_name: Nutech
 *                     profile_image: https://yoururlapi.com/profile.jpeg
 *       400:
 *         description: Bad Request - Format Image tidak sesuai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidFormat:
 *                 summary: Format tidak sesuai
 *                 value:
 *                   status: 102
 *                   message: Format Image tidak sesuai
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
router.put(
  '/profile/image',
  authMiddleware,
  uploadProfileImage,
  handleUploadError,
  authController.updateProfileImage
);

module.exports = router;
