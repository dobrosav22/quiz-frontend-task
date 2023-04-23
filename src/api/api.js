import axios from 'axios';

/**The '/api' is a placeholder to be replaced with the 
 * actuall endpoint once it is available.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;