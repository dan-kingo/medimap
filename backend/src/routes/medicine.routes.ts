// routes/medicine.routes.ts
import express from 'express';
import { getPopularMedicines, searchMedicines } from '../controllers/medicine.controller';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/popular', getPopularMedicines);

export default router;
