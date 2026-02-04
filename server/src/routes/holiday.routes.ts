import { Router } from 'express';
import { getHolidays, getHolidayById, createHoliday, updateHoliday, deleteHoliday } from '../controllers/holiday.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getHolidays);
router.get('/:id', getHolidayById);
router.post('/', createHoliday);
router.put('/:id', updateHoliday);
router.delete('/:id', deleteHoliday);

export default router;
