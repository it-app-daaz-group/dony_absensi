
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

//

export const getShifts = async (req: Request, res: Response) => {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts' });
  }
};

export const getShiftById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shift = await prisma.shift.findUnique({
      where: { id: Number(id) }
    });
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift' });
  }
};

export const createShift = async (req: Request, res: Response) => {
  try {
    const { name, startTime, endTime, lateTolerance } = req.body;
    
    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: 'Name, start time, and end time are required' });
    }

    const shift = await prisma.shift.create({
      data: {
        name,
        startTime,
        endTime,
        lateTolerance: lateTolerance ? Number(lateTolerance) : 15
      }
    });
    
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shift' });
  }
};

export const updateShift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, startTime, endTime, lateTolerance } = req.body;
    
    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: 'Name, start time, and end time are required' });
    }

    const shift = await prisma.shift.update({
      where: { id: Number(id) },
      data: {
        name,
        startTime,
        endTime,
        lateTolerance: lateTolerance ? Number(lateTolerance) : 15
      }
    });
    
    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift' });
  }
};

export const deleteShift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if shift is used by any employee
    const employeeCount = await prisma.employee.count({
      where: { shiftId: Number(id) }
    });

    if (employeeCount > 0) {
      return res.status(400).json({ message: 'Cannot delete shift that is assigned to employees' });
    }

    await prisma.shift.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift' });
  }
};
