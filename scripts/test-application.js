import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testApplication() {
  console.log('🧪 Testing CRUD Platform Application');
  console.log('====================================');
  
  try {
    // 1. Check if we have a test user
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('❌ No users found in the database. Please create a test user first.');
      return;
    }
    
    const user = users[0];
    console.log(`✅ Found test user: ${user.name} (${user.email})`);
    console.log(`   API Key: ${user.apiKey}`);
    console.log(`   API URL: ${user.apiUrl}`);
    console.log(`   Credits: ${user.credits}`);
    console.log(`   Recharge Count: ${user.rechargeCount}`);
    
    // 2. Test API endpoints with the user's credentials
    console.log('\n🔍 Testing API Endpoints');
    console.log('------------------------');
    
    // Test GET /api/data
    console.log('\n📡 Testing GET /api/data');
    const getResponse = await fetch(`${BASE_URL}/api/data`, {
      method: 'GET',
      headers: {
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl
      }
    });
    
    const getData = await getResponse.json();
    console.log(`   Status: ${getResponse.status}`);
    console.log(`   Response: ${JSON.stringify(getData)}`);
    
    // Test POST /api/data
    console.log('\n📡 Testing POST /api/data');
    const postResponse = await fetch(`${BASE_URL}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl
      },
      body: JSON.stringify({
        title: 'Test Data',
        content: 'This is a test data created by the API test script.'
      })
    });
    
    const postData = await postResponse.json();
    console.log(`   Status: ${postResponse.status}`);
    console.log(`   Response: ${JSON.stringify(postData)}`);
    
    let dataId = null;
    if (postResponse.ok && postData.id) {
      dataId = postData.id;
      
      // Test GET /api/data/[id]
      console.log(`\n📡 Testing GET /api/data/${dataId}`);
      const getOneResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
        method: 'GET',
        headers: {
          'x-api-key': user.apiKey,
          'x-api-url': user.apiUrl
        }
      });
      
      const getOneData = await getOneResponse.json();
      console.log(`   Status: ${getOneResponse.status}`);
      console.log(`   Response: ${JSON.stringify(getOneData)}`);
      
      // Test PUT /api/data/[id]
      console.log(`\n📡 Testing PUT /api/data/${dataId}`);
      const putResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': user.apiKey,
          'x-api-url': user.apiUrl
        },
        body: JSON.stringify({
          title: 'Updated Test Data',
          content: 'This test data has been updated by the API test script.'
        })
      });
      
      const putData = await putResponse.json();
      console.log(`   Status: ${putResponse.status}`);
      console.log(`   Response: ${JSON.stringify(putData)}`);
      
      // Test DELETE /api/data/[id]
      console.log(`\n📡 Testing DELETE /api/data/${dataId}`);
      const deleteResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': user.apiKey,
          'x-api-url': user.apiUrl
        }
      });
      
      const deleteData = await deleteResponse.json();
      console.log(`   Status: ${deleteResponse.status}`);
      console.log(`   Response: ${JSON.stringify(deleteData)}`);
    }
    
    // 3. Test recharge functionality
    console.log('\n💰 Testing Recharge Functionality');
    console.log('--------------------------------');
    
    // First recharge (should succeed)
    console.log('\n📡 Testing POST /api/recharge (First attempt)');
    const rechargeResponse = await fetch(`${BASE_URL}/api/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl
      }
    });
    
    const rechargeData = await rechargeResponse.json();
    console.log(`   Status: ${rechargeResponse.status}`);
    console.log(`   Response: ${JSON.stringify(rechargeData)}`);
    
    // Second recharge (should fail)
    console.log('\n📡 Testing POST /api/recharge (Second attempt)');
    const rechargeResponse2 = await fetch(`${BASE_URL}/api/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl
      }
    });
    
    const rechargeData2 = await rechargeResponse2.json();
    console.log(`   Status: ${rechargeResponse2.status}`);
    console.log(`   Response: ${JSON.stringify(rechargeData2)}`);
    
    // 4. Check updated user data
    console.log('\n👤 Checking Updated User Data');
    console.log('---------------------------');
    
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    
    console.log(`   Credits: ${updatedUser.credits}`);
    console.log(`   Recharge Count: ${updatedUser.rechargeCount}`);
    
    // 5. Test with exhausted credits
    console.log('\n⚠️ Testing with Exhausted Credits');
    console.log('--------------------------------');
    
    // Update user to have 0 credits
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: 0 }
    });
    
    // Try to make an API request
    console.log('\n📡 Testing GET /api/data with 0 credits');
    const exhaustedResponse = await fetch(`${BASE_URL}/api/data`, {
      method: 'GET',
      headers: {
        'x-api-key': user.apiKey,
        'x-api-url': user.apiUrl
      }
    });
    
    const exhaustedData = await exhaustedResponse.json();
    console.log(`   Status: ${exhaustedResponse.status}`);
    console.log(`   Response: ${JSON.stringify(exhaustedData)}`);
    
    // Restore user credits
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: 4 }
    });
    
    console.log('\n✅ Application test completed!');
    
  } catch (error) {
    console.error('❌ Error testing application:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApplication(); 