import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Passport setup for Google OAuth2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Tạo token sau khi xác thực thành công
      const token = jwt.sign(
        { id: profile.id, email: profile.emails[0].value },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return done(null, token);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Định tuyến Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Đây là route để xử lý Google OAuth callback
router.get(
  '/google/callback', // Đảm bảo route này có đúng đường dẫn
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Sau khi đăng nhập thành công, trả về token
    res.json({ token: req.user });
  }
);


export default router;
