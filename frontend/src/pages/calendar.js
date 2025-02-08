import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddFixtureModal from "../components/addFixtureModel/index.js"; 

// Locale setup for the calendar
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

// Localizer setup for date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Initial events
const initialEvents = [
  {
    title: "Portlaw vs Ballyduff",
    start: new Date(2025, 1, 10, 15, 0),
    end: new Date(2025, 1, 10, 17, 0),
    venue: "Portlaw",
    admission: "€5",
  },
  {
    title: "Portlaw vs Tallow",
    start: new Date(2025, 1, 15, 18, 0),
    end: new Date(2025, 1, 15, 20, 0),
    venue: "Portlaw",
    admission: "€7",
  },
];

const MyCalendar = () => {
  const [eventList, setEventList] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal

  // Add new event to the event list
  const addEvent = (newEvent) => {
    setEventList((prevList) => [...prevList, newEvent]);
    setIsModalOpen(false); // Close the modal after adding an event
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      

      {/* Fixture Modal */}
      <AddFixtureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddEvent={addEvent} // Pass addEvent function to modal
      />

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, day: true, agenda: true }}
        defaultView="month"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default MyCalendar;
