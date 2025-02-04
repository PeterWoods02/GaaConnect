const BASE_URL = 'http://localhost:8080/api/team'; 

// Generic error handler function
const handleError = (action, error) => {
  console.error(`Error ${action}:`, error);
  throw new Error(`Error ${action}`);
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
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      handleError('creating team', 'Failed to create team');
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
