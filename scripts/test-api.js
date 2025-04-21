// Test script for API credentials
import fetch from 'node-fetch';

// API credentials
const API_KEY = 'cm9pk8nq70001ijsbp9v0509g';
const API_URL = 'cm9pk8nq70002ijsb9bpzbhvs';
const BASE_URL = 'http://localhost:3000';

async function testApi() {
  console.log('Testing API credentials...');
  console.log(`API Key: ${API_KEY}`);
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Test recharge endpoint first
    console.log('\nTesting POST /api/recharge...');
    const rechargeResponse = await fetch(`${BASE_URL}/api/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-api-url': API_URL
      }
    });
    
    const rechargeData = await rechargeResponse.json();
    console.log(`Status: ${rechargeResponse.status}`);
    console.log('Response:', JSON.stringify(rechargeData, null, 2));

    // Test GET /api/data
    console.log('\nTesting GET /api/data...');
    const getResponse = await fetch(`${BASE_URL}/api/data`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'x-api-url': API_URL
      }
    });
    
    const getData = await getResponse.json();
    console.log(`Status: ${getResponse.status}`);
    console.log('Response:', JSON.stringify(getData, null, 2));
    
    if (getResponse.ok) {
      // Test POST /api/data
      console.log('\nTesting POST /api/data...');
      const postResponse = await fetch(`${BASE_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'x-api-url': API_URL
        },
        body: JSON.stringify({
          title: 'Test Data',
          content: 'This is a test data created by the API test script.'
        })
      });
      
      const postData = await postResponse.json();
      console.log(`Status: ${postResponse.status}`);
      console.log('Response:', JSON.stringify(postData, null, 2));
      
      if (postResponse.ok && postData.id) {
        const dataId = postData.id;
        
        // Test GET /api/data/[id]
        console.log(`\nTesting GET /api/data/${dataId}...`);
        const getOneResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
          method: 'GET',
          headers: {
            'x-api-key': API_KEY,
            'x-api-url': API_URL
          }
        });
        
        const getOneData = await getOneResponse.json();
        console.log(`Status: ${getOneResponse.status}`);
        console.log('Response:', JSON.stringify(getOneData, null, 2));
        
        // Test PUT /api/data/[id]
        console.log(`\nTesting PUT /api/data/${dataId}...`);
        const putResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-api-url': API_URL
          },
          body: JSON.stringify({
            title: 'Updated Test Data',
            content: 'This test data has been updated by the API test script.'
          })
        });
        
        const putData = await putResponse.json();
        console.log(`Status: ${putResponse.status}`);
        console.log('Response:', JSON.stringify(putData, null, 2));
        
        // Test DELETE /api/data/[id]
        console.log(`\nTesting DELETE /api/data/${dataId}...`);
        const deleteResponse = await fetch(`${BASE_URL}/api/data/${dataId}`, {
          method: 'DELETE',
          headers: {
            'x-api-key': API_KEY,
            'x-api-url': API_URL
          }
        });
        
        const deleteData = await deleteResponse.json();
        console.log(`Status: ${deleteResponse.status}`);
        console.log('Response:', JSON.stringify(deleteData, null, 2));
      }
    }
    
    // Test recharge again (should fail)
    console.log('\nTesting POST /api/recharge (second attempt)...');
    const rechargeResponse2 = await fetch(`${BASE_URL}/api/recharge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-api-url': API_URL
      }
    });
    
    const rechargeData2 = await rechargeResponse2.json();
    console.log(`Status: ${rechargeResponse2.status}`);
    console.log('Response:', JSON.stringify(rechargeData2, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 