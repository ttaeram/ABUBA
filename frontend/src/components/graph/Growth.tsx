import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getPhysical } from '../../api/calendar';
import styled from 'styled-components';
import { changeShortName } from '../../utils/changeShortName';
import { useChildAuthStore } from '../../stores/authStore';

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
import dayjs from 'dayjs';

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
  const [heightGrowth, setHeightGrowth] = useState<number>(0)
  const [weightGrowth, setWeightGrowth] = useState<number>(0)
  const [durationInfo, setDurationInfo] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const {childname} = useChildAuthStore()
  const shortname = changeShortName(childname)

  useEffect(() => {
    const fetchPhysicalData = async () => {
      try {
        const data = await getPhysical();
        setPhysicalData(data.data);
        calculateGrowth(data.data)
      } catch (error) {

      }
    };

    fetchPhysicalData();
  }, []);

  const calculateGrowth = (data: PhysicalData[]) => {
    if (data.length < 2) return

    const firstRecord = data[0]
    const lastRecord = data[data.length - 1]

    const heightDiff = Math.round(lastRecord.height - firstRecord.height)
    const weightDiff = Math.round(lastRecord.weight - firstRecord.weight)

    setHeightGrowth(heightDiff)
    setWeightGrowth(weightDiff)

    const startDate = dayjs(firstRecord.date)
    const endDate = dayjs(lastRecord.date)
    const totalDay = endDate.diff(startDate, 'day')

    setDurationInfo(
      `${startDate.format('YYYY년 MM월 DD일')} ~ ${endDate.format('YYYY년 MM월 DD일')}`
    )
    setDuration(`${totalDay}일`)
  }

  const dates = physicalData.map(item => item.date);
  const heights = physicalData.map(item => item.height);
  const weights = physicalData.map(item => item.weight);

  const data = {
    labels: dates,
    datasets: [
      {
        label: '키 (cm)',
        data: heights,
        borderColor: '#3B6EBA',
        backgroundColor: '#3B6EBA',
        yAxisID: 'y1',
        tension: 0.1,
      },
      {
        label: '몸무게 (kg)',
        data: weights,
        borderColor: '#ffde02',
        backgroundColor: '#ffde02',
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
          display: false,
          text: '신장 (cm)',
        },
        ticks: {
          stepSize: 5,
        },
        grid: {
          display: false,
        },
      },
      y2: {
        beginAtZero: true,
        type: 'linear',
        position: 'right',
        title: {
          display: false,
          text: '체중 (kg)',
        },
        ticks: {
          stepSize: 5,
        },
        grid: {
          drawOnChartArea: false,
          display: false,
        },
      },
      x: {
        title: {
          display: false,
          text: '',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <GraphContainer style={{ width: '100%', height: '400px' }}>
      <GrowthSummary>
        <Duration>{durationInfo}</Duration>
        <HeightChange>
          - {shortname}(이)는 <ColoredHeightText>{duration}</ColoredHeightText> 동안 <ColoredHeightText>신장</ColoredHeightText>이 <ColoredHeightText>{heightGrowth > 0 ? `${heightGrowth}cm` : '0cm'}</ColoredHeightText> 자랐어요!
        </HeightChange>
        <WeightChange>
          - {shortname}(이)는 <ColoredWeightText>{duration}</ColoredWeightText> 동안 <ColoredWeightText>체중</ColoredWeightText>이 <ColoredWeightText>{weightGrowth > 0 ? `${weightGrowth}kg` : '0kg'}</ColoredWeightText> 늘었어요!
        </WeightChange>
      </GrowthSummary>
      <Line data={data} options={options} />
    </GraphContainer>
  );
};

export default Growth;

const GraphContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
`;

const GrowthSummary = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Duration = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
`;

const HeightChange = styled.div`
  font-size: 16px;
  color: black;
  margin-bottom: 8px;
  text-align: center;
  width: 100%;
`;

const WeightChange = styled.div`
  font-size: 16px;
  color: black;
  text-align: center;
  width: 100%;
`;

const ColoredHeightText = styled.span`
  color: #3B6EBA;
`;

const ColoredWeightText = styled.span`
  color: #FFB800;
`;