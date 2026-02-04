"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
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
        const validPassword = await bcrypt_1.default.compare(password, employee.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate Tokens
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(employee.id, employee.position?.name || 'Employee');
        // Send Refresh Token as Cookie
        (0, jwt_1.sendRefreshToken)(res, refreshToken);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: 'No refresh token' });
    }
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        // Check if user still exists
        const employee = await prisma.employee.findUnique({ where: { id: payload.userId } });
        if (!employee)
            return res.status(401).json({ message: 'User not found' });
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(employee.id, payload.role);
        (0, jwt_1.sendRefreshToken)(res, refreshToken);
        res.json({ accessToken });
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};
exports.refresh = refresh;
const logout = (req, res) => {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.json({ message: 'Logged out' });
};
exports.logout = logout;
const me = async (req, res) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: req.user.userId },
            include: { position: true, department: true }
        });
        if (!employee)
            return res.status(404).json({ message: 'User not found' });
        res.json({
            id: employee.id,
            name: employee.name,
            nik: employee.nik,
            email: employee.email,
            role: employee.position?.name,
            department: employee.department?.name,
            photoUrl: employee.photoUrl
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.me = me;
