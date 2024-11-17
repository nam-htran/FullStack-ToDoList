import jwt from 'jsonwebtoken'
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware để xác thực JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
}

export default authenticateToken