export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token ,'Content-Type': 'application/json'};
        //return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
}