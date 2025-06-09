const otpEmailTemplate = (otp) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0056b3;">Your One-Time Password (OTP)</h2>
            <p>Hello,</p>
            <p>Your OTP for verification is: <strong style="font-size: 18px; color: #d9534f;">${otp}</strong></p>
            <p>This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</footer>
        </div>
    `;
};

const welcomeEmailTemplate = (userName) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0056b3;">Welcome to Sequelizer, ${userName}!</h2>
            <p>We're excited to have you on board. With Sequelizer, you can visually create, customize, and manage Sequelize ORM models for MySQL without repetitive coding.</p>
            <p>Start building models faster, save them for future use, and streamline your backend development workflow.</p>
            <br>
            <p>Happy Coding!</p>
            <p>Team Indigo</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">Sequelizer - All Rights Reserved</footer>
        </div>
    `;
};


const oneTimePasswordEmailTemplate = (userName, password) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d9534f;">Action Required: Reset Your Password, ${userName}</h2>
            <p>Welcome to Sequelizer! As a part of your initial login, a one-time password has been generated for you.</p>
            <p><strong>One-Time Password:</strong> <code style="background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
            <p><strong>For your security, it is highly recommended to reset your password immediately.</strong></p>
            <p>You can reset your password using the following link:</p>
            <p><a href="http://localhost:5173/auth/resetpassword" style="color: #007bff;">Reset Password</a></p>
            <br>
            <p>If you did not request this or believe it to be a mistake, please contact our support team.</p>
            <p>Stay secure,</p>
            <p>Team Indigo</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">Sequelizer - All Rights Reserved</footer>
        </div>
    `;
};


module.exports = { otpEmailTemplate, welcomeEmailTemplate, oneTimePasswordEmailTemplate };
