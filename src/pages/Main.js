import React from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import Navigation from '../layout/Navigation';

function Main(props) {
    return (
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
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
              <Card.Body>
                <Card.Title>뉴스 제목</Card.Title>
                <Card.Text>
                  뉴스 요약 내용이 여기에 들어갑니다.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* 추가 카드로 뉴스 섹션을 확장할 수 있습니다. */}
        </Row>
        </Navigation>
    );
}

export default Main;