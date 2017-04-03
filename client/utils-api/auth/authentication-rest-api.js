import axios from 'axios';

export function signUpRequest(userData) {
    return axios.post('/user/signup', userData);
}

export function completedSignUpRequest(userData) {
    return axios.post('/user/signup/completed', userData);
}

export function loginRequest(userData) {
    return axios.post('/user/login', userData);
}