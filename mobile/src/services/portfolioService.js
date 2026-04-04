import apiClient from './api';

export async function getPortfolio() {
  try {
    const response = await apiClient.get('/portfolio');
    return response.data;
  } catch (error) {
    console.error(
      'getPortfolio failed:',
      error.response?.data?.message || error.message
    );
    throw error;
  }
}

export async function addStock(data) {
  try {
    const response = await apiClient.post('/portfolio/add', data);
    return response.data;
  } catch (error) {
    console.error('addStock failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

export async function getSectorData() {
  try {
    const response = await apiClient.get('/portfolio/sectors');
    return response.data;
  } catch (error) {
    console.error(
      'getSectorData failed:',
      error.response?.data?.message || error.message
    );
    throw error;
  }
}

const portfolioService = {
  getPortfolio,
  addStock,
  getSectorData,
};

export default portfolioService;
