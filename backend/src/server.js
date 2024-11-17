// server.js
import express from "express";
import { initWebRoute } from "./routes/route.js";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import authenticateToken from "./middleware/authMiddleware.js";
import authRoutes from './routes/authRoute.js'
import passport from "passport";
import authGoogle from "./routes/authGoogle.js"
import session from 'express-session'

const app = express();
const router = express.Router();

app.use(cors({
  origin: 'http://localhost:3000',  // Đảm bảo rằng đây là URL của frontend
  credentials: true,               // Cho phép gửi cookie và authorization headers
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',  // Đặt secret key cho session
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },  // Nếu chạy trên HTTP, set secure: false, nếu trên HTTPS, set secure: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authGoogle);  // Đăng ký các route của Google login

// Example of a protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.send(`Hello ${req.user.email}, this is a protected route!`);
});

const port = process.env.BACKEND_PORT || 9000;

initWebRoute(router, app);

app.listen(port, () => {
  console.log("Server is running on PORT", port);
})
.on("error", (error) => {
  console.error("Error starting the server:", error);
});
