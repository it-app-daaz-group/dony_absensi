import { Router } from 'express';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from '../controllers/department.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
