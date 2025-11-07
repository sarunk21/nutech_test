const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NUTECH Test API Documentation',
      version: '1.0.0',
      description: 'API Documentation for NUTECH Test Project with JWT Authentication',
      contact: {
        name: 'API Support',
        email: 'support@nutech.com'
      }
    },
    servers: [
      {
        url: `${process.env.APP_URL}`,
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        // Pagination Schema
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Halaman saat ini',
              example: 1
            },
            limit: {
              type: 'integer',
              description: 'Jumlah data per halaman',
              example: 10
            },
            total: {
              type: 'integer',
              description: 'Total semua data',
              example: 100
            },
            total_pages: {
              type: 'integer',
              description: 'Total halaman',
              example: 10
            }
          }
        },
        
        // Success Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Sukses'
            },
            data: {
              type: 'object',
              nullable: true
            }
          }
        },
        
        // User Related Schemas
        UserProfile: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@nutech-integrasi.com'
            },
            first_name: {
              type: 'string',
              example: 'User'
            },
            last_name: {
              type: 'string',
              example: 'Nutech'
            },
            profile_image: {
              type: 'string',
              format: 'uri',
              example: 'https://yoururlapi.com/profile.jpeg'
            }
          }
        },
        
        RegisterRequest: {
          type: 'object',
          required: ['email', 'first_name', 'last_name', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@nutech-integrasi.com'
            },
            first_name: {
              type: 'string',
              example: 'User'
            },
            last_name: {
              type: 'string',
              example: 'Nutech'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'abcdef1234'
            }
          }
        },
        
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@nutech-integrasi.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'abcdef1234'
            }
          }
        },
        
        LoginResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Login Sukses'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbnV0ZWNoLWludGVncmFzaS5jb20iLCJpYXQiOjE2OTYwMDAwMDAsImV4cCI6MTY5NjA4NjQwMH0.xxxxxxx'
                }
              }
            }
          }
        },
        
        ProfileResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Sukses'
            },
            data: {
              $ref: '#/components/schemas/UserProfile'
            }
          }
        },
        
        UpdateProfileRequest: {
          type: 'object',
          required: ['first_name', 'last_name'],
          properties: {
            first_name: {
              type: 'string',
              example: 'User Edited'
            },
            last_name: {
              type: 'string',
              example: 'Nutech Edited'
            }
          }
        },
        
        // Banner Schema
        Banner: {
          type: 'object',
          properties: {
            banner_name: {
              type: 'string',
              example: 'Banner 1'
            },
            banner_image: {
              type: 'string',
              format: 'uri',
              example: 'https://nutech-integrasi.app/dummy.jpg'
            },
            description: {
              type: 'string',
              example: 'Lerem Ipsum Dolor sit amet'
            }
          }
        },
        
        BannerListResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Sukses'
            },
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  description: 'Array of banner objects',
                  items: {
                    $ref: '#/components/schemas/Banner'
                  }
                },
                pagination: {
                  $ref: '#/components/schemas/Pagination'
                }
              }
            }
          }
        },
        
        // Service Schema
        Service: {
          type: 'object',
          properties: {
            service_code: {
              type: 'string',
              example: 'PAJAK'
            },
            service_name: {
              type: 'string',
              example: 'Pajak PBB'
            },
            service_icon: {
              type: 'string',
              format: 'uri',
              example: 'https://nutech-integrasi.app/dummy.jpg'
            },
            service_tariff: {
              type: 'integer',
              example: 40000
            }
          }
        },
        
        ServiceListResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Sukses'
            },
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  description: 'Array of service objects',
                  items: {
                    $ref: '#/components/schemas/Service'
                  }
                },
                pagination: {
                  $ref: '#/components/schemas/Pagination'
                }
              }
            }
          }
        },
        
        // Balance Schema
        Balance: {
          type: 'object',
          properties: {
            balance: {
              type: 'integer',
              example: 1000000
            }
          }
        },
        
        BalanceResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Get Balance Berhasil'
            },
            data: {
              $ref: '#/components/schemas/Balance'
            }
          }
        },
        
        // Top Up Schema
        TopUpRequest: {
          type: 'object',
          required: ['top_up_amount'],
          properties: {
            top_up_amount: {
              type: 'integer',
              minimum: 0,
              example: 1000000
            }
          }
        },
        
        TopUpResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Top Up Balance berhasil'
            },
            data: {
              $ref: '#/components/schemas/Balance'
            }
          }
        },
        
        // Transaction Schema
        Transaction: {
          type: 'object',
          properties: {
            invoice_number: {
              type: 'string',
              example: 'INV17082023-001'
            },
            service_code: {
              type: 'string',
              example: 'PULSA'
            },
            service_name: {
              type: 'string',
              example: 'Pulsa'
            },
            transaction_type: {
              type: 'string',
              enum: ['TOPUP', 'PAYMENT'],
              example: 'PAYMENT'
            },
            total_amount: {
              type: 'integer',
              example: 10000
            },
            created_on: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-17T10:10:10.000Z'
            }
          }
        },
        
        TransactionRequest: {
          type: 'object',
          required: ['service_code'],
          properties: {
            service_code: {
              type: 'string',
              example: 'PULSA'
            }
          }
        },
        
        TransactionResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Transaksi berhasil'
            },
            data: {
              $ref: '#/components/schemas/Transaction'
            }
          }
        },
        
        TransactionHistory: {
          type: 'object',
          properties: {
            invoice_number: {
              type: 'string',
              example: 'INV17082023-001'
            },
            transaction_type: {
              type: 'string',
              enum: ['TOPUP', 'PAYMENT'],
              example: 'TOPUP'
            },
            description: {
              type: 'string',
              example: 'Top Up balance'
            },
            total_amount: {
              type: 'integer',
              example: 100000
            },
            created_on: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-17T10:10:10.000Z'
            }
          }
        },
        
        TransactionHistoryResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 0
            },
            message: {
              type: 'string',
              example: 'Get History Berhasil'
            },
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  description: 'Array of transaction history objects',
                  items: {
                    $ref: '#/components/schemas/TransactionHistory'
                  }
                },
                pagination: {
                  $ref: '#/components/schemas/Pagination'
                }
              }
            }
          }
        },
        
        // Error Response Schemas
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 102
            },
            message: {
              type: 'string',
              example: 'Parameter tidak sesuai'
            },
            data: {
              type: 'object',
              nullable: true,
              example: null
            }
          }
        },
        
        UnauthorizedError: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 108
            },
            message: {
              type: 'string',
              example: 'Token tidak valid atau kadaluwarsa'
            },
            data: {
              type: 'object',
              nullable: true,
              example: null
            }
          }
        },
        
        BadRequestError: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 102
            },
            message: {
              type: 'string',
              example: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0'
            },
            data: {
              type: 'object',
              nullable: true,
              example: null
            }
          }
        },
        
        ValidationError: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 102
            },
            message: {
              type: 'string',
              example: 'Paramter email tidak sesuai format'
            },
            data: {
              type: 'object',
              nullable: true,
              example: null
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
