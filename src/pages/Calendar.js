import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar(props) {
    const events = [
        { title: 'Meeting', start: new Date() }
      ]

    return (
        <div style={{ margin:15, display:'grid',gridTemplateColumns:"2fr 1fr"}} >
             <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin,interactionPlugin]}
                initialView={'dayGridMonth'}
                weekends={true}
                events={events}
            >

             </FullCalendar>
        </div>
    );
}

export default Calendar;