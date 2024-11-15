// import TopNavigation from './TopNavigation';
import { BsPlusCircleFill } from 'react-icons/bs';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for API requests
import { IoTimerOutline } from 'react-icons/io5';
// import paretoChartmachine from './paretoChart';
import ParetoChart from './paretoChart';
import { Datepicker } from "flowbite-react";
import ParetoChartQTY from './paretoChartQTY';

const excludedTags = [
  'AB_Network_02.Packing PB.Machine State Stopped',
  'AB_Network_02.Packing PB.Machine State Running',
  'AB_Network_02.Packing PB.Machine State Resetting',
  'AB_Network_02.Packing PB.Machine State Idle',
  'AB_Network_02.Packing PB.Machine State Clearing',
  'AB_Network_02.Packing PB.Machine State Aborted',
  'AB_Network_02.Packing PB.Machine State Aborting',
  'AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen',
  'AB_Network_02.Packing PB.bFL_DoorSwitch_IsOpen',
  'AB_Network_02.Packing PB.Machine State Clearing',
  'AB_Network_02.Packing PB.bFL_AuxMCB_IsOpen',
  'AB_Network_02.Packing PB.bFL_AirPressureLow'
  
];

const ContentContainer = ({ activeMenu  }) => {
    const [errors, setErrors] = useState([]);
    const [activeItem,setActiveItem] = useState('default');
    const [breakdownTime, setBreakdownTime] = useState('00:00:00');
    const [totalprod, setTotlProd] = useState('00:00:00');
    const [mttr, setMTTR] = useState('00:00:00');
    const [totalStopmMachince, setTotalstopMachine] = useState('00:00:00');
    const [errorHistory, setErrorHistory] = useState([]);
    
    const handleRealtimeClick = () => {
      setActiveItem('default');
    };

    const handleHystoricalClick = () => {
      setActiveItem('hystorical');
    }

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
      if (activeMenu === 'notifications') {
          getMachineErr(); // Only fetch data when the notifications table is visible
          getHytorical();
          
      }
      else
      {
        const fetchData = async () => {
          const data = await getApiData_MTBF(); // Make sure to call your getApiData function
          // Assuming the calculated breakdown is returned in seconds
          const breakdownInSeconds = data.length > 0 ? data[0].breakdown : 0; // Adjust as needed
          const totalprodtime = data[0].totalprod;
          const totalstopmachine = data[0].totalstop;
          const totalmttr = data[0].mttr;
          console.log('totalprodtime');
          console.log(totalprodtime);
          setBreakdownTime(formatTime(breakdownInSeconds));
          setTotlProd(formatTime(totalprodtime))
          setMTTR(formatTime(totalmttr))
          setTotalstopMachine(formatTime(totalstopmachine))
        };
    
        fetchData();

        
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

    const getHytorical = async () => {
      try {
        // Fetch data from the OPC API
        const response = await axios.get('http://10.24.0.82:5001/api/geterrorAll/Packing%20PB');
        const errorAllData = response?.data || []; // Ensure the data is defined, fallback to an empty array
        console.log('errorHistory');
        console.log(errorAllData);
    
        setErrorHistory(errorAllData); // Set the data directly, since it's already an array

      } catch (error) {
        console.log('Failed to load', error);
        setErrorHistory([]); // Fallback to an empty array in case of API failure
      }
    }

    const getMachineErr = async () => {
      console.log('try get');
      try {
        // Fetch data from the OPC API
        const response = await axios.get('http://10.24.0.82:5001/api/realtime-latest-error');
    
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
      const response = await fetch('http://10.24.0.82:5001/api/transition');
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
      const calmttr = Math.round(stopmachine/totalQty);
      console.log(calculatedBreakdown);
      // Prepare the result
      return data.map(item => {
        const name = item.Machine_Tag.split(".")[2];
        const qty = item.TransitionCount;
        return { name, qty,mttr:calmttr, breakdown: calculatedBreakdown, totalprod:specificBreakdown, totalstop:stopmachine };
      });
    };
    
    
    
  return (
    <div className='content-container'>      
    {activeMenu === 'default' && <div className='content-list'>
        {/* <ParetoDiagram/> */}
        <div className='py-2'></div>
        <h2 className={'menu-header'}>Packing PB Machine Peformance</h2>
        < div className="flex px-20 gap-4 py-4 w-full items-center justify-center">
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
              <strong className='text-xl text-gray-700 font-semibold'>{mttr}</strong>

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
          
          </div>
        {/* <ParetoChart/>  */}

        <div className='px-5 py-2'>
        <ParetoChart/> 
          {/* excludedTags={excludedTags} */}
          {/* />  */}
        </div>
        
        <div className='px-5 py-3'>
          <ParetoChartQTY
          // excludedTags={excludedTags}
          /> 
        </div>
        
        
        

        
      </div>}

      {activeMenu === 'notifications' && <div className="table-container mx-auto px-2 overflow-auto">
        <h2 className={'menu-header'}>Realtime Performance Machine Packing B </h2>
        {/* <Divider /> */}
        <div className='py-2'></div>

        <div className='flex'>
          <button 
            className={`text-blue-500 ${activeItem === 'default' ? 'underline' : ''}`} 
            onClick={handleRealtimeClick}
          >
            Realtime
          </button>
          <span className='text-red-400'>|</span>
          <button 
            className={`text-blue-500 ${activeItem === 'hystorical' ? 'underline' : ''}`} 
            onClick={handleHystoricalClick}
          >
            Hystorical
          </button>
        </div>

        {activeItem==='default' &&   
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
        }

        {activeItem ==='hystorical' && 
        <table className="table-list">
        <thead className="table-header">
          <tr>
            <th className="table-row-data">No</th>
            <th className="table-row-data">Machine Tag</th>
            <th className="table-row-data">Breakdown</th>
            <th className="table-row-data">Action</th>
            <th className="table-row-data">Finish</th>
            <th className="table-row-data">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {errorHistory.length > 0 ? (
            errorHistory.map((errorHistory, index) => (
              <tr className="bg-gray-200" key={index}>
                <td className="table-row-data">{index + 1}</td>
                <td className="table-row-data">
                  {errorHistory.Machine_Tag.split('.').pop()}
                  {/* {errorHistory.Machine_Tag} */}
                </td>
                <td className="table-row-data">
                  {errorHistory.Breakdown
                  ? errorHistory.Breakdown.replace('T', ' ').replace('Z', '')
                  : ''}
                </td>
                <td className="table-row-data">
                  {errorHistory.Action
                  ? errorHistory.Action.replace('T', ' ').replace('Z', '')
                  : ''}
                </td>
                <td className="table-row-data">
                  {errorHistory.FinishAction
                  ? errorHistory.FinishAction.replace('T', ' ').replace('Z', '')
                  : ''}
                </td>
                <td className="table-row-data">
                  {(() => {
                    try {
                      // Coba parse string sebagai JSON
                      const keterangan = JSON.parse(errorHistory.Keterangan);
                      // Jika parsing berhasil, tampilkan dalam format terpisah
                      return (
                        <>
                          rootcaused = "{keterangan.rootcaused}" <br />
                          countermeasure = "{keterangan.countermeasure}" <br />
                          improvement = "{keterangan.improvement}"
                        </>
                      );
                    } catch (e) {
                      // Jika parsing gagal (bukan JSON), tampilkan apa adanya
                      return errorHistory.Keterangan;
                    }
                  })()}
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No errors found</td>
            </tr>
          )}
        </tbody>
        </table>
        }
        <h2 className={'menu-header'}></h2>
      
      </div>
      }
      
      {/* <BottomBar /> */}
    </div>
  );
};

const Divider = () => <hr className="sidebar-header" />;

const BottomBar = () => (
  <div className='bottom-bar'>
    <PlusIcon />
    <input type='text' placeholder='Enter message...' className='bottom-bar-input' />
  </div>
);

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

const PlusIcon = () => (
  <BsPlusCircleFill
    size='22'
    className='text-green-500 dark:shadow-lg mx-2 dark:text-primary'
  />
);

export default ContentContainer;

function BoxWrapper({ children }) {
  return <div className="bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center">{children}</div>;
}
