import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions' });
  }
};

export const getPositionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const position = await prisma.position.findUnique({
      where: { id: Number(id) }
    });
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching position' });
  }
};

export const createPosition = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const position = await prisma.position.create({
      data: { name }
    });
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error creating position' });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const position = await prisma.position.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error updating position' });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if position is used by any employee
    const employeeCount = await prisma.employee.count({
      where: { positionId: Number(id) }
    });

    if (employeeCount > 0) {
      return res.status(400).json({ message: 'Cannot delete position that has employees' });
    }

    await prisma.position.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting position' });
  }
};
