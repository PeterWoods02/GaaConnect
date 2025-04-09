const BASE_URL = 'http://localhost:8080/api/invites';

// Send manager invite (admin only)
export const sendManagerInvite = async (email) => {
    const token = localStorage.getItem('token');
  
    const response = await fetch('http://localhost:8080/api/invites/inviteManager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅include token here
      },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send manager invite');
    }
  
    return await response.json();
  };
  

// Verify token from invite link
export const verifyInviteToken = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/verifyInvite?token=${token}`);

    if (!response.ok) {
      throw new Error('Invalid or expired token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying invite token:', error);
    throw error;
  }
};

// Register manager from token
export const registerManager = async ({ name, password, token }) => {
  try {
    const response = await fetch(`${BASE_URL}/registerManager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register manager');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering manager:', error);
    throw error;
  }
};
