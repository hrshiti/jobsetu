import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getIsConnected } from '../config/db.js';

// Default Admin credentials in env or fallback
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jobsetu.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check default admin
    const isDefaultAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

    if (isDefaultAdmin) {
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: 'admin', id: 'admin-default-id' },
        process.env.JWT_SECRET || 'jobsetu_jwt_secret',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          name: 'Super Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        }
      });
    }

    // DB check if MongoDB connected
    if (getIsConnected()) {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { email: user.email, role: user.role, id: user._id },
          process.env.JWT_SECRET || 'jobsetu_jwt_secret',
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          message: 'Admin login successful',
          token,
          admin: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
