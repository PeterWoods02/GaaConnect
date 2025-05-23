const BASE_URL = 'http://localhost:8080/api/match'; 

// Error handler function
const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`Error ${action}: ${errorMessage}`);
  throw new Error(`Error ${action}: ${errorMessage}`);
};

// Get all matches from the backend
export const getMatches = async (token) => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
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
  console.log("Fetching match with ID:", id);  
  if (!id) {
    console.error('No match ID provided');
    return; // Exit the function early if matchId is invalid
  }
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
export const createMatch = async (matchData, token) => {
  try {
    console.log('Sending match data:', matchData);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
export const updateMatch = async (id, matchData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update match: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating match:', error);
  }
};

// Update or create team positions for a match
export const updateTeamPositions = async (matchId, { teamPositions, bench }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${matchId}/team`, {
      method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ teamPositions, bench }),
  });

    if (!response.ok) {
      handleError('updating team positions', 'Failed to update team positions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating team positions', error);
  }
};

export const updateTeamPositionsLive = async (matchId, teamPositions, bench, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${matchId}/team`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ teamPositions, bench }),
    });

    if (!response.ok) {
      handleError('updating team positions', response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating team positions', null, error);
  }
};


// get the team
export const getTeamForMatch = async (matchId) => {
  try {
    const response = await fetch(`${BASE_URL}/${matchId}/squad`);
    if (!response.ok) {
      throw new Error('Failed to fetch team data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    throw error;
  }
};



// Delete a match by ID
export const deleteMatch = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
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

// Start a match by ID
export const startMatch = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      handleError('starting match', 'Failed to start match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('starting match', error);
  }
};

// Update the score for a match
export const updateScore = async (id, scoreData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      handleError('updating score', 'Failed to update score');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating score', error);
  }
};

// Delete an event from a match
export const deleteEvent = async (matchId, eventId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${matchId}/event/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      handleError('deleting event', 'Failed to delete event');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('deleting event', error);
  }
};


// Log an event (goal, card, substitution)
export const logEvent = async (id, eventData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      handleError('logging event', 'Failed to log event');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('logging event', error);
  }
};

// Update player statistics for a match
export const updatePlayerStats = async (id, playerStats) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerStats),
    });

    if (!response.ok) {
      handleError('updating player statistics', 'Failed to update player statistics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating player statistics', error);
  }
};

// End a match by ID
export const endMatch = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/end`, {
      method: 'POST',
    });

    if (!response.ok) {
      handleError('ending match', 'Failed to end match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('ending match', error);
  }
};

export const getEventsForMatch = async (matchId) => {
  try {
    const response = await fetch(`${BASE_URL}/${matchId}/events`);
    if (!response.ok) {
      handleError('fetching match events', 'Failed to get events');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching match events', error);
  }
};






