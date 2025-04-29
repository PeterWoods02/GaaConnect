import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddFixtureModal from "../components/addFixtureModel/index.js";
import { getMatches } from "../api/matchApi.js"; 

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fetchMatches = async () => {

    if (!token) {
      console.warn("No token found. User probably not logged in.");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("User info from token:", decoded);

      const data = await getMatches(token);

      // filter matches where user is involved 
      let filteredMatches = data;
      if (decoded.role === 'admin') {
        // Admin sees everything
        filteredMatches = data;
      } else if (decoded.role === 'coach' || decoded.role === 'manager' || decoded.role === 'player') {
        const managerTeamIds = Array.isArray(decoded.team) ? decoded.team : [decoded.team];
        filteredMatches = data.filter(match =>
          match.team && managerTeamIds.includes(match.team._id || match.team)
        );
      } else {
        // Fan or no team role — show all matches too
        filteredMatches = data;
      }

      const events = filteredMatches.map((match) => ({
        id: match._id,
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

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSelectEvent = (event) => {
    navigate(`/match/${event.id}`);
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <AddFixtureModal 
        isOpen={isModalOpen} 
        onFixtureAdded={fetchMatches}
        token={token}
        onClose={() => setIsModalOpen(false)} 
        onAddEvent={(newEvent) => {
          setEventList((prevList) => [...prevList, newEvent]);
          setIsModalOpen(false);
        }} 
      />

      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, day: true, agenda: true }}
        defaultView="month"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default MyCalendar;
