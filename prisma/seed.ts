import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial users and categories...');

  // 1. Create Users
  const password = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: password,
      role: 'ADMIN',
    },
  });

  const officer1 = await prisma.user.upsert({
    where: { email: 'officer1@example.com' },
    update: {},
    create: {
      name: 'Anisur Rahman',
      email: 'officer1@example.com',
      password: password,
      role: 'USER',
    },
  });

  const officer2 = await prisma.user.upsert({
    where: { email: 'officer2@example.com' },
    update: {},
    create: {
      name: 'Farhana Yeasmin',
      email: 'officer2@example.com',
      password: password,
      role: 'USER',
    },
  });

  // 2. Create Categories
  const categories = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'UPS', 'Scanner'];
  
  for (const catName of categories) {
    await prisma.category.upsert({
      where: { id: categories.indexOf(catName) + 1 },
      update: {},
      create: {
        id: categories.indexOf(catName) + 1,
        name: catName,
      },
    });
  }

  console.log('Seeding finished.');
  console.log({
    users: [admin.email, officer1.email, officer2.email],
    categories_created: categories.length
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
