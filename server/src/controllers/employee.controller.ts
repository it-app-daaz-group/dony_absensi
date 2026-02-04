import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

//

// Get all employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
        shift: true
      },
      orderBy: { name: 'asc' }
    });
    
    // Remove password from response
    const safeEmployees = employees.map(emp => {
      const { password, ...rest } = emp;
      return rest;
    });

    res.json(safeEmployees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Create new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { nik, name, email, password, departmentId, positionId, shiftId } = req.body;

    const existing = await prisma.employee.findFirst({
      where: { OR: [{ nik }, { email }] }
    });

    if (existing) {
      return res.status(400).json({ message: 'NIK or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const employee = await prisma.employee.create({
      data: {
        nik,
        name,
        email,
        password: hashedPassword,
        departmentId: Number(departmentId),
        positionId: Number(positionId),
        shiftId: Number(shiftId)
      }
    });

    res.status(201).json({ message: 'Employee created successfully', id: employee.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating employee' });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { password, ...safeEmployee } = employee;
    res.json(safeEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee' });
  }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nik, name, email, password, departmentId, positionId, shiftId, isActive } = req.body;

    const data: any = {
      nik,
      name,
      email,
      departmentId: Number(departmentId),
      positionId: Number(positionId),
      shiftId: Number(shiftId),
      isActive: Boolean(isActive)
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    await prisma.employee.update({
      where: { id: Number(id) },
      data
    });

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating employee' });
  }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.employee.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee' });
  }
};
