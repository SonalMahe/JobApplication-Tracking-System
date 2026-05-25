import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Attach Auth0 token to every request
export const setAuthToken = (token: string) => {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default API
