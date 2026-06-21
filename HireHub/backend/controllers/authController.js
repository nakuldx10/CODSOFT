const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../utils/emailService');

const jwt = require('jsonwebtoken');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
})

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password and role'
      })
    }

    if (!['candidate', 'employer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be candidate or employer'
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      })
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie('hirehub_refresh', refreshToken, getCookieOptions())

    return res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || ''
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie('hirehub_refresh', refreshToken, getCookieOptions())

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || ''
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    })
  }
}

// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Public (requires refresh cookie)
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.hirehub_refresh
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== token) {
      res.clearCookie('hirehub_refresh')
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie('hirehub_refresh', newRefreshToken, getCookieOptions())

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || ''
      }
    })
  } catch (error) {
    res.clearCookie('hirehub_refresh')
    return res.status(401).json({ success: false, message: 'Token expired or invalid' })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    const token = req.cookies.hirehub_refresh
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET).catch(() => null)
      if (decoded) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: '' })
      }
    }
  } catch (e) {}
  res.clearCookie('hirehub_refresh', { path: '/' })
  return res.status(200).json({ success: true, message: 'Logged out successfully' })
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name, phone, headline, bio, skills, education, experience, socialLinks,
      companyName, companyWebsite, companyDescription, industry
    } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    
    if (skills) {
      // Handle skills array if sent as JSON string or array
      try {
        user.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        user.skills = skills;
      }
    }
    
    if (education) {
      try {
        user.education = typeof education === 'string' ? JSON.parse(education) : education;
      } catch (e) {
        user.education = education;
      }
    }
    
    if (experience) {
      try {
        user.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
      } catch (e) {
        user.experience = experience;
      }
    }
    
    if (socialLinks) {
      try {
        user.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      } catch (e) {
        user.socialLinks = socialLinks;
      }
    }

    if (user.role === 'employer') {
      if (companyName !== undefined) user.companyName = companyName;
      if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
      if (companyDescription !== undefined) user.companyDescription = companyDescription;
      if (industry !== undefined) user.industry = industry;
    }

    // Handle avatar upload if present
    if (req.file) {
      user.avatar = req.file.filename;
    }

    await user.save();
    
    // Return user without password and refresh token
    const updatedUser = await User.findById(req.user.id).select('-password -refreshToken');
    
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload user resume
// @route   PUT /api/auth/resume
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.resume = req.file.filename;
    await user.save();

    res.status(200).json({ success: true, resume: user.resume });
  } catch (error) {
    console.error('Upload resume error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, refreshToken, logout, getMe, updateProfile, uploadResume, changePassword };
