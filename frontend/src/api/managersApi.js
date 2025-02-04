// Get managers from the backend
export const getManagers = async () => {
    const response = await fetch('http://localhost:8080/api/management');
    if (!response.ok) {
      throw new Error('Failed to fetch managers');
    }
    return response.json();
  };