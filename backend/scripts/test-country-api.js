import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testCountryApi = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@pos.com',
      password: 'password123'
    });

    const token = loginRes.data.data.accessToken;
    console.log('Login successful. Token obtained.');

    // 2. Fetch Countries
    console.log('Fetching Countries...');
    const response = await axios.get(`${API_URL}/countries`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Response Status:', response.status);
    // Log structure of data
    console.log('Response Keys:', Object.keys(response.data));
    console.log('First country:', JSON.stringify(response.data.data[0], null, 2));
    console.log('Total count:', response.data.count || response.data.data.length);

  } catch (error) {
    console.error('API Test Failed:', error.response ? error.response.data : error.message);
  }
};

testCountryApi();
