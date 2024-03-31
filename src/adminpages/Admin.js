import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Container, Row, Col, Button, Tabs, Tab, ListGroup, Table, Pagination } from 'react-bootstrap';
import trans from '../commons/trans';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import Chart from 'chart.js/auto';
import Navigation from '../layout/Navigation';
import GlobalModal from '../commons/GlobalModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
    const [show , setShow] = useState(false);

    
    const fetchEventData = async (cno) => {
      try {
          const response = await trans.get(`/admin/api/news`);
          setEvents(response.data); // 뉴스 데이터 상태 업데이트
          console.table(response.data);
      } catch (error) {
          console.error('뉴스 데이터를 불러오는 중 에러 발생:', error);
      }
  };
    const fetchData = async (type) => {
        try {
          const response = await trans.get(`/admin/api/loginCounts/${type}`);
          const data = response.data;
          const chartData = {
            labels: data.map(item => item.date),
            datasets: [{
              label: '회원 수',
              data: data.map(item => item.login_count),
              backgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          };
    
          setChartData(chartData);
        } catch (error) {
          console.error('에러 발생 여기:', error);
        }
    };
    useEffect(() => {
      console.log(`현재 페이지: ${currentPage}, 이벤트 총 개수: ${events.length}, 페이지당 이벤트 수: ${eventsPerPage}`);
  }, [currentPage, events]);


  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드
    const initData = async () => {
      await fetchData(chartType);
      await fetchEventData();
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
      const paginate = (pageNumber) => setCurrentPage(pageNumber);
      

      return (
        <>
        <Container fluid style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Row>
          <Col md={6} className="mb-4">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-around mb-2">
                <Button variant="primary" onClick={() => setChartType('daily')}>Daily</Button>
                <Button variant="secondary" onClick={() => setChartType('monthly')}>Monthly</Button>
                <Button variant="success" onClick={() => setChartType('yearly')}>Yearly</Button>
              </div>
              {/* 고정 너비를 제거하고 반응형 디자인 적용 */}
              <div>
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </Col>
          <Col md={12}>
              <h4 className="mb-3">이벤트</h4>
              <Button onClick={() => setShow(true)}>열기</Button>
            <Table striped bordered hover>
              <thead>
              <tr>
                <th>#</th>
                <th>이벤트명</th>
                <th>등록 날짜</th>
                <th>등록자</th>
                <th>시작 날짜</th>
                <th>종료 날짜</th>
              </tr>
              </thead>
              <tbody>
              {events.map((event) => (
                  <tr key={event.eventId}>
                    <td>{event.eventId}</td>
                    <td>{event.title}</td>
                    <td>{event.regDt}</td>
                    <td>{event.editor}</td>
                    <td>{event.bngnDt || '정보 없음'}</td> {/* 시작 날짜가 없는 경우 '정보 없음' 표시 */}
                    <td>{event.endDt || '정보 없음'}</td> {/* 종료 날짜가 없는 경우 '정보 없음' 표시 */}
                  </tr>
              ))}
              </tbody>
            </Table>
            {/* <Pagination>
                        {pageNumbers.map(number => (
                            <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                                {number}
                            </Pagination.Item>
                        ))}
              </Pagination> */}
            </Col>
          </Row>
        </Container>
        <GlobalModal show={show} setShow={setShow} title={"모달 테스트"} data={{data1 : 'val1', data2 : 'val2'}}/>
        </>
    );
}

export default Admin;