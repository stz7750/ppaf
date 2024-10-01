import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Trans from '../commons/trans';
import trans from '../commons/trans';
import Modal from 'react-bootstrap/Modal';
import GlobalModal from '../commons/GlobalModal';
import { isSelected } from 'react-big-calendar/lib/utils/selection';
import { Button, ButtonGroup, MenuItem, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function BigCalendar(props) {
	moment.locale('ko-KR');
	const localizer = momentLocalizer(moment);
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState();
	const calendarRef = useRef(null);
	const dayRefs = useRef({});

	useEffect(() => {
		const loggedUser = JSON.parse(localStorage.getItem('persist:root'));
		const editor = JSON.parse(loggedUser.id); // JSON.parse를 사용하여 이중 따옴표를 제거

		// API 호출
		trans
			.get(`/admin/api/news?editor=${editor}`)
			.then(response => {
				console.log(response.data);
				const fetchedEvents = response.data.map(event => ({
					start: new Date(event.bngnDt),
					end: new Date(event.endDt),
					content: event.content,
					title: event.title,
					color: event.color,
				}));
				console.log(fetchedEvents);
				setEvents(fetchedEvents); // 변환된 이벤트 데이터로 events 상태 업데이트
			})
			.catch(error => console.error('Fetching events failed:', error));
	}, []);

	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: event.color || '#3174ad', // 이벤트에 color 속성이 없는 경우 기본 색상 사용
			borderRadius: '6px',
			opacity: 0.8,
			color: 'white', // 글자색
			border: '3px',
			display: 'block',
		};
		return { style };
	};

	const handleEventSelect = event => {
		setSelectedEvent(event);
		setIsOpen(true);
	};

	const MyDayHeader = ({ date }) => {
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		const isSunday = date.getDay() === 0;
		const isSaturday = date.getDay() === 6;

		return (
			<div className="rbc-header" style={{ color: isSunday ? 'red' : isSaturday ? 'blue' : 'inherit' }}>
				{weekdays[date.getDay()]}
			</div>
		);
	};
	const CustomToolbar = props => {
		return (
			<div className="rbc-toolbar">
				<ButtonGroup variant="contained" color="primary">
					<Button onClick={() => props.onNavigate('PREV')}>이전</Button>
					<Button onClick={() => props.onNavigate('TODAY')}>오늘</Button>
					<Button onClick={() => props.onNavigate('NEXT')}>다음</Button>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="날짜 검색"
							value={selectedDate}
							onChange={newValue => {
								setSelectedDate(newValue);
								props.onNavigate('DATE', newValue.toDate());
							}}
						/>
					</LocalizationProvider>
				</ButtonGroup>
				<span className="rbc-toolbar-label">{moment(props.label, 'MMMM YYYY').format('YYYY년 MM월')}</span>
				<Select value={props.view} onChange={e => props.onView(e.target.value)} variant="outlined" style={{ marginLeft: '1rem' }}>
					<MenuItem value="month">월</MenuItem>
					<MenuItem value="week">주</MenuItem>
					<MenuItem value="day">일</MenuItem>
				</Select>
			</div>
		);
	};

	const dayPropGetter = date => {
		if (selectedDate && moment(date).isSame(moment(selectedDate.toDate()), 'day')) {
			console.log('Matched:', date);
			return {
				className: 'selected-focus-style',
			};
		}
		return {};
	};

	useEffect(() => {
		if (selectedDate) {
			const elements = document.getElementsByClassName('rbc-current');
			const currentElement = elements[0];
			currentElement.children[0].classList.add('selected-date-btn');
			currentElement.children[0].focus();
		}
	}, [selectedDate]);
	return (
		<>
			<Calendar
				ref={calendarRef}
				localizer={localizer}
				defaultDate={new Date()}
				defaultView="month"
				events={events}
				style={{ height: '100vh' }}
				eventPropGetter={eventStyleGetter}
				onSelectEvent={handleEventSelect}
				dayPropGetter={dayPropGetter}
				messages={{
					today: '오늘',
					next: '다음',
					previous: '이전',
					month: '월',
					week: '주',
					day: '일',
				}}
				components={{
					month: {
						header: MyDayHeader,
					},
					week: {
						header: MyDayHeader,
					},
					day: {
						header: MyDayHeader,
					},
					toolbar: CustomToolbar,
				}}
			/>

			<GlobalModal show={modalIsOpen} setShow={setIsOpen} title={selectedEvent?.title} data={{ data1: selectedEvent?.content, data2: '' }} />
		</>
	);
}

export default BigCalendar;
