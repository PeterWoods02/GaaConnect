const BASE_URL = 'http://localhost:8080/api/message';

const handleError = (action, error, response = null) => {
  const errorMessage = response ? `${response.statusText}: ${response.status}` : error.message;
  console.error(`error ${action}: ${errorMessage}`);
  throw new Error(`error ${action}: ${errorMessage}`);
};

// get all messages for the logged in user
export const getMessages = async (token) => {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      handleError('getting messages', 'failed to get messages');
    }

    return await response.json();
  } catch (error) {
    handleError('getting messages', error);
  }
};

// get all messages between logged-in user and another user
export const getConversationWithUser = async (otherUserId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/conversation/${otherUserId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
  
      if (!response.ok) {
        handleError('getting conversation', 'failed to get conversation');
      }
  
      return await response.json();
    } catch (error) {
      handleError('getting conversation', error);
    }
  };
  

// send a new message
export const sendMessage = async (messageData, token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorRes = await response.json();
      handleError('sending message', new Error('failed to send message'), errorRes);
    }

    return await response.json();
  } catch (error) {
    handleError('sending message', error);
  }
};

// get a single message by id
export const getMessageById = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      handleError('getting message by id', 'failed to fetch message');
    }

    return await response.json();
  } catch (error) {
    handleError('getting message by id', error);
  }
};
