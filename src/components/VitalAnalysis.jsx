import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';

Chart.register(...registerables);

const vitalsData = {
  bloodSugar: {
    labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
    data: [100, 90, 80, 110, 120, 85, 105],
  },
  bloodPressure: {
    labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
    data: [120, 115, 130, 125, 140, 135, 128],
  },
  heartRate: {
    labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
    data: [70, 72, 68, 75, 73, 74, 76],
  },
};

const VitalChart = ({ label, data, startDate, endDate }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const filteredData = {
    labels: data.labels.filter(
      (date, index) => new Date(`${date}-01`) >= new Date(startDate) && new Date(`${date}-01`) <= new Date(endDate)
    ),
    datasets: [
      {
        label: label,
        data: data.data.filter(
          (_, index) => new Date(`${data.labels[index]}-01`) >= new Date(startDate) && new Date(`${data.labels[index]}-01`) <= new Date(endDate)
        ),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <Line ref={chartRef} data={filteredData} options={{ maintainAspectRatio: false }} />
  );
};

const VitalAnalysis = () => {
  const [selectedVital, setSelectedVital] = useState('bloodSugar');
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-07-01'));

  const handleVitalChange = (event) => {
    setSelectedVital(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Vital Analysis</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 font-medium mb-1">Select Vital:</label>
          <select
            value={selectedVital}
            onChange={handleVitalChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="bloodSugar">Blood Sugar Level</option>
            <option value="bloodPressure">Blood Pressure</option>
            <option value="heartRate">Heart Rate</option>
          </select>
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
          label={selectedVital.charAt(0).toUpperCase() + selectedVital.slice(1)}
          data={vitalsData[selectedVital]}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
};

export default VitalAnalysis;
