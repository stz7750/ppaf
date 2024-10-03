import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Container, Row, Col, Button, Tabs, Tab, ListGroup, Table, Pagination } from 'react-bootstrap';
import trans from '../commons/trans';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import Navigation from '../layout/Navigation';
import GlobalModal from '../commons/GlobalModal';
import { stzUtil } from '../commons/stzUtil';
import ChartMaker from '../commons/ChartMaker';
import MaterialTable from 'material-table';
import { FirstPage, LastPage, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TablePagination } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: '접속자 분석 차트',
		},
	},
	scales: {
		y: {
			suggestedMin: 0, // 최소값
			suggestedMax: 10, // 최대값
		},
	},
};
function Admin(props) {
	const [chartData, setChartData] = useState({});
	const [chartType, setChartType] = useState('daily');
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [eventsPerPage] = useState(5); // 페이지 당 표시할 이벤트 수
	const [show, setShow] = useState(false);
	const [pieChartData, setPieChartData] = useState({});

	const fetchEventData = async cno => {
		try {
			const response = await trans.get(`/admin/api/news`);
			setEvents(response.data); // 뉴스 데이터 상태 업데이트
			console.table(response.data);
		} catch (error) {
			console.error('뉴스 데이터를 불러오는 중 에러 발생:', error);
		}
	};
	const fetchData = async type => {
		try {
			const response = await trans.get(`/admin/api/loginCounts/${type}`);
			const data = response.data;
			const chartData = {
				labels: data.map(item => item.date),
				datasets: [
					{
						label: '회원 수',
						data: data.map(item => item.login_count),
						backgroundColor: 'rgba(75, 192, 192, 1)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1,
					},
				],
			};

			setChartData(chartData);
		} catch (error) {
			console.error('에러 발생 여기:', error);
		}
	};

	const fetchPieData = async () => {
		try {
			const response = await trans.get('admin/api/getContentCnt');
			const data = response.data;
			console.log(data);
			const pieData = {
				labels: ['이벤트', '유저 수'],
				datasets: [
					{
						data: [data[0].event_cnt, data[0].user_cnt],
						backgroundColor: ['#36A2EB', '#FF6384'],
						hoverBackgroundColor: ['#36A2EB', '#FF6384'],
					},
				],
			};
			setPieChartData(pieData);
		} catch (error) {
			console.error('파이 차트 데이터를 불러오는 중 에러 발생:', error);
		}
	};

	useEffect(() => {
		console.log(pieChartData);
	}, [pieChartData]);
	useEffect(() => {
		const initData = async () => {
			await fetchData(chartType);
			await fetchEventData();
			await fetchPieData();
			setIsLoading(false);
		};
		initData();
	}, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 호출

	useEffect(() => {
		// chartType이 변경될 때마다 데이터를 다시 로드
		fetchData(chartType);
	}, [chartType]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	const indexOfLastEvent = currentPage * eventsPerPage;
	const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
	const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

	// 페이지 번호를 계산하기 위한 로직
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(events.length / eventsPerPage); i++) {
		pageNumbers.push(i);
	}
	const paginate = pageNumber => setCurrentPage(pageNumber);

	return (
		<>
			<Container fluid style={{ maxHeight: '500px' }}>
				<Row>
					<Col md={6} className="mb-4">
						<div className="d-flex flex-column">
							<div className="d-flex justify-content-around mb-2">
								<Button variant="primary" onClick={() => setChartType('daily')}>
									Daily
								</Button>
								<Button variant="secondary" onClick={() => setChartType('monthly')}>
									Monthly
								</Button>
								<Button variant="success" onClick={() => setChartType('yearly')}>
									Yearly
								</Button>
							</div>
							<div>
								<ChartMaker type={'bar'} data={chartData} options={options} />
							</div>
						</div>
					</Col>
					<Col md={6} className="mb-4">
						<div className="d-flex flex-column">
							<div style={{ width: '100%', height: '340px' }}>
								<ChartMaker
									data={pieChartData}
									type="pie"
									options={{
										plugins: {
											legend: { position: 'top' },
											title: { display: true, text: '이벤트 및 사용자 수' },
										},
									}}
								/>
							</div>
						</div>
					</Col>
					<Col md={12}>
						<Col md={12}>
							<h4 className="mb-3">이벤트</h4>
							<MaterialTable
								title="이벤트"
								columns={[
									{ title: '이벤트명', field: 'title' },
									{ title: '등록 날짜', field: 'regDt', render: rowData => stzUtil.dateFormatTs(rowData.regDt) },
									{ title: '등록자', field: 'editor' },
									{ title: '시작 날짜', field: 'bngnDt', render: rowData => rowData.bngnDt || '정보 없음' },
									{ title: '종료 날짜', field: 'endDt', render: rowData => rowData.endDt || '정보 없음' },
								]}
								data={events}
								options={{
									search: true, //상단 검색
									paging: true, //페이지네이션
									filtering: true, //필터
								}}
							/>
						</Col>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Admin;
