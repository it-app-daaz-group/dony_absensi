import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import { generateTokens, sendRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';

//

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, nik } = req.body;

    // Allow login with Email OR NIK
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { nik: nik || undefined }
        ]
      },
      include: {
        position: true,
        department: true
      }
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(employee.id, employee.position?.name || 'Employee');
    
    // Send Refresh Token as Cookie
    sendRefreshToken(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: employee.id,
        name: employee.name,
        nik: employee.nik,
        role: employee.position?.name,
        department: employee.department?.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const payload: any = verifyRefreshToken(token);
    
    // Check if user still exists
    const employee = await prisma.employee.findUnique({ where: { id: payload.userId } });
    if (!employee) return res.status(401).json({ message: 'User not found' });

    const { accessToken, refreshToken } = generateTokens(employee.id, payload.role);
    
    sendRefreshToken(res, refreshToken);
    
    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out' });
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.user.userId },
      include: { position: true, department: true }
    });

    if (!employee) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: employee.id,
      name: employee.name,
      nik: employee.nik,
      email: employee.email,
      role: employee.position?.name,
      department: employee.department?.name,
      photoUrl: employee.photoUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
