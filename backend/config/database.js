const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const config = {
  development: {
    username: process.env.DB_USER || 'levy',
    password: process.env.DB_PASSWORD || 'Levis250@',
    database: process.env.DB_NAME || 'alu_platform',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  },
  test: {
    username: process.env.DB_USER || 'levy',
    password: process.env.DB_PASSWORD || 'Levis250@',
    database: process.env.DB_NAME + '_test' || 'alu_platform_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config[process.env.NODE_ENV || 'development'].database,
  config[process.env.NODE_ENV || 'development'].username,
  config[process.env.NODE_ENV || 'development'].password,
  config[process.env.NODE_ENV || 'development']
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  config,
  testConnection
};