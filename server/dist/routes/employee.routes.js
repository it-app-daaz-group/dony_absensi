"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate); // Protect all employee routes
router.get('/', employee_controller_1.getEmployees);
router.post('/', employee_controller_1.createEmployee);
exports.default = router;
