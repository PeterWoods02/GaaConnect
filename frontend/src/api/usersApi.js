const BASE_URL = 'http://localhost:8080/api/users';

const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`Error ${action}: ${errorMessage}`);
  throw new Error(`Error ${action}: ${errorMessage}`);
};
// eneral Users


export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (!response.ok) {
      handleError('fetching users', 'Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    handleError('fetching users', error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      handleError('fetching user by ID', 'Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    handleError('fetching user by ID', error);
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      handleError('updating user', 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    handleError('updating user', error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      handleError('deleting user', 'Failed to delete user');
    }

    return await response.json();
  } catch (error) {
    handleError('deleting user', error);
  }
};

export const getUsersByRole = async (role) => {
  try {
    const response = await fetch(`${BASE_URL}?role=${role}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users by role');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};


// Specific Players


export const getPlayers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/players`);
    if (!response.ok) {
      handleError('fetching players', 'Failed to fetch players');
    }
    return await response.json();
  } catch (error) {
    handleError('fetching players', error);
  }
};

export const createPlayer = async (playerData) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...playerData, role: 'player' }),
    });

    if (!response.ok) {
      const errorRes = await response.json();
      handleError('creating player', 'Failed to create player', errorRes);
    }

    return await response.json();
  } catch (error) {
    handleError('creating player', error);
  }
};


export const uploadProfilePicture = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${BASE_URL}/${userId}/picture`, {
      method: 'PATCH',
      body: formData,
    });

    if (!response.ok) {
      handleError('uploading profile picture', 'Failed to upload picture');
    }

    return await response.json();
  } catch (error) {
    handleError('uploading profile picture', error);
  }
};
