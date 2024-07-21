import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useEffect, useState} from 'react';
import Trans from "../commons/trans";
import trans from "../commons/trans";
import Modal from "react-bootstrap/Modal";

function BigCalendar(props) {
    moment.locale('ko-KR');
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("persist:root"));
        const editor = JSON.parse(loggedUser.id); // JSON.parse를 사용하여 이중 따옴표를 제거

        // API 호출
        trans.get(`/admin/api/news?editor=${editor}`).then(response => {
            console.log(response.data);
            const fetchedEvents = response.data.map(event => ({
                start: new Date(event.bngnDt),
                end: new Date(event.endDt),
                content : event.content,
                title: event.title,
                color : event.color,
            }));
            console.log(fetchedEvents);
            setEvents(fetchedEvents); // 변환된 이벤트 데이터로 events 상태 업데이트
        }).catch(error => console.error("Fetching events failed:", error));
    }, []);

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: event.color || '#3174ad', // 이벤트에 color 속성이 없는 경우 기본 색상 사용
            borderRadius: '6px',
            opacity: 0.8,
            color: 'white', // 글자색
            border: '3px',
            display: 'block'
        };
        return { style };
    };

    const handleEventSelect = (event) => {
        console.log(event);
        setSelectedEvent(event);
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
        setSelectedEvent(null);
    };


    return (
        <>
            <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={events}
                style={{ height: "100vh" }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleEventSelect}
                messages={{
                    today: '오늘',
                    next: '다음',
                    previous: '이전',
                    month: '월',
                    week: '주',
                    day: '일',
                }}
            />
            <Modal
                show={modalIsOpen} // `isOpen` 대신 `show` 사용
                onHide={closeModal} // `onRequestClose` 대신 `onHide` 사용
            >
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEvent?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{selectedEvent?.content}</Modal.Body>
                <Modal.Footer>
                    <button onClick={closeModal}>Close</button>
                </Modal.Footer>
            </Modal>
    </>
    );
}

export default BigCalendar;