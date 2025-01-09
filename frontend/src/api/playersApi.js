// Get players from the backend
export const getPlayers = async () => {
    const response = await fetch('http://localhost:8080/api/player');
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    return response.json();
  };
  