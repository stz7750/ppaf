import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';

import trans from '../commons/trans';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navigation from '../layout/Navigation';

function Main(props) {
  
  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await trans.get('admin/api/news');
        const apiRes = await trans.get(`https://api.odcloud.kr/api/15086437/v1/uddi:2a82ac44-e17a-4919-ab5d-a25ba16af19c?serviceKey=${SERVICE_KEY}&page=1&perPage=10&returnType=JSON`)
    
        if (res.data) {
          console.table(res.data);
          console.table(apiRes.data);
          setCardData(apiRes.data); // 받은 데이터를 cardData에 설정합니다.
          console.log(cardData);
        } else {
          toast.warning("데이터 통신 실패~");
        }
      } catch (error) {
        console.error(error);
        toast.error("데이터 가져오기 실패!");
      }
    }
    fetchData();
  }, []);
      
  
    return (
      <>
        <Navigation>
         <Row>
          <Col>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://via.placeholder.com/800x400"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>첫 번째 슬라이드 레이블</h3>
                  <p>슬라이드 설명이 여기에 들어갑니다.</p>
                </Carousel.Caption>
              </Carousel.Item>
              {/* 추가 Carousel.Item 요소로 슬라이드를 추가할 수 있습니다. */}
            </Carousel>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          {cardData.data?.map((card, idx) => (
            <Col md={4} key={idx}>
              <Link to={`${card.원본주소}`} style={{ textDecoration: "none"}}>
                <Card style={{ marginTop: '20px' }}>
                  <Card.Img variant="top" src={card.image ? card.image : "https://via.placeholder.com/300x200"} />
                  <Card.Body>
                    <Card.Title style={{ fontSize: '20px', fontWeight: 'bold' }}>{card.제목}</Card.Title>
                    <Card.Text style={{ fontSize: '14px' }}>{card.본문.length > 20 ? card.본문.substring(0,19) + '......' : card.본문}</Card.Text>
                    <Card.Text>{card.언론사 ? card.언론사 : '없음ㅋㅋ'}</Card.Text>
                    <Card.Text>{card.일자}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        </Navigation>
      </>
    );
}

export default Main;