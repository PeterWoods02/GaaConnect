const BASE_URL = 'http://localhost:8080/api/match'; 

// Error handler function
const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`Error ${action}: ${errorMessage}`);
  throw new Error(`Error ${action}: ${errorMessage}`);
};

// Get all matches from the backend
export const getMatches = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      handleError('fetching matches', 'Failed to fetch matches from the server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching matches', error);
  }
};

// Fetch a single match by ID
export const getMatchById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      handleError('fetching match by ID', 'Failed to fetch match from the server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching match by ID', error);
  }
};

// Create a new match
export const createMatch = async (matchData) => {
  try {
    console.log('Sending match data:', matchData);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      handleError('creating match', 'Failed to create match', errorResponse);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('creating match', error);
  }
};

// Update an existing match by ID
export const updateMatch = async (id, matchData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      handleError('updating match', 'Failed to update match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating match', error);
  }
};

// Delete a match by ID
export const deleteMatch = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      handleError('deleting match', 'Failed to delete match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('deleting match', error);
  }
};
