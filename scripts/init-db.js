import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create the database if it doesn't exist
    await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS crud_platform;`;
    console.log('Database created or already exists');

    // Run migrations
    execSync('npx prisma migrate dev', { stdio: 'inherit' });
    console.log('Migrations completed successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 