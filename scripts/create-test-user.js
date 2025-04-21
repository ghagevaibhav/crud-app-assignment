import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@example.com',
        apiKey: 'test_api_key_' + Date.now(),
        apiUrl: 'test_api_url_' + Date.now(),
        credits: 4,
        rechargeCount: 0,
      },
    });

    console.log('Test user created successfully:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 