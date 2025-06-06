const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, 
  secure: false,     
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS  
  }
});

const sendEmail = async(to, subject, htmlContent) => {
    try{
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email Sent: ', info.messageId);
        return {success: true, message: "Email sent successfully!"};
    }catch(error){
        console.error("Error sending email: ", error);
        return { success: false, message: "Failed to send email." };
    }
}

module.exports = sendEmail;
