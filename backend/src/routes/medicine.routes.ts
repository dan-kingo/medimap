// routes/medicine.routes.ts
import express from 'express';
import { getMedicineDetails, getPopularMedicines, searchMedicines } from '../controllers/medicine.controller';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/popular', getPopularMedicines);
router.get('/:id', getMedicineDetails); // Assuming this is for getting details of a specific medicine

export default router;
