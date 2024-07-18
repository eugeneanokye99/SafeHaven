//const API_URL = 'http://10.0.2.2:3000';
const API_URL = 'http://192.168.0.101:3000';
//const API_URL = 'http://172.20.10.2:3000';

export interface AuthResponse {
  userId: string;
  user_id: string,
  _id:string;
  query: string;
  currentUserId: string;
  to: string;
  from: string;
  text: string;
  otherUserId: string;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    password: String;
    dob: string;
    address: string;
    phone: string;
    profileImage: string;
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

export const registerUser = async (name: string, email: string, password: string, address: string, dob: string, phone: string, profileImage: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, address, dob, phone, profileImage }),
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



export const loginUser = async (email: string, password: string, latitude: string, longitude: string ): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, latitude, longitude  }),
    });

    const data = await handleResponse(response);

    if (response.status === 400 && data.message === 'Invalid Credentials') {
      return null; 
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error.message);
    console.error('Error details:', error);
    throw new Error(error.message);
  }
};



export const sendMessageToBot = async (userId: string, message: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message }),
    });

    const data = await handleResponse(response);


    if (response.status === 400 && data.message === 'Server error') {
      return null; 
    }
    
    return data;
  } catch (error: any) {
    console.error('Error sending message to bot:', error.message);
    console.error('Error details:', error);
    throw new Error(error.message);
  }
};


export const fetchUserById = async (userId: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/user?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Fetch error: ', error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/search?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Search error: ', error);
    throw error;
  }
};


export const fetchMessages = async (currentUserId: string, otherUserId: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/messages?user1=${currentUserId}&user2=${otherUserId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchBotMessages = async (userId: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/botmessages?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (from: string, to: string, text: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, text }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchChats = async (userId: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/list?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const chats = await response.json();
    return chats;
  } catch (error) {
    console.error('Fetch error: ', error);
    throw error;
  }
};


export const LinkUser = async (user_id: string, userId: string): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, userId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};