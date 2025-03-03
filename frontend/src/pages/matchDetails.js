import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchById } from '../api/matchApi.js'; 

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch match details from backend
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!id) {
        console.error("Match ID is missing!");
        setLoading(false);
        return;
      }
      
      try {
        const data = await getMatchById(id);  
        setMatch(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (loading) return <p>Loading match details...</p>;
  if (!match) return <p>Match not found</p>;

  const navigateToMatchDay = () => {
    
    navigate(`/match/live/${id}`);
  };

  const navigateToSquad = () => {
    navigate(`/match/team/${id}`); 
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{match.matchTitle}</h1>
      <p><strong>Opposition:</strong> {match.opposition}</p>
      <p><strong>Location:</strong> {match.location}</p>
      <p><strong>Date:</strong> {new Date(match.date).toLocaleString()}</p>
      <p><strong>Admission:</strong> {match.admissionFee ? `€${match.admissionFee}` : "Free"}</p>

      {/* If scores exist, show them */}
      {match.score && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Score</h2>
          <p><strong>{match.matchTitle}:</strong> {match.score.teamGoals}-{match.score.teamPoints}</p>
          <p><strong>{match.opposition}:</strong> {match.score.oppositionGoals}-{match.score.oppositionPoints}</p>
        </div>
      )}

      {/* Button to navigate to MatchDay page 
      {match.status === 'upcoming' && (
        <button onClick={navigateToMatchDay} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Start Live Match
        </button>
      )}
        */}

        <button onClick={navigateToMatchDay} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Start Live Match
      </button>
    

    <div className="mt-4 flex justify-center">
        <button 
          onClick={navigateToSquad} 
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition duration-300"
        >
          View Match Day Squad
        </button>
      </div>
      </div>
  );
};

export default MatchDetails;
