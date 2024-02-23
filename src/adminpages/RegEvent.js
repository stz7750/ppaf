import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Navigation from '../layout/Navigation';

function RegEvent() {
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        eventTitle: '',
        eventContent: '',
        eventImage: null, // 이미지는 파일 형태로 관리됩니다.
        eventType: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            eventImage: event.target.files[0] // 파일을 직접 저장합니다.
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        // FormData 객체를 사용하여 파일을 포함한 데이터를 서버에 전송할 수 있습니다.
        // 여기에 서버로 데이터를 전송하는 로직을 추가하세요.
    };

    return (
        <Navigation>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                placeholder="이벤트 이름을 입력하세요"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 일시</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 제목</Form.Label>
                            <Form.Control
                                type="text"
                                name="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleChange}
                                placeholder="이벤트 제목을 입력하세요"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 내용</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="eventContent"
                                value={formData.eventContent}
                                onChange={handleChange}
                                placeholder="이벤트 내용을 입력하세요"
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 이미지</Form.Label>
                            <Form.Control
                                type="file"
                                name="eventImage"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>이벤트 종류</Form.Label>
                            <Form.Select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                            >
                                <option>이벤트 종류를 선택하세요</option>
                                <option value="conference">컨퍼런스</option>
                                <option value="seminar">세미나</option>
                                <option value="workshop">워크샵</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit">
                        등록
                    </Button>
                </Form>
            </Container>
        </Navigation>
    );
}

export default RegEvent;
