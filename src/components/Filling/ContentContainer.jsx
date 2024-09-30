// import TopNavigation from './TopNavigation';
import { BsPlusCircleFill } from 'react-icons/bs';
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getDataUseCase } from '../../application/useCases/user/MachineUseCases';
// import { useState } from 'react';
// import { getDataUseCase } from '../application/useCases/user/MachineUseCases';
import { getError } from '../../infrastructure/api/machineError';
import axios from 'axios'; // Axios for API requests
import { FaBusinessTime , FaPoo } from 'react-icons/fa';
import { IoTimerOutline } from 'react-icons/io5';
import { BarChart, ResponsiveContainer,XAxis,YAxis,Tooltip,Legend,Bar,CartesianGrid } from 'recharts';
// import paretoChartmachine from './paretoChart';
import ParetoChart from 'pareto-chart';

const excludedTags = [
  'AB_Network_02.Packing PB.Machine State Stopped',
  'AB_Network_02.Packing PB.Machine State Running',
  'AB_Network_02.Packing PB.Machine State Resetting',
  'AB_Network_02.Packing PB.Machine State Idle',
  'AB_Network_02.Packing PB.Machine State Clearing',
  'AB_Network_02.Packing PB.Machine State Aborted',
  'AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen'
];

const ContentContainer_Filling = ({ activeMenu  }) => {
    const [errors, setErrors] = useState([]);
    const [breakdownTime, setBreakdownTime] = useState('00:00:00');
    const [totalprod, setTotlProd] = useState('00:00:00');
    const [totalStopmMachince, setTotalstopMachine] = useState('00:00:00');
    const [errorHistory, setErrorHistory] = useState([]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (activeMenu === 'notifications') {
            getMachineErr(); // Only fetch data when the notifications table is visible

            const fetchData = async () => {
              const data = await getApiData_MTBF(); // Make sure to call your getApiData function
              // Assuming the calculated breakdown is returned in seconds
              const breakdownInSeconds = data.length > 0 ? data[0].breakdown : 0; // Adjust as needed
              const totalprodtime = data[0].totalprod;
              const totalstopmachine = data[0].totalstop;
              console.log('totalprodtime');
              console.log(totalprodtime);
              setBreakdownTime(formatTime(breakdownInSeconds));
              setTotlProd(formatTime(totalprodtime))
              setTotalstopMachine(formatTime(totalstopmachine))
            };
        
            fetchData();
        }
        else
        {
          axios.get('http://10.24.0.82:5001/api/errorhistory')
          .then(response => {
            setErrorHistory(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the data!', error);
          });
        }
    }, [activeMenu]); // Re-run the effect only when activeMenu changes

    const generateText = (entry) => {
      if (entry.Status === "BREAKDOWN-OCCURE") {
        return `Breakdown Occure - ${entry.Keterangan}`;
      } else if (entry.Status === "ACT") {
        return `Action By MTC Technician`;
      } else if (entry.Status === "DONE") {
        const details = JSON.parse(entry.Keterangan || '{}');
        return `Finish Breakdown - Action: Root Cause: ${details.rootcaused}, Countermeasure: ${details.countermeasure}, Improvement: ${details.improvement}`;
      }
      return '';
    };

    const getMachineErr = async () => {
      console.log('try get');
      try {
        // Fetch data from the OPC API
        const response = await axios.get('http://10.24.0.82:5001/api/Allerror/Filling PB');
        const errorAllData = response?.data || []; // Ensure the data is defined, fallback to an empty array
        console.log('errorAllData');
        console.log(errorAllData);

    
        setErrors(errorAllData); // Set the data directly, since it's already an array
      } catch (error) {
        console.log('Failed to load', error);
        setErrors([]); // Fallback to an empty array in case of API failure
      }
    };

    //API MTBF
    const getApiData_MTBF = async () => {
      const response = await fetch('http://10.24.0.82:5001/api/transitions');
      const data = await response.json();
    
      // Extract the breakdown for the specific Machine_Tag
      const specificMachineTag = 'AB_Network_02.Packing PB.Machine State Running';
      const specificBreakdown = data.find(item => item.Machine_Tag === specificMachineTag)?.AvgTimeDifferenceInSeconds;
      // console.log(specificBreakdown.TransitionCount);

      
      // console.log(data);
      // Filter for Machine_Tags with fault names and calculate total qty
      // const faultMachines = data.filter(item => item.Machine_Tag.includes('fault'));
      const faultMachines = data
      .filter(item => !excludedTags.includes(item.Machine_Tag))
      .map(item => item.TransitionCount);
      console.log(faultMachines);

      const totalStoptime = data
      .filter(item => !excludedTags.includes(item.Machine_Tag))
      .map(item => item.AvgTimeDifferenceInSeconds);
      
      console.log(totalStoptime);

      const stopmachine = totalStoptime.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      console.log('totalStoptime')
      console.log(stopmachine);

      // const totalQty = faultMachines.reduce((acc, item) => acc + item.TransitionCount, 0);
      const totalQty = faultMachines.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      console.log(totalQty);
      // Calculate the final breakdown if totalQty is not zero
      const calculatedBreakdown = totalQty > 0 ? Math.round(specificBreakdown / totalQty) : 0;
      console.log(calculatedBreakdown);
      // Prepare the result
      return data.map(item => {
        const name = item.Machine_Tag.split(".")[2];
        const qty = item.TransitionCount;
        return { name, qty, breakdown: calculatedBreakdown, totalprod:specificBreakdown, totalstop:stopmachine };
      });
    };
    
    
    
  return (
    <div className='content-container'>      

      {activeMenu === 'notifications' && <div className="table-container mx-auto px-2 overflow-auto">
        <h2 className={'menu-header'}>Realtime Performance Machine Filling Line B </h2>
        {/* <Divider /> */}
        
        < div className="flex gap-4 py-7 w-full">
          <BoxWrapper>
          <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
            <IoTimerOutline className="text-2xl text-white"/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>MTBF</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>{breakdownTime}</strong>

            </div>
          </div>
          </BoxWrapper>

          <BoxWrapper>
          <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
            <IoTimerOutline className="text-2xl text-white"/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>MTTR</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>0:00:00</strong>

            </div>
          </div>
          </BoxWrapper>

          <BoxWrapper>
          <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
            <IoTimerOutline className="text-2xl text-white"/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Stop Time</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>{totalStopmMachince}</strong>

            </div>
          </div>
          </BoxWrapper>

          <BoxWrapper>
          <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
            <IoTimerOutline className="text-2xl text-white"/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Prod Time</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>{totalprod}</strong>

            </div>
          </div>
          </BoxWrapper>
          
          {/* <div className='bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center shadow-sm'>a</div> */}
          {/* <div className='bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center shadow-sm'>a</div> */}
          {/* <div className='bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center shadow-sm'>a</div> */}
        </div>

        {/* <div className="">
          <div className="flex items-center justify-between p-2 text-sm">
            <span>Showing 1-10 of {errors.length} errors</span>
            <div className="flex">
              <button className="text-gray-400 hover:text-gray-600">Previous</button>
              <button className="text-gray-400 hover:text-gray-600">Next</button>
            </div>
          </div>
        </div> */}
      <table className="table-list">
      <thead className="table-header">
        <tr>
          <th className="table-row-data">No</th>
          <th className="table-row-data">Machine Tag</th>
          <th className="table-row-data">Tag Description</th>
          <th className="table-row-data">Value</th>
          <th className="table-row-data">Timestamp</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <tr className="bg-gray-200" key={index}>
              <td className="table-row-data">{index + 1}</td>
              <td className="table-row-data">{error.Machine_Tag}</td>
              <td className="table-row-data">
                {error.Machine_Tag.split('.').pop()}  {/* If using '/' as a delimiter */}
                {/* Or if the delimiter is something else, replace '/' with that delimiter */}
              </td>
              <td className="table-row-data">
              <span className={`table-row-data ${error.Value === 'true' ? 'table-row-data-value-true' : error.Value === 'false' ? 'table-row-data-value-false' : ''}`}>
                {error.Value}
              </span>
              </td>
              <td className="table-row-data">{new Date(error.Timestamp).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No errors found</td>
          </tr>
        )}
      </tbody>
      </table>
        <h2 className={'menu-header'}></h2>
        </div>}
      
      {/* <BottomBar /> */}
    </div>
  );
};



const Post = ({ name, timestamp, text }) => {

  const seed = Math.round(Math.random() * 100);
  return (
    <div className={'post'}>
      <div className='avatar-wrapper'>
        <img src={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`} alt='' className='avatar' />
      </div>

      <div className='post-content'>
        <p className='post-owner'>
          {name}
          <small className='timestamp'>{timestamp}</small>
        </p>
        <p className='post-text'>{text}</p>
      </div>
    </div>
  );
};



export default ContentContainer_Filling;

function BoxWrapper({ children }) {
  return <div className="bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center">{children}</div>;
}
