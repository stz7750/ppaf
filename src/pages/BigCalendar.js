import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useEffect, useState} from 'react';
import Trans from "../commons/trans";
import trans from "../commons/trans";

function BigCalendar(props) {
    moment.locale('ko-KR');
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    /*const events = [
        {
          start: new Date(),
          end: new Date(moment().add(1, "days")),
          title: "Sample Event",
        },
        // more events...
      ];*/
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("persist:root"));
        const editor = JSON.parse(loggedUser.id); // JSON.parse를 사용하여 이중 따옴표를 제거

        // API 호출
        trans.get(`/admin/api/news?editor=${editor}`).then(response => {
            console.log(response.data);
            const fetchedEvents = response.data.map(event => ({
                start: new Date(event.bngnDt),
                end: new Date(event.endDt),
                title: event.title,
                resource: { note: "가족과 함께" },
            }));
            console.log(fetchedEvents);
            setEvents(fetchedEvents); // 변환된 이벤트 데이터로 events 상태 업데이트
        }).catch(error => console.error("Fetching events failed:", error));
    }, []);
    return (
        <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={events}
            style={{ height: "100vh" }}
            messages={{
                today: '오늘',
                next: '다음',
                previous: '이전',
                month: '월',
                week: '주',
                day: '일',
                // 필요한 다른 텍스트도 이곳에 추가
            }}
        />
    );
}

export default BigCalendar;