import axios from "axios";
//https://lmu-backend-service-usr-gvhgbybtezdxdfdk.southeastasia-01.azurewebsites.net/api/
const API_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "account/login", {
        email,
        password
      })
      .then(response => {
        if (response.status == 200 && response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          return response.data;
        }
        else {
          console.log('something missing');
        }
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return true;
  }

  register(email, password, fullName, nic, phoneNumber, address, city, businessRegistration, userType, noOfCylindersAllowed) {
    return axios.post(API_URL + "account/register", {
      email,
      password,
      fullName,
      nic,
      phoneNumber,
      address,
      city,
      businessRegistration,
      userType,
      noOfCylindersAllowed
    }).then(response => {
      if (response.status == 200 && response.data) {
        return response.data;
      }
      else {
        console.log('something missing');
      }
    });
  }
}

export default new AuthService();