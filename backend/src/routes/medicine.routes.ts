// routes/medicine.routes.ts
import express from 'express';
import { getMedicineDetails, getPopularMedicines, searchMedicines } from '../controllers/medicine.controller.js';
import validate from '../middlewares/validationMiddleware.js';
import { medicineDetailsParamsSchema, searchMedicinesQuerySchema } from '../validations/medicine.schema.js';

const router = express.Router();

router.get('/search', validate(searchMedicinesQuerySchema), searchMedicines);
router.get('/popular', getPopularMedicines);
router.get('/:id', validate(medicineDetailsParamsSchema), getMedicineDetails); // Assuming this is for getting details of a specific medicine

export default router;
