import { Request, Response } from 'express';
import prisma from '../utils/prisma';

//

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id: Number(id) }
    });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const department = await prisma.department.create({
      data: { name }
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error creating department' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error updating department' });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if department is used by any employee
    const employeeCount = await prisma.employee.count({
      where: { departmentId: Number(id) }
    });

    if (employeeCount > 0) {
      return res.status(400).json({ message: 'Cannot delete department that has employees' });
    }

    await prisma.department.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department' });
  }
};
