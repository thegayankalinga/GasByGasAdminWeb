import axios from 'axios';
import authHeader from './auth/auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class UserService {

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  getConsumers() {
    return axios.get(API_URL + '/account/getConsumers', { headers: authHeader() });
  }

  updateCylindersAllowed(email, data) {
    return axios.put(API_URL + '/account/updateAllowedCylinders/'+email, data, { headers: authHeader() });
  }

  updateIsConfirm(email, data) {
    return axios.put(API_URL + '/account/updateConfirmStatus/'+email, data, { headers: authHeader() });
  }

  updateRemainingCylinders(email, data) {
    return axios.put(API_URL + '/account/updateReminaingCylinders/'+email, data, { headers: authHeader() });
  }
}

export default new UserService();