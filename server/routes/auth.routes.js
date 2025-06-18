const express = require('express');
const { login, register, logout, verifyOtp, forgotPassword, resetPassword, googleLogin, googleRegister } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifyotp', verifyOtp);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.post('/logout', logout);

router.post('/google-login', googleLogin);
router.post('/google-register', googleRegister)
// router.get('/me', checkCredentials, getUserDetails);

module.exports = router;