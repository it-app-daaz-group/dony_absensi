import { Request, Response } from 'express';
import prisma from '../utils/prisma';

//

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await prisma.position.findMany({ orderBy: { name: 'asc' } });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions' });
  }
};

export const getShifts = async (req: Request, res: Response) => {
  try {
    const shifts = await prisma.shift.findMany({ orderBy: { name: 'asc' } });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts' });
  }
};
