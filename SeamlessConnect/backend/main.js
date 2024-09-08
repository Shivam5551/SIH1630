import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "kailee.eichmann@ethereal.email", 
    pass: "G5XMyT8ewj4SswzCQx",
  },
});

// Async function to send email
export const otpSend = async (data) => {
  try {
    const otp = generateOtp();
    const info = await transporter.sendMail({
      from: 'Seamless Connect', // Sender address
      to: `${data.emailID}`, // List of receivers
      subject: "OTP", // Subject line
      text: `Your OTP is ${otp}`, // Plain text body

    });

    console.log("Message sent: %s", info.messageId, data.emailID);
    return otp;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); 
};
