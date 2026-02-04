import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Departments
  const deptHR = await prisma.department.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'HRD' },
  });
  
  const deptIT = await prisma.department.create({
    data: { name: 'IT' }
  });

  // 2. Create Positions
  const posManager = await prisma.position.create({
    data: { name: 'Manager' }
  });
  
  const posStaff = await prisma.position.create({
    data: { name: 'Staff' }
  });

  // 3. Create Shift
  const shiftNormal = await prisma.shift.create({
    data: {
      name: 'Regular Shift',
      startTime: '08:00',
      endTime: '17:00',
      lateTolerance: 15
    }
  });

  // 4. Create Admin User
  const password = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.employee.upsert({
    where: { nik: 'ADMIN001' },
    update: {},
    create: {
      nik: 'ADMIN001',
      name: 'Super Admin',
      email: 'admin@company.com',
      password: password,
      departmentId: deptHR.id,
      positionId: posManager.id,
      shiftId: shiftNormal.id,
      isActive: true
    }
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
