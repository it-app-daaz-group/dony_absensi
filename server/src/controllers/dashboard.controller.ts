import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalEmployees, totalDepartments, totalPositions, totalShifts] = await Promise.all([
      prisma.employee.count(),
      prisma.department.count(),
      prisma.position.count(),
      prisma.shift.count(),
    ]);

    res.json({
      totalEmployees,
      totalDepartments,
      totalPositions,
      totalShifts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
