const API_URL = 'http://10.0.2.2:3000/api/auth';
//const API_URL = 'http://localhost:3000/api/auth';

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const handleResponse = async (response: Response): Promise<AuthResponse> => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  } else {
    const text = await response.text();
    throw new Error(`Unexpected response format: ${text}`);
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await handleResponse(response);

    // Check if the response indicates that the user already exists
    if (response.status === 400 && data.message === 'User already exists') {
      return null; // Return null to indicate that the user already exists
    }

    return data;
  } catch (error: any) {
    console.error('Register error:', error.message);
    console.error('Error details:', error);
    throw new Error(error.message);
  }
};



export const loginUser = async (email: string, password: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Check if the response indicates invalid credentials
    if (response.status === 400 && data.message === 'Invalid Credentials') {
      return null; // Return null to indicate invalid credentials
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error.message);
    console.error('Error details:', error);
    throw new Error(error.message);
  }
};
