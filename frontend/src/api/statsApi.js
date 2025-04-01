//const BASE_URL = 'http://localhost:8080/api/statistics';
const BASE_URL = 'http://3.253.35.199:8080/api/statistics';

const handleError = (action, error, response = null) => {
    const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
    console.error(`Error ${action}: ${errorMessage}`);
    throw new Error(`Error ${action}: ${errorMessage}`);
  };

  export const getAllStatistics = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        handleError('fetching statistics', 'Failed to fetch statistics from the server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics', error);
    }
  };

  export const getStatisticsById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        handleError('fetching statistics by ID', 'Failed to fetch statistics from the server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics by ID', error);
    }
  };

  export const getStatisticsByPlayerId = async (playerId) => {
    try {
      const response = await fetch(`${BASE_URL}/player/${playerId}`);
      if (!response.ok) {
        handleError('fetching statistics by Player ID', 'Failed to fetch statistics from the server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics by Player ID', error);
    }
  };
  
  
  