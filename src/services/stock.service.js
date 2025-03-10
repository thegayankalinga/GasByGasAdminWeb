import axios from 'axios';
import authHeader from './auth/auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class StockService {
  addStock(data) {
    return axios.post(API_URL + '/stocks', data,{ headers: authHeader() });
  }

  getStock(outletId) {
    return axios.get(API_URL + '/stocks/by-outlet/'+outletId,{ headers: authHeader() });
  }
  getStock() {
    return axios.get(API_URL + '/stocks',{ headers: authHeader() });
  }
}

export default new StockService();