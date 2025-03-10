import axios from 'axios';
import authHeader from './auth/auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class DeliveryService {
  addDelivery(data) {
    return axios.post(API_URL + '/delivery', data,{ headers: authHeader() });
  }

  getDelivery(deliveryId) {
    return axios.get(API_URL + '/delivery/'+deliveryId,{ headers: authHeader() });
  }
  getDelivery() {
    return axios.get(API_URL + '/delivery',{ headers: authHeader() });
  }
}

export default new DeliveryService();