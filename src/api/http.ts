import axios from 'axios';

// La app comparte esta única instancia; los componentes no importan Axios.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
