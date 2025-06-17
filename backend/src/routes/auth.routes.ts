import express from 'express';
import { requestOtp, verifyOtpAndLogin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/send-otp', requestOtp);
router.post('/auth/verify-otp', verifyOtpAndLogin);

export default router;
