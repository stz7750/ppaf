import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Navigation from '../layout/Navigation';
import trans from '../commons/trans';
import { toast } from 'react-toastify';

function RegEvent() {
    const adminInfo = localStorage.getItem("authToken");
    const [formData, setFormData] = useState({
        eventName: '',
        editor: 'admin',
        eventStartDate: '',
        eventEndDate: '',
        eventTitle: '',
        eventContent: '',
        eventImage: null,
        eventType: ''
    });

    const eventData = {
        title: formData.eventTitle,
        editor: formData.editor,
        content: formData.eventContent,
        bngn_dt: formData.eventStartDate.split('T')[0],
        end_dt: formData.eventEndDate.split('T')[0],
        images: formData.eventImage ? JSON.stringify([formData.eventImage.name]) : null,
    };

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
            eventImage: event.target.files[0]
        }));
    };

    const handleClick = async () => {
        const vo = new FormData();
        vo.append("editor", formData.editor)
        vo.append('title', formData.eventTitle);
        vo.append('content', formData.eventContent);
        vo.append('bngnDt', formData.eventStartDate.split('T')[0]);
        vo.append('endDt', formData.eventEndDate.split('T')[0]);
        if (formData.eventImage) {
            vo.append('image', formData.eventImage);
        }
        vo.append("type", formData.eventType);

        try {
            const response = await trans.post('/admin/api/upsertEvent', vo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data === "success") {
                toast.success('이벤트가 성공적으로 등록되었습니다.');
            } else {
                alert('이벤트 등록에 실패하였습니다.');
            }
        } catch (error) {
            console.error('이벤트 등록 중 에러 발생:', error);
            toast.error('이벤트 등록 중 에러가 발생하였습니다.');
        }
    };

    return (
        <Container style={{ paddingBottom: '60px' }}>
            <Form>
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
                    <Form.Group as={Col} md="5">
                        <Form.Label>이벤트 시작일</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="eventStartDate"
                            value={formData.eventStartDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="2" className="d-flex align-items-center justify-content-center">
                        <span>~</span>
                    </Form.Group>
                    <Form.Group as={Col} md="5">
                        <Form.Label>이벤트 종료일</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="eventEndDate"
                            value={formData.eventEndDate}
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
                <Row className="mb-3">
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleClick}>
                            등록
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default RegEvent;
