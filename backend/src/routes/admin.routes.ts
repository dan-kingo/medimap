// src/routes/adminAuth.routes.ts
import express from 'express';
import { adminLogin, approvePharmacy, createMedicine, deleteMedicine, getAllMedicines, getAllOrders, getAllUsers, getPendingPharmacies, rejectPharmacy, togglePharmacyActiveStatus, updateMedicine } from '../controllers/admin.controller';
import { verifyAdmin } from '../middlewares/adminMiddleware';

const router = express.Router();
router.use(verifyAdmin);

router.get('/manage/users', getAllUsers);
router.post('/login', adminLogin);
router.get('/manage/pharmacies/pending', getPendingPharmacies);
router.put('/manage/pharmacies/:id/approve', approvePharmacy);
router.put('/manage/pharmacies/:id/reject', rejectPharmacy);
router.put('/manage/pharmacies/:id/toggle', togglePharmacyActiveStatus);
router.get('/manage/orders', getAllOrders)
router.post('/manage/medicines', createMedicine);
router.get('/manage/medicines', getAllMedicines);
router.put('/manage/medicines/:id', updateMedicine);
router.delete('/manage/medicines/:id', deleteMedicine);


export default router;
