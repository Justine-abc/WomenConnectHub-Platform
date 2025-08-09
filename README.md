# WomenConnect Hub Platform

**Empowering Women Entrepreneurs Through Connection and Investment**

A comprehensive platform connecting female entrepreneurs with investors, facilitating project funding, business networking, and entrepreneurial growth across Africa and beyond.

![Platform Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### For Entrepreneurs
- **Project Showcase**: Upload and display business projects with detailed information
- **Funding Tracking**: Real-time funding progress and investor management
- **Profile Management**: Comprehensive business profiles with certificates and documentation
- **Direct Messaging**: Connect directly with potential investors
- **Analytics Dashboard**: Track project performance and engagement

### For Investors
- **Project Discovery**: Browse and filter projects by category, location, and funding stage
- **Investment Portfolio**: Track investments and returns
- **Due Diligence Tools**: Access business certificates and detailed project information
- **Communication Hub**: Direct messaging with entrepreneurs
- **Investment Analytics**: Monitor portfolio performance

### For Administrators
- **User Management**: Approve and manage user registrations
- **Project Moderation**: Review and approve project submissions
- **Platform Analytics**: Comprehensive dashboard with platform metrics
- **Content Management**: Manage platform content and announcements

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **React Hot Toast** - Notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Cloudinary** - Image and file management
- **Nodemailer** - Email services

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **Swagger** - API documentation

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (latest version)

### Verify Prerequisites
```bash
node --version    # Should be v16.0.0 or higher
npm --version     # Should be v8.0.0 or higher
mysql --version   # Should be v8.0 or higher
git --version     # Any recent version
```

## ⚡ Quick Start

For those who want to get running immediately:

```bash
# 1. Clone and setup
git clone https://github.com/Justine-abc/WomenConnectHub-Platform.git
cd WomenConnectHub-Platform
npm install
cd backend && npm install && cd ..

# 2. Setup database (ensure MySQL is running)
mysql -u root -p -e "CREATE DATABASE womenconnect;"

# 3. Configure environment (update with your credentials)
cp backend/.env.example backend/.env  # Edit with your database credentials
cp .env.example .env                  # Usually works as-is

# 4. Start the application
cd backend && node server.js &       # Starts backend on port 9007
cd .. && npm start                    # Starts frontend on port 3000
```

## 🛠️ Detailed Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Justine-abc/WomenConnectHub-Platform.git
cd WomenConnectHub-Platform
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### Step 4: Database Setup

#### 4.1 Start MySQL Service
```bash
# On Ubuntu/Debian
sudo systemctl start mysql

# On macOS (if using Homebrew)
brew services start mysql

# On Windows
# Start MySQL through Services or MySQL Workbench
```

#### 4.2 Create Database
```bash
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE womenconnect;
CREATE USER 'justine'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON womenconnect.* TO 'justine'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Environment Configuration

#### 5.1 Backend Environment Setup
Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following configuration to `backend/.env`:
```env
# Server Configuration
PORT=9007

# Database Configuration
DB_NAME=womenconnect
DB_USER=justine
DB_PASSWORD=your_secure_password
DB_HOST=localhost

# JWT Configuration
JWT_SECRET=12345@#@@@@@@@@!!!!wwwgggh.

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional - for notifications)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
GMAIL_REFRESH_TOKEN=your_refresh_token
```

#### 5.2 Frontend Environment Setup
Create a `.env` file in the root directory:

```bash
cd ..
touch .env
```

Add the following configuration to `.env`:
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:9007/api
REACT_APP_CLIENT_URL=http://localhost:3000

# Social Login Configuration (Optional)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# App Configuration
REACT_APP_VERSION=1.0.0
```

### Step 6: Database Migration
```bash
cd backend
npx sequelize-cli db:migrate
```

If you don't have sequelize-cli installed globally:
```bash
npm install -g sequelize-cli
npx sequelize-cli db:migrate
```

**Note**: If migrations fail, you can also initialize the database by simply starting the backend server, as Sequelize will auto-sync the database schema.

## 🚦 Running the Application

### Method 1: Development Mode (Recommended)

#### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
# or
node server.js
```

You should see:
```
✅ Database connected
🔄 Database synchronized
✅ Server listening on port 9007
```

#### Terminal 2: Start Frontend Server
```bash
# In the root directory
npm start
```

The application will open at `http://localhost:3000`

### Method 2: Production Build

#### Build Frontend
```bash
npm run build
```

#### Serve Production Build
```bash
npm install -g serve
serve -s build -l 3000
```

## 🧪 Testing the Setup

### 1. Verify Backend API
```bash
curl http://localhost:9007/api/health
```
Expected response: `WomenConnectHub API is running.`

### 2. Test Database Connection
The backend console should show database connection messages when starting.

### 3. Frontend Access
Navigate to `http://localhost:3000` and verify the application loads.

### 4. Test Registration
1. Go to the signup page
2. Select "Entrepreneur" or "Investor"
3. Fill out the registration form
4. Submit and verify success

## 📚 API Documentation

Once the backend is running, access the Swagger API documentation at:
```
http://localhost:9007/api/docs
```

## 🔐 Default Admin Account

To access admin features, register with these credentials:
- **User Type**: Admin
- **Secret Key**: `12345@#@@@@@@@@!!!!wwwgggh.`

⚠️ **Important**: Change the admin secret key in production! Update both the backend `.env` file and the frontend `AuthModal.js` component.

### First Time Setup:
1. Register as a regular user first to test the system
2. Then register as admin using the secret key
3. Use admin panel to manage users and projects

## 📁 Project Structure

```
WomenConnectHub-Platform/
├── public/                 # Static assets
├── src/                   # Frontend source code
│   ├── components/        # React components
│   │   ├── admin/        # Admin-specific components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── messaging/    # Messaging system
│   │   ├── pages/        # Page components
│   │   ├── profile/      # Profile management
│   │   └── projects/     # Project-related components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── styles/           # CSS styles
│   └── utils/            # Utility functions
├── backend/              # Backend source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── socket/           # Socket.io handlers
│   └── utils/            # Backend utilities
└── README.md            # This file
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "failed to fetch" Error
**Problem**: Frontend cannot connect to backend
**Solutions**:
- Ensure backend server is running on port 9007
- Check `.env` file in root directory has correct `REACT_APP_API_BASE_URL`
- Restart frontend server after changing `.env`
- Clear browser cache

#### 2. Database Connection Error
**Problem**: Backend cannot connect to MySQL
**Solutions**:
- Verify MySQL service is running
- Check database credentials in `backend/.env`
- Ensure database `womenconnect` exists
- Check user permissions

#### 3. "Email already in use" During Registration
**Problem**: Email already exists in database
**Solutions**:
- Use a different email address
- Check existing users in database:
  ```bash
  mysql -u justine -p
  USE womenconnect;
  SELECT email FROM Users;
  ```

#### 4. Port Already in Use
**Problem**: Port 3000 or 9007 is occupied
**Solutions**:
- Kill existing processes:
  ```bash
  lsof -ti:3000 | xargs kill -9
  lsof -ti:9007 | xargs kill -9
  ```
- Use different ports in environment configuration

#### 5. Permission Denied Errors
**Problem**: Insufficient file permissions
**Solutions**:
- Check file ownership: `ls -la`
- Fix permissions: `chmod 755 filename`
- Run with appropriate user privileges

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check the troubleshooting section above
5. Review the API documentation at `/api/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Justine Umuhoza** - Project Lead & Full Stack Developer
- **Development Team** - WomenConnect Hub Team

## 🌐 Links

- **Repository**: [GitHub](https://github.com/Justine-abc/WomenConnectHub-Platform)
- **Live Demo**: [Coming Soon]
- **Documentation**: [API Docs](http://localhost:9007/api/docs)

## 📞 Support

For support and questions:
- **Email**: wconnecthub@gmail.com
- **Phone**: +250791691615
- **Issues**: [GitHub Issues](https://github.com/Justine-abc/WomenConnectHub-Platform/issues)
- **Developer**: Justine Umuhoza

---

**Built with ❤️ for empowering women entrepreneurs across Africa and beyond.**
