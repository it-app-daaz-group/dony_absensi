
import { Router } from 'express';
import { getShifts, getShiftById, createShift, updateShift, deleteShift } from '../controllers/shift.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getShifts);
router.get('/:id', getShiftById);
router.post('/', authorize(['Manager']), createShift);
router.put('/:id', authorize(['Manager']), updateShift);
router.delete('/:id', authorize(['Manager']), deleteShift);

export default router;
