const express = require('express');
const { registerUser, loginUser, logoutUser, googleLogin, facebookLogin, updateUserProfile, toggleWishlist } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/profile', updateUserProfile);
router.post('/wishlist', toggleWishlist);

module.exports = router;
