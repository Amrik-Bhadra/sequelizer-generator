const md5 = require('md5');
const { createUser, findUserByEmail, updateUserOtp, getUserById, clearUserOtp, updateUserPassword, findUserByEmailUid, createUserGoogleAuth, getUserData } = require('../models/User.model');
const sendEmail = require('../utils/emailService');
const { otpEmailTemplate, welcomeEmailTemplate } = require('../utils/emailTemplates');

function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.session.user;
        const user = await getUserData(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: user,
        });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

const register = async (req, res) => {
    try {
        const { email, username, password, uid } = req.body;
        const user = await findUserByEmail(email);

        if (user) return res.status(409).json({ message: 'Email Already Exists' });

        const hashedPassword = md5(password);
        await createUser(username, email, hashedPassword, uid);

        const emailStatus = await sendEmail(email, 'Welcome To Sequelizer', welcomeEmailTemplate(username));

        if (!emailStatus.success) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const googleRegister = async (req, res) => {
    try {
        const { uid, email, username } = req.body;
        const user = await findUserByEmail(email);

        if (user) return res.status(409).json({ message: 'Email Already Exists' });
        await createUserGoogleAuth(uid, email, username);

        const emailStatus = await sendEmail(email, 'Welcome To Sequelizer', welcomeEmailTemplate(username));

        if (!emailStatus.success) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Email does not exist' });
        }

        const isMatch = (md5(password) === user.password) ? true : false;
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const otp = generateOTP();
        await updateUserOtp(user.user_id, otp);

        const emailStatus = await sendEmail(user.email, 'Your OTP for Login', otpEmailTemplate(otp));

        if (!emailStatus.success) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(200).json({ message: 'OTP sent to your email.', user_id: user.user_id });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { email, uid } = req.body;
        const user = await findUserByEmailUid(email, uid);
        if (!user) {
            return res.status(401).json({ message: "User Not Found!" });
        }

        const otp = generateOTP();
        await updateUserOtp(user.user_id, otp);

        const emailStatus = await sendEmail(user.email, 'Your OTP for Login', otpEmailTemplate(otp));

        if (!emailStatus.success) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(200).json({ message: 'OTP sent to your email.', user_id: user.user_id });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { user_id, otp, purpose } = req.body;
        const user = await getUserById(user_id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid user.' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP.' });
        }

        await clearUserOtp(user_id);
        if (purpose === 'login') {
            req.session.user = {
                id: user.user_id,
                username: user.username,
                email: user.email
            };

            console.log('session user: ', req.session.user);

            return res.status(200).json({ message: 'OTP verified, login successful.', user: req.session.user });
        }

        if (purpose === 'forgot_password') {
            return res.status(200).json({ message: 'OTP verified. Proceed to reset password.' });
        }

        return res.status(400).json({ message: 'Invalid purpose provided.' });
    } catch (error) {
        console.error('Error in verifyotp:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

        const otp = generateOTP();
        await updateUserOtp(user.user_id, otp);

        const emailStatus = await sendEmail
            (email, 'OTP for Password Reset', otpEmailTemplate(otp));

        if (!emailStatus.success) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        res.status(200).json({ message: 'OTP sent to your email for password reset.', user_id: user.user_id });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { user_id, otp, new_password } = req.body;

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'Invalid user.' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP.' });
        }

        const hashedPassword = md5(new_password);
        await updateUserPassword(user_id, hashedPassword);
        await clearUserOtp(user_id);

        res.status(200).json({ message: 'Password reset successful. Please login with new password.' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logged out successfully" });
    });
};

module.exports = {
    login, register, googleRegister, verifyOtp, forgotPassword, resetPassword, googleLogin, logout, getUserDetails
}