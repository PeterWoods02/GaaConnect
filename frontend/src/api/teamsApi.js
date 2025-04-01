//const BASE_URL = 'http://localhost:8080/api/team'; 
const BASE_URL = 'http://3.253.35.199:8080/api/team';

// error handler function
const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`Error ${action}: ${errorMessage}`);
  throw new Error(`Error ${action}: ${errorMessage}`);
};


// fetch all teams
export const getTeams = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      handleError('fetching teams', 'Failed to fetch teams from the server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError('fetching teams', error);
  }
};


//fetch a single team by ID
export const getTeamById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        handleError('fetching team by ID', 'Failed to fetch team from the server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError('fetching team by ID', error);
    }
  };

// create a new team
export const createTeam = async (teamData) => {
  try {
    console.log('Sending team data:', teamData);  
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();  
      handleError('creating team', 'Failed to create team', errorResponse);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('creating team', error);
  }
};


// update an existing team by ID
export const updateTeam = async (id, teamData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      handleError('updating team', 'Failed to update team');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('updating team', error);
  }
};

// delete a team by ID
export const deleteTeam = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      handleError('deleting team', 'Failed to delete team');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleError('deleting team', error);
  }
};


// Function to add a player to a team
export const addPlayerToTeam = async (teamId, playerId) => {
  try {
    const response = await fetch(`${BASE_URL}/${teamId}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add player to team');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding player to team:', error);
    throw error; 
  }
};


//remove player from a team
export const removePlayerFromTeam = async (teamId, playerId) => {
  try {
    const response = await fetch(`${BASE_URL}/${teamId}/players/${playerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove player from team');
    }

    const data = await response.json();
    console.log('Player removed:', data);
    // update ui
  } catch (error) {
    console.error('Error removing player:', error);
  }
};



