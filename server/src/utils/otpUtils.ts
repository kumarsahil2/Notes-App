import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

const otpStore: Record<string, string> = {};

export const generateOTP = (): string => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  // Create transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const storeOTP = (email: string, otp: string): void => {
  otpStore[email] = otp;
};

export const validateOTP = (email: string, userOTP: string): boolean => {
  return otpStore[email] === userOTP;
};