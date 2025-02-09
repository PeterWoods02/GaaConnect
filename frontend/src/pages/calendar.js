import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddFixtureModal from "../components/addFixtureModel/index.js"; 

// Locales for date-fns
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [eventList, setEventList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch matches from backend API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/match");
        const data = await response.json();

        // Transform match data to fit calendar format
        const events = data.map((match) => ({
          id: match._id, // Store match ID for navigation
          title: `${match.matchTitle} - ${match.opposition}`,
          start: new Date(match.date),
          end: new Date(match.date),
          venue: match.location,
          admission: match.admissionFee ? `€${match.admissionFee}` : "Free",
        }));

        setEventList(events);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  // Handle click on event
  const handleSelectEvent = (event) => {
    navigate(`/match/${event.id}`); // Navigate to match details page
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      {/* Fixture Modal */}
      <AddFixtureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddEvent={(newEvent) => {
          setEventList((prevList) => [...prevList, newEvent]);
          setIsModalOpen(false);
        }} 
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
        onSelectEvent={handleSelectEvent} // Handle click event
      />
    </div>
  );
};

export default MyCalendar;
