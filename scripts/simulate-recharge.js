import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function simulateRecharge(email) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Check if user has already recharged
    if (user.rechargeCount >= 1) {
      console.log('User has already recharged once. Cannot recharge again.');
      return;
    }

    // Make API request to recharge endpoint
    const response = await fetch('http://localhost:3000/api/recharge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl,
      },
    });

    const data = await response.json();
    console.log('Recharge response:', data);

    // Verify the update in database
    const updatedUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log('Updated user credits:', updatedUser.credits);
    console.log('Updated recharge count:', updatedUser.rechargeCount);

  } catch (error) {
    console.error('Error simulating recharge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
const testEmail = process.argv[2];
if (!testEmail) {
  console.log('Please provide an email address as an argument');
  process.exit(1);
}

simulateRecharge(testEmail); 