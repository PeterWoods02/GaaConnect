import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: 'Portlaw vs Ballyduff',
    start: new Date(2025, 1, 10, 15, 0), // Feb 10, 3:00 PM
    end: new Date(2025, 1, 10, 17, 0),   // Ends at 5:00 PM
    venue: 'Portlaw',
    admission: '€5',
  },
  {
    title: 'Portlaw vs Tallow',
    start: new Date(2025, 1, 15, 18, 0), // Feb 15, 6:00 PM
    end: new Date(2025, 1, 15, 20, 0),   // Ends at 8:00 PM
    venue: 'Portlaw',
    admission: '€7',
  },
  {
    title: 'Portlaw vs Abbeyside',
    start: new Date(2025, 1, 20, 14, 0), // Feb 20, 2:00 PM
    end: new Date(2025, 1, 20, 16, 0),   // Ends at 4:00 PM
    venue: 'Dungarvan',
    admission: '€6',
  },
];


const MyCalendar = () => {
  const [eventList, setEventList] = useState(events);

  const eventStyleGetter = (event) => {
    return {
      className: 'my-custom-event',
      style: {
        backgroundColor: '#0f31f5', 
      },
    };
  };

  const eventContent = (event) => {
    return (
      <div>
        <strong>{event.title}</strong>
        <br />
        <span>{`Admission: ${event.admission}`}</span> 
      </div>
    );
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, day: true, agenda: true }}
        defaultView="month"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: eventContent, 
        }}
      />
    </div>
  );
};


export default MyCalendar;
