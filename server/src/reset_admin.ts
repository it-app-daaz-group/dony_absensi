
import prisma from './utils/prisma';
import bcrypt from 'bcrypt';

//

async function main() {
  const email = 'admin@company.com';
  const newPassword = 'admin123';

  console.log(`Checking user: ${email}...`);

  const user = await prisma.employee.findFirst({
    where: { email }
  });

  if (!user) {
    console.log('User not found! Creating admin user...');
    
    // Ensure departments and shifts exist for relation
    const dept = await prisma.department.upsert({
        where: { id: 1 },
        update: {},
        create: { name: 'HRD' }
    });

    const pos = await prisma.position.create({ data: { name: 'Manager' } });
    const shift = await prisma.shift.create({ 
        data: { name: 'Regular', startTime: '08:00', endTime: '17:00' } 
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.employee.create({
      data: {
        nik: 'ADMIN001',
        name: 'Super Admin',
        email,
        password: hashedPassword,
        departmentId: dept.id,
        positionId: pos.id,
        shiftId: shift.id,
        isActive: true
      }
    });
    console.log(`Admin created with password: ${newPassword}`);

  } else {
    console.log('User found. Resetting password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.employee.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Password reset successfully to: ${newPassword}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
