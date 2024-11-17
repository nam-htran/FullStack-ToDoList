import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import nodemailer from "nodemailer"


const router = express.Router();

// JSON Server API URL
const JSON_SERVER_URL = process.env.BACKEND_DATABASE_URL_AUTH
// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// API: Sign-up
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Kiểm tra email đã tồn tại
        const { data: users } = await axios.get(JSON_SERVER_URL, { params: { email } });
        if (users.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash mật khẩu và thêm vào JSON Server
        const hashedPassword = await bcrypt.hash(password, 10);
        await axios.post(JSON_SERVER_URL, { email, password: hashedPassword });

        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
});

// API: Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Kiểm tra người dùng trong JSON Server
        const { data: users } = await axios.get(JSON_SERVER_URL, { params: { email } });
        const user = users[0];
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Tạo token JWT
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
});

// Cấu hình Nodemailer để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Bạn có thể thay đổi dịch vụ email nếu cần
    auth: {
        user: process.env.EMAIL_USER,  // Địa chỉ email của bạn (ví dụ: user@gmail.com)
        pass: process.env.EMAIL_PASS   // Mật khẩu email của bạn
    }
});

// API: Forgot Password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
        const { data: users } = await axios.get(JSON_SERVER_URL, { params: { email } });
        const user = users[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Tạo một token đặt lại mật khẩu
        const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // Tạo liên kết đặt lại mật khẩu
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Tạo nội dung email
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Địa chỉ email gửi
            to: user.email,               // Địa chỉ email nhận
            subject: "Password Reset Request",
            text: `Click on the link to reset your password: ${resetLink}`,
        };

        // Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error details:', error);  // Log chi tiết lỗi
                return res.status(500).json({ error: 'Failed to send email', details: error });
            }
            res.status(200).json({ message: 'Password reset link sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to process forgot password request" });
    }
});


export default router;
