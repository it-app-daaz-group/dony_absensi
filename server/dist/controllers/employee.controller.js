"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployee = exports.getEmployees = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// Get all employees
const getEmployees = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
};
exports.getEmployees = getEmployees;
// Create new employee
const createEmployee = async (req, res) => {
    try {
        const { nik, name, email, password, departmentId, positionId, shiftId } = req.body;
        const existing = await prisma.employee.findFirst({
            where: { OR: [{ nik }, { email }] }
        });
        if (existing) {
            return res.status(400).json({ message: 'NIK or Email already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password || '123456', 10);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating employee' });
    }
};
exports.createEmployee = createEmployee;
