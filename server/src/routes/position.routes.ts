import { Router } from 'express';
import { getPositions, getPositionById, createPosition, updatePosition, deletePosition } from '../controllers/position.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getPositions);
router.get('/:id', getPositionById);
router.post('/', createPosition);
router.put('/:id', updatePosition);
router.delete('/:id', deletePosition);

export default router;
