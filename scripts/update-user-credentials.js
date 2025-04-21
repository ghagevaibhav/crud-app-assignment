import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserCredentials() {
  try {
    // Get the first user (or you can specify a user ID)
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }
    
    const user = users[0];
    console.log(`Updating user: ${user.name} (${user.email})`);
    
    // Update the user with API credentials
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        apiKey: 'cm9pk8nq70001ijsbp9v0509g',
        apiUrl: 'cm9pk8nq70002ijsb9bpzbhvs',
        credits: 4,
        rechargeCount: 0,
      },
    });
    
    console.log('User updated successfully:');
    console.log(`User ID: ${updatedUser.id}`);
    console.log(`Name: ${updatedUser.name}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`API Key: ${updatedUser.apiKey}`);
    console.log(`API URL: ${updatedUser.apiUrl}`);
    console.log(`Credits: ${updatedUser.credits}`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserCredentials(); 