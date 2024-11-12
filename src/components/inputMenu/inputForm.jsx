import { FaBusinessTime, FaPoo } from 'react-icons/fa';
import { IoTimerOutline } from 'react-icons/io5';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for API requests
// import Popup from './PopUp';
import Popup from '../PopUp';
import EmployeeForm from '../actionForm';

const InputForm = ({ activeMenu }) => {
  const [errorHistory, seterrorHistory] = useState({ Status: '', Keterangan: '' });
  const [errors, setErrors] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getMachineErr();
  }, [activeMenu]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!token || Date.now() > tokenExpiration) {
        // Redirect to login if token does not exist or has expired
        navigate('/');
    }
}, [navigate]);

//   useEffect(() => {
//     const fetchErrormachine = async () => {
//         try {
//             const fetchedUser = await updateHistoryApi(id);
//             seterrorHistory(fetchedUser);
//         } catch (error) {
//           console.log(error);
//             // setErrorMessage('Failed to fetch user data.');
//         }
//     };
//     fetchErrormachine();
// }, [id]);

  const getMachineErr = async () => {
    console.log('try get');
    try {
      const response = await axios.get('http://10.24.0.82:5001/api/error');
      // const response = await hystory;
      const errorAllData = response.data;
      console.log(errorAllData);
      // Filter out unwanted Machine_Tag values
    const filteredErrors = errorAllData.filter(
      item =>
        item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Running' &&
        item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Stopped' &&
        item.Machine_Tag !== 'AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen' &&
        item.Machine_Tag !== 'AB_Network_02.Packing PB.bFL_AirPressureLow' &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine Mode Operator" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine Mode Program" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Aborted" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Aborting" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Clearing" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Idle" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Resetting" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Running" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Starting" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Stopped" &&
        item.Machine_Tag !== "AB_Network_02.Packing PB.Machine State Stopping"
    );
      setErrors(filteredErrors);
    } catch (error) {
      console.log('Failed to load', error);
      setErrors([]);
    }
  };

  const handleActionClick = async (error) => {
    setSelectedError(error); // Set the selected error
    setOpenPopup(true); // Open the popup
    
    
    console.log(error.Machine_Tag);
    const { id } = error.Machine_Tag; // Assuming 'error' contains an 'id'
    // Update the status of the error history
    console.log(id);
    seterrorHistory({ ...errorHistory, Status: 'ACT' });
  
    try {
      // Prepare the error data for the API call
      const errorData = { ...errorHistory, Status: 'ACT' }; // Include the updated status
  
      // Make the API call to update the error history
      const response = await axios.put(`http://10.24.0.82:5001/api/error/${error.Machine_Tag}`, errorData);
      console.log(response);
      // Check if the response is successful
      if (response.status === 200) {
        console.log('sukses');
        // Optionally set a success message or perform further actions
        // setSuccessMessage('User updated successfully!'); // Example
      }
    } catch (error) {
      // Handle errors
      console.log('Error updating error history:', error);
    } 
  };
  

  const [formData, setFormData] = useState({
    rootcaused: '',
    countermeasure: '',
    improvement: '',
  });
//   const [openPopup, setOpenPopup] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log('Form Data:', formData);
    
    // Extract Machine_Tag from selectedError
    const machineTag = selectedError ? selectedError.Machine_Tag : '';
    console.log('Machine Tag:', machineTag);
    
    // Convert form data to JSON
    const dataKeterangan = JSON.stringify(formData);
    console.log('Data Keterangan:', dataKeterangan);
    
    // Update error history
    const updatedErrorHistory = { ...errorHistory, Keterangan: dataKeterangan }; // Set Keterangan from dataKeterangan
    
    try {
      // Prepare the error data for the API call
      const errorData = { ...updatedErrorHistory, Status: 'DONE' }; // Updated status
      
      // Make the API call to update the error history
      const response = await axios.put(`http://10.24.0.82:5001/api/error/${machineTag}`, errorData);
      console.log(response);
      
      // Check if the response is successful
      if (response.status === 200) {
        console.log('Update successful');
        // Optionally set a success message or perform further actions
        // setSuccessMessage('User updated successfully!'); // Example
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating error history:', error.message);
    }
  };
  

  return (
    <div className='content-container'>
      <Popup 
      openPopup={openPopup} 
      setOpenPopup={setOpenPopup}
      title={selectedError ? selectedError.Machine_Tag.split('.').pop() : ''} 
      onSubmit={handleSubmit} // Pass the submission logic
      >
        {/* <div>Your popup content goes here.</div> */}
        <EmployeeForm handleInputChange={handleInputChange} formData={formData} />
      </Popup>

      <div className="table-container mx-auto px-2 overflow-auto hidden md:block">
        <h2 className={'menu-header'}>Outstanding Machine Problem</h2>

        <table className='table-list'>
          <thead className='table-header'>
            <tr>
              <th className='table-row-data'>No</th>
              <th className='table-row-data'>Machine Tag</th>
              <th className='table-row-data'>Machine</th>
              <th className='table-row-data'>Value</th>
              <th className='table-row-data'>Timestamp</th>
              <th className='table-row-data'>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {errors.length > 0 ? (
              errors.map((error, index) => (
                <tr className="bg-gray-200" key={index}>
                  <td className='table-row-data'>{index + 1}</td>
                  <td className='table-row-data'>{error.Machine_Tag.split('.').pop() || error.Machine_Tag}</td>
                  <td className='table-row-data'>{error.Machine_Tag.split('.')[1] || ''}</td>
                  <td className='table-row-data'>
                    <span
                      className={`table-row-data ${
                        typeof error.Value === 'boolean'
                          ? error.Value
                            ? 'table-row-data-value-true'
                            : 'table-row-data-value-false'
                          : ''
                      }`}
                    >
                      {typeof error.Value === 'boolean' ? (error.Value ? 'True' : 'False') : error.Value}
                    </span>
                  </td>
                  <td className='table-row-data'>
                    {error.Timestamp.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td className='table-row-data' style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                      className='button-sm button-outline-primary'
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleActionClick(error)}
                    >
                      <FaBusinessTime size={16} /> &nbsp;
                      <small> Action </small>
                    </button>
                    <button className='button-sm button-outline-danger' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IoTimerOutline size={16} /> &nbsp;
                      <small> Ignore </small>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No errors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3 py-3 grid grid-clos-1 gap-4 md:hidden">
      {errors.length > 0 ? (
              errors.map((error, index) => (
                <div className='bg-white p-4 rounded-lg shadow-sm' key={index}>
                  <div className='flex items-center space-x-2 text-sm'>
                    <a className='text-blue-700 font-bold'>#{index + 1}</a>
                    <a className='text-gray-500 '>{error.Timestamp.replace('T', ' ').replace('Z', '')}</a>
                    <a className='text-gray-500 font-bold px-1'>{error.Machine_Tag.split('.')[1] || ''}</a>
                    
                  </div>
                  <div>
                    <div className='text-base text-red-500 font-bold'>{error.Machine_Tag.split('.').pop() || error.Machine_Tag}</div>  
                    <div className='flex justify-end'>
                      <button 
                      className='bg-red-700 px-3 py-2 rounded-2xl text-white text-sm' 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleActionClick(error)}
                      >
                      <FaBusinessTime size={16} /> &nbsp;   
                      Action 
                      </button>  
                    </div>
                  </div>
                </div>

               
              ))
            ) : (
              <tr>
                <td colSpan="4">No errors found</td>
              </tr>
            )}
            
      </div>


      <div className='py-2'></div>
    </div>
  );
};

export default InputForm;
