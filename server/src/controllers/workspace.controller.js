const crypto = require('crypto');
const Workspace = require('../models/Workspace.model');
const User = require('../models/User.model');
const InviteToken = require('../models/InviteToken.model');
const sendEmail = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// GET /api/workspace
const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.user.workspaceId);
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/workspace
const updateWorkspace = async (req, res, next) => {
  try {
    const { name, logo } = req.body;
    const workspace = await Workspace.findByIdAndUpdate(
      req.user.workspaceId,
      { name, logo },
      { new: true }
    );
    res.json({ workspace });
  } catch (err) {
    next(err);
  }
};

// GET /api/workspace/members
const getMembers = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.user.workspaceId).populate(
      'memberIds',
      'name email role'
    );
    res.json(workspace.memberIds);
  } catch (err) {
    next(err);
  }
};

// POST /api/workspace/invite
const inviteMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const existing = await User.findOne({ email, workspaceId: req.user.workspaceId });
    if (existing) return res.status(400).json({ message: 'User already in workspace' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    await InviteToken.create({
      workspaceId: req.user.workspaceId,
      email,
      role: role || 'member',
      token,
      expiresAt,
    });

    const workspace = await Workspace.findById(req.user.workspaceId);
    const inviteUrl = `${process.env.CLIENT_URL}/invite/${token}`;

    await sendEmail({
      to: email,
      subject: `You've been invited to ${workspace.name} on SaaSPlatform`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>You're invited!</h2>
          <p><strong>${req.user.name}</strong> has invited you to join <strong>${workspace.name}</strong> on SaaSPlatform.</p>
          <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0;">
            Accept Invite
          </a>
          <p style="color:#6b7280;font-size:13px;">This link expires in 48 hours.</p>
        </div>
      `,
    });

    res.json({ message: 'Invite sent successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/workspace/accept-invite/:token
const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    const invite = await InviteToken.findOne({ token, expiresAt: { $gt: new Date() } });
    if (!invite) return res.status(400).json({ message: 'Invalid or expired invite link' });

    const existing = await User.findOne({ email: invite.email });
    if (existing) return res.status(400).json({ message: 'Account already exists with this email' });

    const user = await User.create({
      name,
      email: invite.email,
      password,
      role: invite.role,
      workspaceId: invite.workspaceId,
      isVerified: true,
    });

    await Workspace.findByIdAndUpdate(invite.workspaceId, {
      $push: { memberIds: user._id },
    });

    await InviteToken.deleteOne({ token });

    const accessToken = generateAccessToken(user._id);
    const refresh = await generateRefreshToken(user._id);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, workspaceId: user.workspaceId },
      token: accessToken,
      refreshToken: refresh,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/workspace/members/:id/role
const changeMemberRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id, workspaceId: req.user.workspaceId },
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Member not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/workspace/members/:id
const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.findOneAndDelete({ _id: id, workspaceId: req.user.workspaceId });
    await Workspace.findByIdAndUpdate(req.user.workspaceId, {
      $pull: { memberIds: id },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkspace,
  updateWorkspace,
  getMembers,
  inviteMember,
  acceptInvite,
  changeMemberRole,
  removeMember,
};