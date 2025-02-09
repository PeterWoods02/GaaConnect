import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MatchDetails = () => {
  const { id } = useParams(); 
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch match details from backend
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/match/${id}`);
        const data = await response.json();
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
    </div>
  );
};

export default MatchDetails;
