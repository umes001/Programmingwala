import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import { protect } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';

const router = express.Router();

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pranidha_secret_key_987654321', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, password, role } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();

  try {
    const userRole = role || 'user';

    if (userRole === 'parent' || userRole === 'teacher') {
      return res.status(400).json({
        success: false,
        message: `Self-registration for ${userRole}s is disabled. Accounts are provisioned by the school administration team.`
      });
    }

    if (mockStore.isMock) {
      // Check mock store
      const userExists = await mockStore.findOne('users', { email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = await mockStore.create('users', {
        name,
        email,
        password: hashedPassword,
        role: userRole
      });

      // If parent or teacher, create mock profile
      if (userRole === 'parent') {
        const parentProfile = await mockStore.create('parents', {
          userId: newUser._id,
          name,
          email,
          phone: req.body.phone || 'Please update phone',
          address: req.body.address || 'Please update address',
          children: []
        });
        newUser.parentProfileId = parentProfile._id;
      } else if (userRole === 'teacher') {
        const teacherProfile = await mockStore.create('teachers', {
          userId: newUser._id,
          name,
          email,
          phone: req.body.phone || 'Please update phone',
          qualifications: req.body.qualifications || 'Please update qualifications',
          classesAssigned: []
        });
        newUser.teacherProfileId = teacherProfile._id;
      }

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    }

    // Mongoose MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    if (user) {
      // Create associated collections
      if (userRole === 'parent') {
        const parent = await Parent.create({
          userId: user._id,
          name,
          email,
          phone: req.body.phone || 'Please update',
          address: req.body.address || 'Please update',
          children: []
        });
      } else if (userRole === 'teacher') {
        const teacher = await Teacher.create({
          userId: user._id,
          name,
          email,
          phone: req.body.phone || 'Please update',
          qualifications: req.body.qualifications || 'Please update',
          classesAssigned: []
        });
      }

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { password } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();

  try {
    if (mockStore.isMock) {
      const user = await mockStore.findOne('users', { email });
      if (user) {
        let isMatch = false;
        if (typeof user.password === 'string' && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
          isMatch = bcrypt.compareSync(password, user.password);
        } else {
          isMatch = password === user.password;
        }

        if (isMatch) {
          return res.json({
            success: true,
            token: generateToken(user._id),
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              profileImage: user.profileImage
            }
          });
        }
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // MongoDB
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Google OAuth / 1-Click Google Sign-In
// @route   POST /api/auth/google-login
// @access  Public
router.post('/google-login', async (req, res) => {
  const { googleId, avatar } = req.body;
  const email = String(req.body.email || '').trim().toLowerCase();
  const name = req.body.name || (email ? email.split('@')[0] : 'Google User');
  const role = req.body.role || 'user';

  if (!email) {
    return res.status(400).json({ success: false, message: 'Google email is required' });
  }

  try {
    if (mockStore.isMock) {
      let user = await mockStore.findOne('users', { email });
      if (!user) {
        user = await mockStore.create('users', {
          name,
          email,
          role,
          profileImage: avatar || '/clay_mascot.png',
          googleId: googleId || `g_${Date.now()}`,
          isGoogleAuth: true
        });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || avatar
        }
      });
    }

    // MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: `google_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        role,
        profileImage: avatar,
        googleId: googleId || `g_${Date.now()}`
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    if (mockStore.isMock) {
      const user = req.user;
      let profile = {};

      if (user.role === 'parent') {
        profile = await mockStore.findOne('parents', { userId: user._id });
        // Retrieve children
        if (profile) {
          const children = await mockStore.find('students', { parentId: profile._id });
          profile = { ...profile, children };
        }
      } else if (user.role === 'teacher') {
        profile = await mockStore.findOne('teachers', { userId: user._id });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        },
        profile
      });
    }

    // MongoDB
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'parent') {
      profile = await Parent.findOne({ userId: user._id }).populate('children');
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
