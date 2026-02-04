import { Router } from 'express';
import { 
  getEmployees, 
  createEmployee, 
  getEmployeeById, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employee.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all employee routes

router.get('/', getEmployees);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
