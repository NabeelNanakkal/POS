import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testApi = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@pos.com',
      password: 'password123'
    });

    const token = loginRes.data.data.accessToken;
    console.log('Login successful. Token obtained.');

    // 2. Fetch Payment Modes
    console.log('Fetching Payment Modes...');
    const response = await axios.get(`${API_URL}/payment-modes`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('API Test Failed:', error.response ? error.response.data : error.message);
  }
};

testApi();
