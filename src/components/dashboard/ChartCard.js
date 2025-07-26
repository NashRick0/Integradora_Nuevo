import React from 'react';
import { Card, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartCard = ({ title, data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { maxTicksLimit: 7, autoSkip: true } } },
    elements: { line: { tension: 0.3, fill: 'start' } },
  };

  return (
    <Card title={title} style={{ height: '300px' }} className='scale-up-ver-bottom'>
        {!data ? <Spin/> : (
            <div style={{ height: '220px' }}>
                <Line options={options} data={data} />
            </div>
        )}
    </Card>
  );
};

export default ChartCard;