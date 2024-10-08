import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button, Tabs, Tab, ListGroup, Table, Pagination } from 'react-bootstrap';
import trans from '../commons/trans';
import { stzUtil } from '../commons/stzUtil';
import ChartMaker from '../commons/ChartMaker';
import TableMaker from '../commons/TableMaker';
import { exportCSV } from '@mui/icons-material';
import BtnMaker from '../commons/BtnMaker';

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
		const initData = async () => {
			await fetchData(chartType);
			await fetchEventData();
			await fetchPieData();
			setIsLoading(false);
		};
		initData();
	}, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 호출
	const currentEvents = events.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
	const tableMakerProps = {
		data: currentEvents,
		title: '이벤트 목록',
		paginationProps: {
			currentPage,
			onChangePage: setCurrentPage,
			rowsPerPage: eventsPerPage,
			totalCount: events.length,
			showSearch: true, // 검색 기능 활성화
			showPagination: true, // 페이지네이션 기능 활성화
			columns: [
				{ title: '이벤트명', field: 'title' },
				{ title: '등록 날짜', field: 'regDt', render: rowData => stzUtil.dateFormatTs(rowData.regDt) },
				{ title: '등록자', field: 'editor' },
				{ title: '시작 날짜', field: 'bngnDt', render: rowData => rowData.bngnDt || '정보 없음' },
				{ title: '종료 날짜', field: 'endDt', render: rowData => rowData.endDt || '정보 없음' },
			],
		},
		options: {
			exportBtn: true,
			exportIcon: <BtnMaker opt={{ type: 'download' }} />,
		},
	};
	if (isLoading) return null;
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
							<TableMaker {...tableMakerProps} />
						</Col>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Admin;
