import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.PLATFORM_MAIL,
    pass: process.env.PLATFORM_PASSWORD,
  },
});

// Async function to send email
export const otpSend = async (data) => {
  try {
    const otp = generateOtp();
    const info = await transporter.sendMail({
      from: 'Seamless Connect <seamlessconnect82@gmail.com>', // Sender address
      to: `${data.emailID}`, // List of receivers
      subject: 'OTP', // Subject line
      text: `Your OTP is ${otp}`, // Plain text body
    });

    console.log("Message sent: %s", info.messageId, data.emailID);
    return otp;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
