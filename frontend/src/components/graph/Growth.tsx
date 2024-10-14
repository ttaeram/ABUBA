import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getPhysical } from '../../api/calendar';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type PhysicalData = {
  date: string;
  height: number;
  weight: number;
  faceUrl: string;
};

const Growth: React.FC = () => {
  const [physicalData, setPhysicalData] = useState<PhysicalData[]>([]);

  useEffect(() => {
    const fetchPhysicalData = async () => {
      try {
        const data = await getPhysical();
        setPhysicalData(data.data);
      } catch (error) {

      }
    };

    fetchPhysicalData();
  }, []);

  const dates = physicalData.map(item => item.date);
  const heights = physicalData.map(item => item.height);
  const weights = physicalData.map(item => item.weight);

  const data = {
    labels: dates,
    datasets: [
      {
        label: '키 (cm)',
        data: heights,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
        tension: 0.1,
      },
      {
        label: '몸무게 (kg)',
        data: weights,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y2',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      y1: {
        beginAtZero: true,
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '키 (cm)',
        },
        ticks: {
          stepSize: 5,
        },
      },
      y2: {
        beginAtZero: true,
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: '몸무게 (kg)',
        },
        ticks: {
          stepSize: 5,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: '',
        },
      },
    },
  };

  return (
    <GraphContainer style={{ width: '100%', height: '400px' }}>
      <Line data={data} options={options} />
    </GraphContainer>
  );
};

export default Growth;

const GraphContainer = styled.div`

`