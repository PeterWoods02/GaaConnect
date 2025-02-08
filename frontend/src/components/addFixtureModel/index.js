import { useState } from "react";

const FullscreenForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [matchTitle, setMatchTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");

  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (could be expanded) will be using backend eventually anyways
    if (!matchTitle || !date || !venue || !admissionFee) {
      alert("Please fill out all fields.");
      return;
    }

   // will be sending to api
    console.log({
      matchTitle,
      date,
      venue,
      admissionFee,
    });

    
    setIsOpen(false);
    setMatchTitle("");
    setDate("");
    setVenue("");
    setAdmissionFee("");
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
                <label htmlFor="venue" className="block font-medium">
                  Venue
                </label>
                <input
                  id="venue"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
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
                >
                  Save Fixture
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
