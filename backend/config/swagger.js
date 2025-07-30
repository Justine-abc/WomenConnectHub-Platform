const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WomenConnect Hub API',
      version: '1.0.0',
      description: 'API Documentation for WomenConnect Hub - Empowering Women Entrepreneurs Platform',
      contact: {
        name: 'Justine Umuhoza',
        email: 'justineumuhoza74@gmail.com',
        url: 'https://linkedin.com/in/your-profile'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.womenconnecthub.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'name', 'user_type'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            user_type: {
              type: 'string',
              enum: ['entrepreneur', 'investor', 'admin'],
              description: 'Type of user account'
            },
            profile_picture: {
              type: 'string',
              description: 'URL to user profile picture'
            },
            is_active: {
              type: 'boolean',
              description: 'Whether the user account is active'
            },
            email_verified: {
              type: 'boolean',
              description: 'Whether the user email is verified'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        Project: {
          type: 'object',
          required: ['title', 'description', 'category', 'funding_goal'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the project'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Detailed project description'
            },
            category: {
              type: 'string',
              description: 'Project category'
            },
            funding_goal: {
              type: 'number',
              description: 'Target funding amount'
            },
            raised_amount: {
              type: 'number',
              description: 'Amount raised so far'
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'funded', 'cancelled', 'completed'],
              description: 'Project status'
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              description: 'Project funding deadline'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            message: {
              type: 'string',
              description: 'Detailed error description'
            },
            code: {
              type: 'string',
              description: 'Error code'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Entrepreneurs',
        description: 'Entrepreneur-specific endpoints'
      },
      {
        name: 'Investors',
        description: 'Investor-specific endpoints'
      },
      {
        name: 'Messages',
        description: 'Messaging system endpoints'
      },
      {
        name: 'Admin',
        description: 'Administrative endpoints'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;