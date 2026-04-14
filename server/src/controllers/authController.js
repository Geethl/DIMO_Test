const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dimo_super_secret_key_2026', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Google Token missing' });
    
    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId });
    }

    const jwtToken = generateToken(user._id);
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Google Authentication failed', error: error.message });
  }
};

const facebookLogin = async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    if (!accessToken || !userID) return res.status(400).json({ message: 'Facebook credentials missing' });

    // Verify token with Facebook Graph API directly using native node fetch
    const fbResponse = await fetch(`https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`);
    const data = await fbResponse.json();

    if (data.error) throw new Error(data.error.message);

    const { email, name, id: facebookId } = data;

    if (!email) {
      return res.status(400).json({ message: 'Facebook login requires an email address. Make sure privacy settings permit it.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, facebookId });
    }

    const jwtToken = generateToken(user._id);
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Facebook Authentication failed', error: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser, googleLogin, facebookLogin };
