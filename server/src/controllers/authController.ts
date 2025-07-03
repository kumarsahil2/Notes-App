import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateOTP, sendOTP, storeOTP, validateOTP } from '../utils/otpUtils';

const pendingSignups: Record<string, { username: string; dob: string; email: string }> = {};

export const requestSignupOTP = async (req: Request, res: Response) => {
  const { username, dob, email } = req.body;
  if (!username || !dob || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists.' });

  const otp = generateOTP();
  await sendOTP(email, otp);
  storeOTP(email, otp);
  pendingSignups[email] = { username, dob, email };
  res.json({ message: 'OTP sent to email.' });
};

export const verifySignupOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!validateOTP(email, otp)) return res.status(400).json({ message: 'Invalid OTP.' });

  const signupData = pendingSignups[email];
  if (!signupData) return res.status(400).json({ message: 'No pending signup.' });

  const user = new User(signupData);
  await user.save();
  delete pendingSignups[email];
  res.json({ message: 'Signup successful.' });
};

export const requestSigninOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User does not exist.' });

  const otp = generateOTP();
  await sendOTP(email, otp);
  storeOTP(email, otp);
  res.json({ message: 'OTP sent to email.' });
};

export const verifySigninOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!validateOTP(email, otp)) return res.status(400).json({ message: 'Invalid OTP.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User does not exist.' });

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

    res.json({ message: 'Login successful.', token, name: user.username, email: user.email });

};