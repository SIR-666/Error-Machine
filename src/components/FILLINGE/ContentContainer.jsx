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
import { IoTimerOutline,IoArrowBackCircle,IoArrowForwardCircle   } from 'react-icons/io5';
import { BarChart, ResponsiveContainer,XAxis,YAxis,Tooltip,Legend,Bar,CartesianGrid } from 'recharts';
// import paretoChartmachine from './paretoChart';
import ParetoDiagram from './paretoChart';
import Select from 'react-select'
import ParetoDiagramQTY from './paretoChartqty';
import DatePicker from "react-datepicker";


// const options = [
//   { value: 'AB_Network_04.Packing WP25 C.Tag1', label: 'Tag1' },
//   { value: 'AB_Network_04.Packing WP25 C.Tag2', label: 'Tag2' },
//   { value: 'AB_Network_04.Packing WP25 C.Tag3', label: 'Tag3' },
// ];

const excludedTags_All = [
  'AB_Network_04.Packing WP25 E.Machine_Run',
  'AB_Network_04.Packing WP25 E.Machine_Alarm',
  'AB_Network_04.Packing WP25 E.Cardboard Shortage',
  'AB_Network_04.Packing WP25 E.Panel Emergency Stop',
  'AB_Network_04.Packing WP25 E.Machine_Stop',
  'AB_Network_04.Packing WP25 E.Bottle Tipping',
  'AB_Network_04.Packing WP25 E.Machine_Ready',
  'AB_Network_04.Packing WP25 E.Machine_Pause',
  'AB_Network_04.Packing WP25 E.Glue_Ready'
];

const options = [
  { value: "AB_Network_04.Packing WP25 E.Bottle Tipping", label: "Bottle Tipping" },
  { value:"AB_Network_04.Packing WP25 E.Cardboard Shortage",label: "Cardboard Shortage"},
  { value: "AB_Network_04.Packing WP25 E.External Emergency Stop", label: "External Emergency Stop" },
  { value: "AB_Network_04.Packing WP25 E.Front Glue Spray Not Turn On", label: "Front Glue Spray Not Turn On" },
  { value: "AB_Network_04.Packing WP25 E.Full Bottle", label: "Full Bottle" },
  { value: "AB_Network_04.Packing WP25 E.Glue_Ready", label: "Glue_Ready" },
  { value: "AB_Network_04.Packing WP25 E.Infeed_Counter", label: "Infeed_Counter" },
  { value: "AB_Network_04.Packing WP25 E.Inverter Fault", label: "Inverter Fault" },
  { value: "AB_Network_04.Packing WP25 E.Lower Safety Door Detection", label: "Lower Safety Door Detection" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Alarm", label: "Machine_Alarm" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Pause", label: "Machine_Pause" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Ready", label: "Machine_Ready" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Run", label: "Machine_Run" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Speed", label: "Machine_Speed" },
  { value: "AB_Network_04.Packing WP25 E.Machine_Stop", label: "Machine_Stop" },
  { value: "AB_Network_04.Packing WP25 E.Motor Fault", label: "Motor Fault" },
  { value: "AB_Network_04.Packing WP25 E.Out of Box Blocked", label: "Out of Box Blocked" },
  { value: "AB_Network_04.Packing WP25 E.Outfeed_Counter", label: "Outfeed_Counter" },
  { value: "AB_Network_04.Packing WP25 E.Panel Emergency Stop",label:'Panel Emergency Stop'},
  { value: "AB_Network_04.Packing WP25 E.Running_Hour",label:'Running_Hour'},
  { value: "AB_Network_04.Packing WP25 E.Safety Door Inspection",label:'Safety Door Inspection'},
  { value: "AB_Network_04.Packing WP25 E.Side Glue Not Turned On During Startup",label:'Side Glue Not Turned On During Startup'},
]

const ContentContainer_FILLE = ({ activeMenu  }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [errors, setErrors] = useState([]);
    const [activeItem,setActiveItem] = useState('default');
    const [breakdownTime, setBreakdownTime] = useState('00:00:00');
    const [breakdownTimeAll, setBreakdownTimeAll] = useState('00:00:00');
    const [totalprod, setTotlProd] = useState('00:00:00');
    const [mttr, setMTTR] = useState('00:00:00');
    const [totalStopmMachince, setTotalstopMachine] = useState('00:00:00');
    const [errorHistory, setErrorHistory] = useState([]);
    const [excludedTags, setExcludedTags] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    

    const handleChange = (selectedOptions) => {
      // Get the selected values (tags to exclude)
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setExcludedTags(selectedValues);

      

    };

    // Update month when user clicks Next or Back
    const handleNextMonth = () => {
      setMonth(prevMonth => (prevMonth % 12) + 1); // Cycle to next month
    };

    const handlePreviousMonth = () => { 
      setMonth(prevMonth => (prevMonth === 1 ? 12 : prevMonth - 1)); // Cycle to previous month
    };

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
      const fetchData = async () => {
          if (activeMenu === 'notifications') {
              await getMachineErr(); // Fetch data when the notifications table is visible
              await getHytorical();
          } else {
              // Call your getApiData function
              const data2 = await getApiData_MTBF_All(excludedTags_All); 
              console.log('data2 ---------------------------------------------------------------');
              console.log(data2);
              const data = await getApiData_MTBF(excludedTags);
              // console.log(data);
  
              const breakdownInSeconds = data.length > 0 ? data[0].breakdown : 0; // Adjust as needed
              const breakdownInSeconds2 = data2.length > 0 ? data2[0].breakdown : 0; // Adjust as needed
              const totalprodtime = data[0]?.totalprod || 0;
              const totalstopmachine = data2[0]?.totalstop || 0;
              const totalmttr = data2[0]?.mttr || 0;
  
              // console.log('Total Production Time:', totalprodtime);
              setBreakdownTimeAll(formatTime(breakdownInSeconds2));
              setBreakdownTime(formatTime(breakdownInSeconds));
              setTotlProd(formatTime(totalprodtime));
              setMTTR(formatTime(totalmttr));
              setTotalstopMachine(formatTime(totalstopmachine));
              console.log('Selection:', data);
          }
      };
  
      fetchData();
  }, [activeMenu, excludedTags,month]); // Combine dependencies into a single array
  // Re-run the effect only when activeMenu changes

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
        const response = await axios.get('http://10.24.0.82:5001/api/geterrorAll/Filling%20PE');
        const errorAllData = response?.data || []; // Ensure the data is defined, fallback to an empty array
        console.log('errorHistory');
        console.log(errorAllData);
    
        setErrorHistory(errorAllData); // Set the data directly, since it's already an array

      } catch (error) {
        console.log('Failed to load', error);
        setErrorHistory([]); // Fallback to an empty array in case of API failure
      }
    }
    
    const formatDateTime = (dateTimeString) => {
      return dateTimeString.replace("T", " ").replace("Z", "");
    };

    const getMachineErr = async () => {
      console.log('try get');
      try {
        // Fetch data from the OPC API
        const response = await axios.get('http://10.24.0.82:5001/api/Allerror/Filling%20PE');
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
    const getApiData_MTBF_All = async (excludedTags_All = []) => {
      const response = await fetch(`http://10.24.0.82:5001/api/transitionsAll/Filling%20PE/${month}`);
      const data = await response.json();
    
      // Extract the breakdown for the specific Machine_Tag
      const specificMachineTag = 'AB_Network_04.Filling PE.STS_Plms_Production';
      const specificBreakdown = data.find(item => item.Machine_Tag === specificMachineTag)?.AvgTimeDifferenceInSeconds;
      console.log(specificBreakdown);

      const specificMachineTag2 = 'AB_Network_04.Filling PE.TProductionInterrupted';
      const Interupt = data.find(item => item.Machine_Tag === specificMachineTag2)?.AvgTimeDifferenceInSeconds;
      console.log(Interupt);


      
      // console.log(data);
      // Filter for Machine_Tags with fault names and calculate total qty
      // const faultMachines = data.filter(item => item.Machine_Tag.includes('fault'));
      const faultMachines = data
      .filter(item => !excludedTags_All.includes(item.Machine_Tag))
      .map(item => item.TransitionCount);
      console.log('falut machine:',faultMachines);

      const totalStoptime = data
      .filter(item => !excludedTags_All.includes(item.Machine_Tag))
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
      const calmttr = Math.round(Interupt/totalQty);
      // Prepare the result
      return data.map(item => {
        const name = item.Machine_Tag.split(".")[2];
        const qty = item.TransitionCount;
        return { name, qty,mttr:calmttr, breakdown: calculatedBreakdown, totalprod:specificBreakdown, totalstop:Interupt };
      });
    };


    //API MTBF
    const getApiData_MTBF = async (excludedTags = []) => {
      const response = await fetch(`http://10.24.0.82:5001/api/transitionsAll/Filling%20PE/${month}`);
      const data = await response.json();
    
      // Extract the breakdown for the specific Machine_Tag
      const specificMachineTag = 'AB_Network_04.Filling PE.STS_Plms_Production';
      const specificBreakdown = data.find(item => item.Machine_Tag === specificMachineTag)?.AvgTimeDifferenceInSeconds;
      console.log(specificBreakdown);


      
      // console.log(data);
      // Filter for Machine_Tags with fault names and calculate total qty
      // const faultMachines = data.filter(item => item.Machine_Tag.includes('fault'));
      const faultMachines = data
      .filter(item => !excludedTags.includes(item.Machine_Tag))
      .map(item => item.TransitionCount);
      console.log('falut machine:',faultMachines);

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
      const calmttr = Math.round(stopmachine/totalQty);
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
        {/* <div className='flex'>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div> */}
        {/* <ParetoDiagram/> */}
        <div className='py-2'></div>
        <h2 className={'menu-header'}>Filling PE Machine Peformance - {monthNames[month - 1]}</h2>
        <div className='flex px-20 gap-40 w-full justify-between'>
          <button  onClick={handlePreviousMonth} className='text-white px-4 py-2 bg-blue-700 rounded-3xl'>
            Back
          </button >
          <button onClick={handleNextMonth} className='text-white px-4 py-2 bg-blue-700 rounded-3xl'>
            Next
          </button>
        </div>
        
        < div className="flex px-20 gap-4 py-4 w-full items-center justify-center">

            <BoxWrapper>
            <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
              <IoTimerOutline className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-light'>MTBF All Stop</span>
              <div className='flex items-center'>
                <strong className='text-xl text-gray-700 font-semibold'>{breakdownTimeAll}</strong>

              </div>
            </div>
            </BoxWrapper>

            <BoxWrapper2>
            <div className='rounded-full h-10 w-10 flex items-center justify-center bg-sky-500'>
              <IoTimerOutline className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-light'>MTBF Custom</span>
              <div className='flex items-center'>
                <strong className='text-xl text-gray-700 font-semibold'>{breakdownTime}</strong>

              </div>
            </div>
            </BoxWrapper2>

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

        <div className='px-20 py-3'>
          <a className='text-gray-500 text-lg'>Filter Data :</a>
          <Select
            options={options}
            isMulti
            onChange={handleChange}
            placeholder="Select tags to exclude..."
          />
        </div>
        
        <div className='px-5 py-2'>
          <ParetoDiagram
          excludedTags={excludedTags}
          month={month}
          /> 
        </div>
        
        <div className='px-5 py-3'>
          <ParetoDiagramQTY
          excludedTags={excludedTags}
          month={month}
          /> 
        </div>

      </div>}

      {activeMenu === 'notifications' && <div className="table-container mx-auto px-2 overflow-auto">
        <div className='py-2'></div>
        <h2 className={'menu-header'}>Realtime Performance Machine Filling E </h2>
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
                    {typeof error.Value === 'string' && !isNaN(parseFloat(error.Value)) ? 
                      parseFloat(error.Value).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      : error.Value}
                  </span>
                </td>
                {/* <td className="table-row-data">{new Date(error.Timestamp).toLocaleString()}</td> */}
                <td className="table-row-data">{formatDateTime(error.Timestamp)}</td>
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



export default ContentContainer_FILLE;

function BoxWrapper({ children }) {
  return <div className="bg-white rounded-md p-4 flex-1 border border-gray-400 flex items-center">{children}</div>;
}
function BoxWrapper2({ children }) {
  return <div className="bg-amber-200 rounded-md p-4 flex-1 border border-gray-400 flex items-center">{children}</div>;
}
