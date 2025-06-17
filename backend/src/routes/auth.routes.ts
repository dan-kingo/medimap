import express from 'express';
import { forgotPasswordRequestOtp, loginWithPassword, requestOtp, resendOtp, setPassword, verifyForgotPasswordOtp, verifyOtpAndLogin } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validationMiddleware.js';
import { loginWithPasswordSchema, requestOtpSchema, setPasswordSchema, verifyOtpSchema } from '../validations/auth.schema.js';

const router = express.Router();

router.post('/auth/send-otp', validate(requestOtpSchema), requestOtp);
router.post('/auth/resend-otp', resendOtp);
router.post('/auth/verify-otp', validate(verifyOtpSchema), verifyOtpAndLogin);
router.post('/forgot-password/request-otp', forgotPasswordRequestOtp);
router.post('/forgot-password/verify-otp', verifyForgotPasswordOtp);
router.post('/auth/set-password',authenticateUser,validate(setPasswordSchema), setPassword);
router.post('/auth/login-with-password',validate(loginWithPasswordSchema), loginWithPassword);

export default router;
