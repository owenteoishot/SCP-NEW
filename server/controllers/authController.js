const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const passwordResetModel = require('../models/passwordResetModel');
const db = require('../models/db');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(username, email, hashed);
    await db.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, (SELECT role_id FROM roles WHERE role_name = \'user\'))',
      [newUser.user_id]
    );
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Attempting login for:', email);
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await userModel.findByEmail(email);
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Login failed' });
    }
    console.log('✅ User found:', user.email);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Login failed' });
    }
    const roleResult = await db.query(
      'SELECT role_name FROM roles r INNER JOIN user_roles ur ON r.role_id = ur.role_id WHERE ur.user_id = $1',
      [user.user_id]
    );
    if (!roleResult.rows[0]) {
      console.log('❌ Role not found');
      return res.status(401).json({ message: 'Login failed: no role assigned' });
    }
    const role = roleResult.rows[0].role_name;
    const token = jwt.sign(
      { userId: user.user_id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await sessionModel.createSession(
      user.user_id,
      token,
      req.ip,
      req.headers['user-agent'],
      new Date(Date.now() + 3600000)
    );
    console.log('✅ Login successful for:', user.email, 'Role:', role);
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
    res.json({ message: 'Login successful', user: { email: user.email, role } });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Logout failed' });
    }
    await sessionModel.invalidateSession(token);
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'Request failed' });
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000);
    await passwordResetModel.createResetRequest(user.user_id, token, expiresAt);
    res.json({ message: 'Password reset request processed' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Request failed' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await passwordResetModel.markResetUsed(token);
    const hash = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Reset failed' });
  }
};