import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchById, deleteMatch } from '../api/matchApi.js'; 
import { toast } from 'react-toastify';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const handleDeleteMatch = async () => {
    try {
      const token = localStorage.getItem('token'); 
      await deleteMatch(id, token);
  
      toast.success('✅ Match deleted successfully!');
      setTimeout(() => {
        navigate('/calendar');  
      }, 1000);
    } catch (error) {
      console.error('Failed to delete match:', error);
      toast.error('❌ Failed to delete match. Please try again.');
    }
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

        {/* Match buttons */}
      <div className="mt-4 flex justify-center gap-4">
        <button 
          onClick={navigateToSquad} 
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition duration-300"
        >
          View Match Day Squad
        </button>

        <button 
          onClick={navigateToMatchDay} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-xl hover:bg-blue-700 transition duration-300"
        >
          Start Live Match
        </button>

        <button 
          onClick={() => setShowModal(true)} 
          className="px-6 py-3 bg-red-600 text-white rounded-lg text-xl hover:bg-red-700 transition duration-300"
        >
          Delete Match
        </button>
      </div>

      {showModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this match? This cannot be undone.</p>

            <div className="delete-modal-buttons">
              <button className="confirm-delete" onClick={handleDeleteMatch}>Delete</button>
              <button className="cancel-delete" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
