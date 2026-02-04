import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHolidays = async (req: Request, res: Response) => {
  try {
    const holidays = await prisma.holiday.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching holidays' });
  }
};

export const getHolidayById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const holiday = await prisma.holiday.findUnique({
      where: { id: Number(id) }
    });
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching holiday' });
  }
};

export const createHoliday = async (req: Request, res: Response) => {
  try {
    const { date, description } = req.body;
    if (!date || !description) {
      return res.status(400).json({ message: 'Date and description are required' });
    }
    
    // Check if date already exists
    const existingHoliday = await prisma.holiday.findUnique({
      where: { date: new Date(date) }
    });

    if (existingHoliday) {
      return res.status(400).json({ message: 'Holiday on this date already exists' });
    }

    const holiday = await prisma.holiday.create({
      data: { 
        date: new Date(date),
        description 
      }
    });
    res.status(201).json(holiday);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating holiday' });
  }
};

export const updateHoliday = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, description } = req.body;
    
    const data: any = {};
    if (date) data.date = new Date(date);
    if (description) data.description = description;

    const holiday = await prisma.holiday.update({
      where: { id: Number(id) },
      data
    });
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Error updating holiday' });
  }
};

export const deleteHoliday = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.holiday.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting holiday' });
  }
};
