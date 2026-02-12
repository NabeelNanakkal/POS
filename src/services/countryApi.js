import api from './api';

export const countryApi = {
  // Get all countries
  getAllCountries: async () => {
    const response = await api.get('/countries');
    return response.data;
  },

  // Get country by ID
  getCountryById: async (id) => {
    const response = await api.get(`/countries/${id}`);
    return response.data;
  },

  // Get country by ISO code
  getCountryByCode: async (code) => {
    const response = await api.get(`/countries/code/${code}`);
    return response.data;
  },
};

export default countryApi;
