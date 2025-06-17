import express from 'express';
import { loginWithPassword, requestOtp, setPassword, verifyOtpAndLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/send-otp', requestOtp);
router.post('/auth/verify-otp', verifyOtpAndLogin);
router.post('/auth/resend-otp', requestOtp);
router.post('/auth/set-password', setPassword);
router.post('/auth/login-with-password', loginWithPassword);

export default router;
