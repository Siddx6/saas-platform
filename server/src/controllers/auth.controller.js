const crypto = require('crypto');
const User = require('../models/User.model');
const Workspace = require('../models/Workspace.model');
const RefreshToken = require('../models/RefreshToken.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Create workspace
    const workspace = await Workspace.create({ name: `${name}'s Workspace` });

    // Email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'owner',
      workspaceId: workspace._id,
      isVerified: false,
      verifyToken,
    });

    // Update workspace with owner
    workspace.ownerId = user._id;
    workspace.memberIds = [user._id];
    await workspace.save();

    // Send verification email — don't block signup if email fails
try {
  await sendEmail({
    to: email,
    subject: 'Verify your email — SaaSPlatform',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to SaaSPlatform, ${name}!</h2>
        <p>Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0;">
          Verify Email
        </a>
      </div>
    `,
  });
} catch (emailErr) {
  console.error('Email send failed:', emailErr.message);
}

    const accessToken = generateAccessToken(user._id);
    const refresh = await generateRefreshToken(user._id);

    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, workspaceId: user.workspaceId },
      token: accessToken,
      refreshToken: refresh,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Please sign in with Google' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const accessToken = generateAccessToken(user._id);
    const refresh = await generateRefreshToken(user._id);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, workspaceId: user.workspaceId, notifications: user.notifications },
      token: accessToken,
      refreshToken: refresh,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const accessToken = generateAccessToken(stored.userId);
    res.json({ token: accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link was sent' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: email,
      subject: 'Reset your password — SaaSPlatform',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'If that email exists, a reset link was sent' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/verify-email/:token
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid verification link' });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/google/callback
const googleCallback = async (req, res) => {
  try {
    const accessToken = generateAccessToken(req.user._id);
    const refresh = await generateRefreshToken(req.user._id);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&refreshToken=${refresh}`
    );
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  googleCallback,
};