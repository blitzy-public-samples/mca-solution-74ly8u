import axios from 'axios';
import { settings } from 'app.core.config';

const authApi = axios.create({ baseURL: settings.AUTH_API_BASE_URL });

export async function login(username: string, password: string): Promise<string> {
  try {
    const response = await authApi.post('/login', { username, password });
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem('authToken');
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await authApi.get('/users/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
}

// HUMAN ASSISTANCE NEEDED
// This function has a lower confidence level and may need review
export async function updateUser(userData: object): Promise<User> {
  try {
    const response = await authApi.put('/users/me', userData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

// Type definition for User (not provided in the original spec, but needed for TypeScript)
interface User {
  // Add user properties here
  id: string;
  username: string;
  email: string;
  // Add any other relevant user properties
}