const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const JWTHelper = require('../utils/jwtHelper');
const { getProfileImageUrl } = require('../utils/fileHelper');
const fs = require('fs');
const path = require('path');

/**
 * Auth Service
 * Handle business logic untuk authentication
 */
class AuthService {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user with tokens
   */
  async register(userData) {
    const { first_name, last_name, email, password } = userData;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email sudah digunakan');
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    await userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    return;
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} User with tokens
   */
  async login(email, password) {
    // Find user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email atau password tidak valid');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Email atau password tidak valid');
    }

    // Generate tokens
    const accessToken = JWTHelper.generateAccessToken({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    });

    return {
      accessToken
    };
  }

  /**
   * Get current user profile
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Convert profile_image filename to full URL
    if (user.profile_image) {
      user.profile_image = getProfileImageUrl(user.profile_image);
    }

    return user;
  }

  /**
   * Update user profile
   * @param {Number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateProfile(userId, updateData) {
    const { first_name, last_name } = updateData;

    // Cek apakah user ada
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const dataToUpdate = {};

    if (first_name) {
      dataToUpdate.first_name = first_name;
    }

    if (last_name) {
      dataToUpdate.last_name = last_name;
    }

    // Update user profil
    const updated = await userRepository.update(userId, dataToUpdate);

    if (!updated) {
      throw new Error('Gagal mengupdate profil');
    }

    // Return user yang sudah diupdate
    const updatedUser = await userRepository.findById(userId);
    
    // Convert profile_image filename to full URL
    if (updatedUser.profile_image) {
      updatedUser.profile_image = getProfileImageUrl(updatedUser.profile_image);
    }

    return updatedUser;
  }

  /**
   * Update current user profile image
   * @param {Number} userId - User ID
   * @param {File} image - Image file
   * @returns {Promise<Object>} Updated user
   */
  async updateProfileImage(userId, image) {
    console.log(`Updating profile image for user ${userId}`);
    console.log(`Image filename: ${image.filename}`);
    console.log(`Image path: ${image.path}`);
    
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Hapus gambar profil lama jika ada
    if (user.profile_image) {
      // __dirname is src/services, so we need to go up 2 levels to reach project root
      const oldImagePath = path.join(__dirname, '../../public/uploads/profiles', user.profile_image);
      console.log(`Deleting old image: ${oldImagePath}`);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted');
      } else {
        console.log('Old image file not found, skipping deletion');
      }
    }

    // Update gambar profil
    console.log(`Updating database with new image filename: ${image.filename}`);
    await userRepository.update(userId, { profile_image: image.filename });
    
    // Verify file exists after upload
    // __dirname is src/services, so we need to go up 2 levels to reach project root
    const newImagePath = path.join(__dirname, '../../public/uploads/profiles', image.filename);
    if (!fs.existsSync(newImagePath)) {
      console.error(`WARNING: Uploaded file not found at ${newImagePath}`);
    } else {
      console.log(`File verified at: ${newImagePath}`);
    }

    // Return user yang sudah diupdate
    const updatedUser = await userRepository.findById(userId);
    
    // Convert profile_image filename to full URL
    if (updatedUser.profile_image) {
      updatedUser.profile_image = getProfileImageUrl(updatedUser.profile_image);
      console.log(`Profile image URL: ${updatedUser.profile_image}`);
    }

    return updatedUser;
  }
}

module.exports = new AuthService();
