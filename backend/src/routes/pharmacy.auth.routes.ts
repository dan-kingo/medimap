// src/routes/pharmacyAuthRoutes.ts
import express from 'express';
import { loginPharmacy, registerPharmacy } from '../controllers/pharmacy.auth.controller';

const router = express.Router();

router.post('/register', registerPharmacy);
router.post('/login', loginPharmacy);

export default router;
