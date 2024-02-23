import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
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
      text: 'Chart.js Bar Chart',
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

    

    const fetchData = async (type) => {
        try {
          const response = await trans.get(`/admin/api/loginCounts/${type}`);
          const data = response.data;
          console.log(data,"asdwqdwqdqwfqfwqfq");
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
          console.error('Error fetching chart data:', error);
        }
    };
    
    useEffect(() => {
        fetchData(chartType).then(() => setIsLoading(false));
      }, [chartType]);
      
      if (isLoading) {
        return <div>Loading...</div>;
      }
    
      return (
      <Navigation>
        <Container fluid>
          <Row>
            <Col md={6} className="mb-4">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-around mb-2">
                  <Button variant="primary" onClick={() => setChartType('daily')}>Daily</Button>
                  <Button variant="secondary" onClick={() => setChartType('monthly')}>Monthly</Button>
                  <Button variant="success" onClick={() => setChartType('yearly')}>Yearly</Button>
                </div>
                <div style={{width : '600px'}}>
                    <Bar data={chartData} options={options} />
                </div>
              </div>
            </Col>
            {/* 다른 컨텐츠를 위한 공간 */}
            <Col md={6}> {/* 오른쪽 상단 컨텐츠 */} </Col>
            <Col md={6}> {/* 왼쪽 하단 컨텐츠 */} </Col>
            <Col md={6}> {/* 오른쪽 하단 컨텐츠 */} </Col>
          </Row>
        </Container>
      </Navigation>
    );
}

export default Admin;