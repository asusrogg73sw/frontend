import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://pro-backend-production-72bc.up.railway.app/api',
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default API;