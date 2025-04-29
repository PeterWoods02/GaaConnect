const BASE_URL = 'http://localhost:8080/api/statistics';

const handleError = (action, error, response = null) => {
  const errorMessage =
  error?.message || (response ? `${response.statusText}: ${response.status}` : 'An unexpected error occurred');
  if (errorMessage !== 'You are not assigned to any team yet.') {
    console.error(`Error ${action}: ${errorMessage}`);
  }
  throw new Error(errorMessage);
};

  export const getAllStatistics = async (token) => {
    try {
      const response = await fetch(BASE_URL, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const errorRes = await response.json();
        handleError('fetching statistics', new Error(errorRes.message || 'Failed to fetch statistics'), response);
        }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics', error);
    }
  };

  export const getStatisticsByTeamId = async (teamId, token) => {
    try {
      const response = await fetch(`${BASE_URL}?teamId=${teamId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const errorRes = await response.json();
        handleError('fetching statistics by Team ID', new Error(errorRes.message || 'Failed to fetch statistics'), response);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics by Team ID', error);
    }
  };

  export const getStatisticsById = async (id, token) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const errorRes = await response.json();
        handleError('fetching statistics by ID', new Error(errorRes.message || 'Failed to fetch statistics from the server'), response);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics by ID', error);
    }
  };

  export const getStatisticsByPlayerId = async (playerId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/player/${playerId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const errorRes = await response.json();
        handleError('fetching statistics by Player ID', new Error(errorRes.message || 'Failed to fetch statistics from the server'), response);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching statistics by Player ID', error);
    }
  };
  
  
  