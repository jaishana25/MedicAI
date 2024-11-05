import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';
Chart.register(...registerables);

// const vitalsData = {
//   bloodSugar: {
//     labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
//     data: [100, 90, 80, 110, 120, 85, 105],
//   },
//   bloodPressure: {
//     labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
//     data: [120, 115, 130, 125, 140, 135, 128],
//   },
//   heartRate: {
//     labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
//     data: [70, 72, 68, 75, 73, 74, 76],
//   },
// };

// const VitalChart = ({ label, data, startDate, endDate }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chartInstance = chartRef.current;
//     return () => {
//       if (chartInstance) {
//         chartInstance.destroy();
//       }
//     };
//   }, []);

//   const filteredData = {
//     labels: data.labels.filter(
//       (date, index) => new Date(`${date}-01`) >= new Date(startDate) && new Date(`${date}-01`) <= new Date(endDate)
//     ),
//     datasets: [
//       {
//         label: label,
//         data: data.data.filter(
//           (_, index) => new Date(`${data.labels[index]}-01`) >= new Date(startDate) && new Date(`${data.labels[index]}-01`) <= new Date(endDate)
//         ),
//         fill: false,
//         backgroundColor: 'rgba(75,192,192,0.4)',
//         borderColor: 'rgba(75,192,192,1)',
//       },
//     ],
//   };

//   return (
//     <Line ref={chartRef} data={filteredData} options={{ maintainAspectRatio: false }} />
//   );
// };

const VitalChart = ({ label, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: label,
        data: data.data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

const VitalAnalysis = () => {
  const [selectedVital, setSelectedVital] = useState('bloodSugar');
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2025-07-01'));

  const [attributes, setAttributes] = useState([]);
  const [vitalsData, setVitalsData] = useState({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Function to format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/report-analysis/reports/attributes', {
        auth: {
          username: 'admin',
          password: 'abcd@1234'
        },
      });

      setAttributes(response.data.attributes);
      setIsLoading(false);
      console.log(attributes);
      setSelectedVital(attributes[0])
    } catch (error) {
      console.error('Error fetching attributes:', error);
      setIsLoading(false);
    }
  };

  const fetchVitalsData = async (vital, startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const response = await axios.get(
        `http://127.0.0.1:8000/report-analysis/reports/attributes/visualisation/${vital}`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        auth: {
          username: 'admin',
          password: 'abcd@1234'
        },
      }
      );
      const dates = response.data.dates;
      const results = response.data.attributes.map(attr => attr.result);

      setVitalsData({
        labels: dates,
        data: results,
      });

    } catch (error) {
      console.log('Error getting the data points for visualisation: ', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Fetch the data on component mount
    fetchAttributes();
  }, []);
  // Fetch vitals data whenever selectedVital changes
  useEffect(() => {
    if (selectedVital) {
      fetchVitalsData(selectedVital, startDate, endDate);
    }
  }, [selectedVital, startDate, endDate]);

  const handleVitalChange = (event) => {
    setSelectedVital(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Vital Analysis</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 font-medium mb-1">Select Vital:</label>
          {/* <select
            value={selectedVital}
            onChange={handleVitalChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="bloodSugar">Blood Sugar Level</option>
            <option value="bloodPressure">Blood Pressure</option>
            <option value="heartRate">Heart Rate</option>
          </select> */}

          {/* Show loading message or the dropdown */}
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <select
              value={selectedVital}
              onChange={handleVitalChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {attributes.map((attribute, index) => (
                <option key={index} value={attribute}>{attribute}</option>
              ))}
            </select>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 font-medium mb-1">Start Month:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 font-medium mb-1">End Month:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="h-64 md:h-80">
        <VitalChart
          label={selectedVital}
          data={vitalsData}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
};

export default VitalAnalysis;
