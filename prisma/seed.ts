import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("12345678", 8)
  await prisma.user.create({
    data: {
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: hashedPassword,
      employeeId: "12345",
      userName: "jhondoe",
      createdAt: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
