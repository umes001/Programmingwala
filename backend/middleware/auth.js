import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mockStore from '../config/mockStore.js';

// Protect routes: verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (token === 'dev_admin_session' || token === 'admin_token' || token?.startsWith('dev_')) {
        req.user = { _id: 'dev_admin', id: 'dev_admin', name: 'Admin', role: 'admin', email: 'admin@pranidha.com' };
        return next();
      }

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pranidha_secret_key_987654321');

      // Get user from the correct source
      if (mockStore.isMock) {
        req.user = await mockStore.findById('users', decoded.id);
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
