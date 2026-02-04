
import prisma from './utils/prisma';

//

async function main() {
  const depts = await prisma.department.findMany();
  console.log('Departments:', depts);

  const positions = await prisma.position.findMany();
  console.log('Positions:', positions);

  const shifts = await prisma.shift.findMany();
  console.log('Shifts:', shifts);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
