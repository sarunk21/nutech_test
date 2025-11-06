const authService = require('../services/authService');
const ResponseHelper = require('../utils/responseHelper');
const { validationResult } = require('express-validator');

/**
 * Auth Controller
 * Handle HTTP requests untuk authentication
 */
class AuthController {
  /**
   * Register new user
   * POST /register
   */
  async register(req, res) {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHelper.validationError(res, errors.array());
      }

      const { first_name, last_name, email, password } = req.body;

      const result = await authService.register({ first_name, last_name, email, password });

      return ResponseHelper.success(res, result, 'Registrasi berhasil silahkan login', 201);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  /**
   * Login user
   * POST /login
   */
  async login(req, res) {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHelper.validationError(res, errors.array());
      }

      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return ResponseHelper.success(res, { token: result.accessToken }, 'Login Sukses');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 401);
    }
  }

  /**
   * Get current user profile
   * GET /profile
   */
  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user.id);

      return ResponseHelper.success(res, user, 'Sukses');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 404);
    }
  }

  /**
   * Update current user profile
   * PUT /profile
   */
  async updateProfile(req, res) {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHelper.validationError(res, errors.array());
      }

      const updateData = req.body;
      const user = await authService.updateProfile(req.user.id, updateData);

      return ResponseHelper.success(res, user, 'Update Profil berhasil');
    } catch (error) {
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  /**
   * Update current user profile image
   * PUT /profile/image
   */
  async updateProfileImage(req, res) {
    try {
      console.log('Update profile image request received');
      console.log('Request file:', req.file);
      console.log('Request body:', req.body);
      console.log('Request headers content-type:', req.headers['content-type']);
      
      // Check if file was uploaded
      if (!req.file) {
        console.error('No file uploaded');
        return ResponseHelper.error(res, 'Tidak ada file yang diupload', 400);
      }

      console.log(`Processing file upload: ${req.file.filename}`);
      const user = await authService.updateProfileImage(req.user.id, req.file);
      console.log(`Profile image updated successfully for user ${req.user.id}`);

      return ResponseHelper.success(res, user, 'Gambar profil berhasil diupdate');
    }
    catch (error) {
      console.error('Error updating profile image:', error);
      return ResponseHelper.error(res, error.message, 400);
    }
  }

  /**
   * Logout user (client-side should remove token)
   * POST /logout
   */
  async logout(req, res) {
    try {
      return ResponseHelper.success(
        res,
        null,
        'Logout successful. Please remove token from client.'
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = new AuthController();
