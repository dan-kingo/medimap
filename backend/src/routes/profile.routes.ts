// src/routes/profileRoutes.ts
import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware';
import { addAddress, deleteAddress, getProfile, updateAddress, updateProfile } from '../controllers/profile.controller';


const router = express.Router();

router.use(authenticateUser);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

export default router;
