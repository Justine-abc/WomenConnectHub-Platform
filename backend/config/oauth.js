const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth Profile:', profile);
      
      // Check if user already exists
      let user = await User.findOne({
        where: { google_id: profile.id }
      });

      if (user) {
        // User exists, return user
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Update user with Google ID
        user.google_id = profile.id;
        user.profile_picture = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        google_id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        profile_picture: profile.photos[0]?.value,
        email_verified: true,
        user_type: 'entrepreneur', // Default to entrepreneur
        auth_provider: 'google',
        is_active: true
      });

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      return done(error, null);
    }
  }));
}

// OAuth configuration object
const oauthConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    scope: ['profile', 'email']
  },
  
  // Contact information for users
  contact: {
    email: process.env.CONTACT_EMAIL || 'ishimwelevi760@gmail.com',
    linkedin: process.env.CONTACT_LINKEDIN || 'https://linkedin.com/in/your-profile',
    adminEmail: process.env.ADMIN_EMAIL || 'ishimwelevis19@gmail.com'
  },

  // OAuth options
  options: {
    failureRedirect: process.env.CLIENT_URL + '/login?error=oauth_failed',
    successRedirect: process.env.CLIENT_URL + '/dashboard'
  }
};

// Middleware to initialize passport
const initializePassport = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

// Generate OAuth URLs
const getOAuthURLs = () => {
  return {
    google: `/api/auth/google`,
    contact: {
      email: `mailto:${oauthConfig.contact.email}`,
      linkedin: oauthConfig.contact.linkedin
    }
  };
};

module.exports = {
  passport,
  oauthConfig,
  initializePassport,
  getOAuthURLs
};