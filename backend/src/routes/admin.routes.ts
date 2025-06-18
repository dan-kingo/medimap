// src/routes/adminAuth.routes.ts
import express from 'express';
import { adminLogin, approvePharmacy, getAllUsers, getPendingPharmacies, rejectPharmacy, togglePharmacyActiveStatus } from '../controllers/admin.controller';
import { verifyAdmin } from '../middlewares/adminMiddleware';

const router = express.Router();
router.use(verifyAdmin);

router.get('/manage/users', getAllUsers);
router.post('/login', adminLogin);
router.get('/manage/pharmacies/pending', getPendingPharmacies);
router.put('/manage/pharmacies/:id/approve', approvePharmacy);
router.put('/manage/pharmacies/:id/reject', rejectPharmacy);
router.put('/manage/pharmacies/:id/toggle', togglePharmacyActiveStatus);



export default router;
