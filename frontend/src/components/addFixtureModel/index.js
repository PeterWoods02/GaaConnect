import { useState, useEffect } from "react";
import { createMatch } from "../../api/matchApi.js"; 
import { getTeams } from "../../api/teamsApi.js"; 

const FullscreenForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [matchTitle, setMatchTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [opposition, setOpposition] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(""); 
  const [teams, setTeams] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  // Fetch the teams when the component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamList = await getTeams();
        setTeams(teamList); 
      } catch (error) {
        setError("Failed to fetch teams. Please try again.");
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!matchTitle || !date || !location || !opposition || !admissionFee || !selectedTeam) {
      alert("Please fill out all fields.");
      return;
    }

    // Prepare match data to send to the API
    const matchData = {
      matchTitle,
      date,
      location,
      opposition,
      admissionFee,
      team: selectedTeam, 
    };

    try {
      setLoading(true);
      setError(""); 

      // Send match data to the backend API
      const newMatch = await createMatch(matchData);
      console.log("New match created:", newMatch);

      // Close form and reset fields after successful creation
      setIsOpen(false);
      setMatchTitle("");
      setDate("");
      setLocation("");
      setOpposition("");
      setAdmissionFee("");
      setSelectedTeam(""); 

      
      alert("Match created successfully!");
    } catch (error) {
      console.error("Error creating match:", error);
      setError("Failed to create match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to Open Popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Fixture
      </button>

      {/* Fullscreen Overlay (Only visible when isOpen is true) */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Fixture</h2>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="matchTitle" className="block font-medium">
                  Match Title
                </label>
                <input
                  id="matchTitle"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block font-medium">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block font-medium">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="opposition" className="block font-medium">
                  Opposition
                </label>
                <input
                  id="opposition"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={opposition}
                  onChange={(e) => setOpposition(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="admissionFee" className="block font-medium">
                  Admission Fee (€)
                </label>
                <input
                  id="admissionFee"
                  type="number"
                  className="w-full p-2 border rounded"
                  value={admissionFee}
                  onChange={(e) => setAdmissionFee(e.target.value)}
                  required
                />
              </div>

              {/* Dropdown for selecting team */}
              <div className="mb-4">
                <label htmlFor="team" className="block font-medium">
                  Select Team
                </label>
                <select
                  id="team"
                  className="w-full p-2 border rounded"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  required
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show error message if any */}
              {error && <div className="text-red-600 mb-4">{error}</div>}

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={loading} // Disable the button when loading
                >
                  {loading ? "Saving..." : "Save Fixture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenForm;
