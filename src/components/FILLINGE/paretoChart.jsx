import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Line, LabelList, ComposedChart, ReferenceLine 
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

const getApiData = async (excludedTags,month) => {
  console.log('getting month');
  const response = await fetch(`http://10.24.0.82:5001/api/transitionsAll/Filling%20PE/${month}`);
  const data = await response.json();

  return data
    .filter(item => !excludedTags.includes(item.Machine_Tag))  // Use the passed excludedTags
    .map(item => {
      const name = item.Machine_Tag.split(".")[2]; // Assuming this always has 3 parts
      const breakdown = item.AvgTimeDifferenceInSeconds;
      return { name, breakdown };
    });
};

const monthNames = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];
const ParetoDiagram = ({ excludedTags,month }) => {
  const [cumulativeData, setCumulativeData] = useState([]);

  useEffect(() => {
    getApiData(excludedTags, month).then(data => {
      const cumulativeData = calculateCumulative(
        data.sort((a, b) => b.breakdown - a.breakdown)
      );

      setCumulativeData(cumulativeData);
    });
  }, [excludedTags,month]); // Re-run the effect when excludedTags changes

  return (
    <div className='px-4 h-auto bg-white p-4 rounded-md border border-gray-200 mx-auto shadow-md' style={{ width: '90%', maxWidth: '1200px' }}>
      <strong className='text-gray-500 font-medium'> PARETO BREAKDOWN FILLING PE - {monthNames[month - 1]}</strong>
      <div className='text-sm text-gray-500'>Number of Breakdown in Time(s)</div>
      <div className='w-full mt-3 flex-1 text-xs' style={{ minHeight: "300px", height: "auto" }}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={cumulativeData} margin={{ top: 20, right: 30, left: 30, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ top: -20 }} />
            <XAxis dataKey="name" angle={-25} textAnchor="end" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="breakdown" fill="#295F98">
              <LabelList dataKey="breakdown" position="top" fill="#6256CA" />
            </Bar>
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

export default ParetoDiagram;
