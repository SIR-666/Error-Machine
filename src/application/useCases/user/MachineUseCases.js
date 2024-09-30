// src/application/useCases/user/UserUseCases.js
import machineError from '../../../domain/models/errorMachine';
import { getDataError } from '../../services/ApiService';



export const getDataUseCase = async () =>  {
    const users = await getDataError();
    console.log('usecases');
    console.log(users);
    return users;
}

// export const getDataUseCase = async () => {
//     try {
//         const response = await getDataError(); // Assume this fetches the JSON data
//         const { data } = response; // Extract the data from the response

//         // Filter out items where value is false
//         const filteredData = data.filter(item => item.value !== false);
//         console.log(filteredData);
//         return filteredData;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         // Handle the error as appropriate
//         return null; // or throw the error if you want to propagate it
//     }
// }

