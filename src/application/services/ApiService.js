// src/application/services/ApiService.js
// import { addUserApi, updateUserApi, getUserApi, getUsers,deleteUser } from '../../infrastructure/api/UserApi';

import { getError } from '../../infrastructure/api/machineError';

//----------------------------------------------------------------machine

export const getDataError = async () => {
    const response = await getError();
    console.log('apiservice');
    console.log(response);
    return response.data; // Sesuaikan dengan data dari backend
}

//----------------------------------------------------------------machine

//------------------------users------------------------
