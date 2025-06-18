// src/routes/pharmacyAuthRoutes.ts
import express from 'express';
import { loginPharmacy, registerPharmacy } from '../controllers/pharmacy.auth.controller.js';
import validate from '../middlewares/validationMiddleware.js';
import { loginPharmacySchema, registerPharmacySchema } from '../validations/pharmacy.schema.js';

const router = express.Router();

router.post('/register', validate(registerPharmacySchema), registerPharmacy);
router.post('/login', validate(loginPharmacySchema), loginPharmacy);

export default router;
