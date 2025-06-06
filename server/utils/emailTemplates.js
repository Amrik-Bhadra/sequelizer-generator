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



module.exports = { otpEmailTemplate, welcomeEmailTemplate };
