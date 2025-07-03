import { Router } from 'express';
import {
  requestSignupOTP,
  verifySignupOTP,
  requestSigninOTP,
  verifySigninOTP
} from '../controllers/authController';

const router = Router();

router.post('/signup/request-otp', requestSignupOTP);
router.post('/signup/verify-otp', verifySignupOTP);
router.post('/signin/request-otp', requestSigninOTP);
router.post('/signin/verify-otp', verifySigninOTP);

export default router;