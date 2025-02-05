const BASE_URL = 'http://localhost:8080/api/players';


// Error handler function
const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`Error ${action}: ${errorMessage}`);
  throw new Error(`Error ${action}: ${errorMessage}`);
};


// Get players from the backend
export const getPlayers = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      handleError('fetching players', 'Failed to fetch players from the server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching players', error);
  }
};

// Fetch a single player by ID
export const getPlayerById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      handleError('fetching player by ID', 'Failed to fetch player from the server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching player by ID', error);
  }
};

// Create a new player
export const createPlayer = async (playerData) => {
  try {
    console.log('Sending player data:', playerData);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      handleError('creating player', 'Failed to create player', errorResponse);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('creating player', error);
  }
};

// Update an existing player by ID
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });

    if (!response.ok) {
      handleError('updating player', 'Failed to update player');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating player', error);
  }
};

// Delete a player by ID
export const deletePlayer = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      handleError('deleting player', 'Failed to delete player');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('deleting player', error);
  }
};
  