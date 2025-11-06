/**
 * File Helper
 * Utility functions untuk handle file operations
 */

/**
 * Generate full URL untuk file upload
 * @param {String} filename - Filename dari file yang diupload
 * @param {String} subfolder - Subfolder dalam uploads (default: 'profiles')
 * @returns {String|null} Full URL atau null jika filename kosong
 */
function getFileUrl(filename, subfolder = 'profiles') {
  if (!filename) {
    return null;
  }

  // Gunakan APP_URL dari environment variable
  // Fallback ke localhost jika tidak ada
  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  
  // Pastikan APP_URL tidak berakhir dengan slash
  const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
  
  return `${baseUrl}/uploads/${subfolder}/${filename}`;
}

/**
 * Generate full URL untuk profile image
 * @param {String} filename - Filename dari profile image
 * @returns {String|null} Full URL atau null jika filename kosong
 */
function getProfileImageUrl(filename) {
  return getFileUrl(filename, 'profiles');
}

module.exports = {
  getFileUrl,
  getProfileImageUrl
};

