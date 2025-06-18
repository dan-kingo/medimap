// src/routes/adminAuth.routes.ts
import express from 'express';
import { adminLogin, approvePharmacy, createMedicine, deleteMedicine, exportAnalyticsExcel, exportAnalyticsPDF, getAllMedicines, getAllOrders, getAllUsers, getBasicAnalytics, getPendingPharmacies, rejectPharmacy, togglePharmacyActiveStatus, updateMedicine } from '../controllers/admin.controller';
import { verifyAdmin } from '../middlewares/adminMiddleware';

const router = express.Router();
router.use(verifyAdmin);

router.post('/login', adminLogin);
router.get('/manage/users', getAllUsers);
router.get('/manage/analytics', getBasicAnalytics);
router.get('/manage/pharmacies/pending', getPendingPharmacies);
router.put('/manage/pharmacies/:id/approve', approvePharmacy);
router.put('/manage/pharmacies/:id/reject', rejectPharmacy);
router.put('/manage/pharmacies/:id/toggle', togglePharmacyActiveStatus);
router.get('/manage/orders', getAllOrders)
router.post('/manage/medicines', createMedicine);
router.get('/manage/medicines', getAllMedicines);
router.put('/manage/medicines/:id', updateMedicine);
router.delete('/manage/medicines/:id', deleteMedicine);
router.get('/manage/analytics/excel', exportAnalyticsExcel);
router.get('/manage/analytics/pdf', exportAnalyticsPDF);

export default router;
