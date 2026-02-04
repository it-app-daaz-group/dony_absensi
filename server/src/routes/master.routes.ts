import { Router } from 'express';
import { getDepartments, getPositions, getShifts } from '../controllers/master.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all master routes

router.get('/departments', getDepartments);
router.get('/positions', getPositions);
router.get('/shifts', getShifts);

export default router;
