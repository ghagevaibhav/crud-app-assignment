import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Check if we already have users
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('No users found. Creating a test user...');
      
      // Create a test user
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          apiKey: 'cm9pk8nq70001ijsbp9v0509g',
          apiUrl: 'cm9pk8nq70002ijsb9bpzbhvs',
          credits: 4,
          rechargeCount: 0
        }
      });
      
      console.log(`Created test user: ${user.name} (${user.email})`);
    } else {
      console.log(`Database already seeded with ${userCount} users.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase(); 