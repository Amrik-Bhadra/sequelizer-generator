const express = require('express');
const { login, register, logout, verifyOtp, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifyotp', verifyOtp);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.post('/logout', logout);

module.exports = router;