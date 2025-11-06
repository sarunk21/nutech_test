require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const { bannerRouter, serviceRouter } = require('./src/routes/informationRoutes');
const { balanceUserRouter, transactionRouter } = require('./src/routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
const profilesDir = path.join(__dirname, 'public/uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created directory: ${uploadsDir}`);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
  console.log(`Created directory: ${profilesDir}`);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, 'public/uploads');

app.use('/uploads', express.static(staticPath, {
  dotfiles: 'deny',
  index: false
}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route - Simple landing page
app.get('/', (req, res) => {
  res.send(`
    <h1>Nutech Test API</h1>
    <p>Server is running on port ${PORT}</p>
    <ul>
      <li><a href="/api-docs">API Documentation (Swagger)</a></li>
      <li><a href="/health">Health Check</a></li>
    </ul>
    <p>Untuk testing API, gunakan:</p>
    <ul>
      <li>Swagger UI (link di atas)</li>
      <li>Postman</li>
      <li>cURL / HTTPie</li>
    </ul>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/', authRoutes);
app.use('/banner', bannerRouter);
app.use('/services', serviceRouter);
app.use('/', balanceUserRouter);
app.use('/transaction', transactionRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
