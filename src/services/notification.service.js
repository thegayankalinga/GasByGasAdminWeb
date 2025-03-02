import axios from 'axios';
import authHeader from './auth/auth-header';

const API_URL = import.meta.env.VITE_API_BASE_URL;

class NotificationService {

  sendEmail(toEmail, toName, subject, body) {
    return axios.post(API_URL + 'notify/email/', {
      toEmail, toName, subject, body
    });
  }

  sendSms(recepient, message) {
    return axios.post(API_URL + 'notify/sms/', {
      recepient, message
    });
  }
}

export default new NotificationService();