import axios from 'axios';
import authHeader from './auth/auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class OutletService {
  getAllOutlet() {
    return axios
    .get(API_URL + "outlet", { headers: authHeader() })
    .then(response => {
      if (response.status == 200) {
        return response.data;
      }
      else {
        console.log('something missing');
      }
    });
  }
}

export default new OutletService();