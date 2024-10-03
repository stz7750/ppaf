/**
 *packageName    : stz-
 * fileName       : ChartMaker.js
 * author         : stz
 * date           : 10/3/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 10/3/24        stz       최초 생성
 */
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const ChartMaker = ({ type, data, options }) => {
	// 차트 타입에 따라 기본 옵션을 다르게 설정
	const getDefaultOptions = type => {
		switch (type) {
			case 'line':
				return {
					responsive: true,
					plugins: {
						legend: { position: 'top' },
						title: { display: true, text: 'Line Chart' },
					},
					scales: {
						y: {
							suggestedMin: 0,
							suggestedMax: 10,
						},
					},
				};
			case 'bar':
				return {
					responsive: true,
					plugins: {
						legend: { position: 'top' },
						title: { display: true, text: 'Bar Chart' },
					},
					scales: {
						x: { stacked: true },
						y: { stacked: true },
					},
				};
			case 'pie':
				return {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { position: 'top' },
						title: { display: true, text: 'Pie Chart' },
					},
				};
			default:
				return {};
		}
	};

	const chartOptions = { ...getDefaultOptions(type), ...options };

	switch (type) {
		case 'line':
			return <Line data={data} options={chartOptions} />;
		case 'bar':
			return <Bar data={data} options={chartOptions} />;
		case 'pie':
			return <Pie data={data} options={chartOptions} />;
		default:
			return null;
	}
};

export default ChartMaker;
