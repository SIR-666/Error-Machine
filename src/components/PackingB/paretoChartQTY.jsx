import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Line, Label, LabelList, LineChart, ComposedChart,ReferenceLine 
 } from 'recharts';

const CustomTooltip = ({ payload, label }) => {
  if (payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 p-2 rounded">
        <p className="text-gray-700"><strong>{data.name}</strong></p>
        <p className="text-gray-600">Breakdown: {data.breakdown}</p>
        <p className="text-gray-600">Percentage: {data.ParetoDowntime}%</p>
      </div>
    );
  }
  return null;
};

const calculateCumulative = (data) => {
  const totalBreakdown = data.reduce((sum, item) => sum + item.breakdown, 0);

  let cumulative = 0;
  return data.map((item) => {
    cumulative += item.breakdown;
    return { 
      ...item, 
      cumulative, 
      percentage: totalBreakdown > 0 ? ((item.breakdown / totalBreakdown) * 100).toFixed(2) : '0.00',
      ParetoDowntime: totalBreakdown > 0 ? ((cumulative / totalBreakdown) * 100).toFixed(2) : '0.00'
    };
  });
};

// const getApiData = async () => {
//   const response = await fetch('http://10.24.0.82:5001/api/transitions')
//   const data = await response.json()
//   console.log(data);
//   return data.map(item => {
//     const name = item.Machine_Tag.split(".")[2];
//     const breakdown = item.AvgTimeDifferenceInSeconds;
//     return { name, breakdown };
//   });
// };

const getApiData = async () => {
  const response = await fetch('http://10.24.0.82:5001/api/transitions');
  const data = await response.json();
  console.log(data);

  return data
  .filter(item => 
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Running' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Stopped' && // Exclude this machine state as well
    item.Machine_Tag !== 'AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.bFL_AirPressureLow' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Idle' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Aborted' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Aborting' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Resetting' &&
    item.Machine_Tag !== 'AB_Network_02.Packing PB.Machine State Clearing'
  )
    .map(item => {
      const name = item.Machine_Tag.split(".")[2]; // Assuming this always has 3 parts
      const breakdown = item.TransitionCount;
      return { name, breakdown };
    });
};


const ParetoDiagramQTY = () => {
  const [cumulativeData, setCumulativeData] = useState([]);

  useEffect(() => {
    getApiData().then(data => {
      const cumulativeData = calculateCumulative(
        data.sort((a, b) => b.breakdown - a.breakdown)
      );

      setCumulativeData(cumulativeData);
    });
  }, []);

  return (
    <div className='px-4 h-auto bg-white p-4 rounded-md border border-gray-200 mx-auto shadow-md' style={{ width: '90%', maxWidth: '1200px' }}>
        <strong className='text-gray-500 font-medium'>PARETO BREAKDOWN PACKING PB</strong>
        <div className='text-sm text-gray-500'>Number of Breakdown in Qty</div>
        
        {/* Membuat height dinamis berdasarkan konten */}
        <div className='w-full mt-3 flex-1 text-xs' style={{ minHeight: "300px", height: "auto" }}>
            <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={cumulativeData} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* Posisikan legend di atas chart */}
                <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ top: -20 }} />
                {/* Sumbu X dinamis dengan teks miring */}
                <XAxis 
                dataKey="name"
                angle={-25}  // Kemiringan teks
                textAnchor="end"  // Penyelarasan di akhir
                />

                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                {/* <Legend /> */}
                

                {/* Bar Chart */}
                <Bar yAxisId="left" dataKey="breakdown" fill="#295F98">
                <LabelList dataKey="breakdown" position="top" fill="#6256CA" />
                </Bar>

                {/* Line Chart */}
                <Line yAxisId="right" type="monotone" dataKey="ParetoDowntime" stroke="#ff7300" />

                <ReferenceLine 
                y={80} 
                yAxisId="right" 
                stroke="red" 
                strokeDasharray="3 3" 
                label={{ value: '80%', position: 'right' }} 
                />
            </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>

  );
};

export default ParetoDiagramQTY;
