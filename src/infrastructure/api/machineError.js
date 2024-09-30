// src/infrastructure/api/UserApi.js
import axios from 'axios';

const API_URL = 'http://10.24.0.82:5001/api/realtime-latest-error';
const API_MSSQL_HYSTORY = 'http://10.24.0.82:5001/api/error'; //ga digunakan

// export const addUserApi = async (user) => {
//     return await axios.post(API_URL, user);
// };

// export const updateUserApi = async (id, user) => {
//     return await axios.patch(`${API_URL}/${id}`, user);
// };

// export const getUserApi = async (id) => {
//     return await axios.get(`${API_URL}/${id}`);
// };

export const getError = async () => {
    return await axios.get(API_URL);    
};

export const hystory = async () => {
    return await axios.get(API_MSSQL_HYSTORY);    
};

export const updateHistoryApi = async (id, data) => {
    return await axios.patch(`${API_MSSQL_HYSTORY}/${id}`, data);
};

// export const deleteUser = async (id) => {  
//     return await axios.delete(`${API_URL}/${id}`);   
// };
