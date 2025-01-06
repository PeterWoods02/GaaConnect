//add emails
const staff = [
    {
      name: 'John Doe',
      password: 'SecurePassword1!',
      phone_number: '123-456-7890',
      yearsOfExperience: 10,
      subentity: {
        type: 'Manager',
        certifications: ['Certification1', 'Certification2'],
      },
    },
    {
      name: 'Jane Smith',
      password: 'AnotherSecurePassword!',
      phone_number: '987-654-3210',
      yearsOfExperience: 8,
      subentity: {
        type: 'Coach',
        previous_teams: ['Team A', 'Team B'],
      },
    },
    {
      name: 'Mark Johnson',
      password: 'DifferentPassword1!',
      phone_number: '555-555-5555',
      yearsOfExperience: 5,
      subentity: {
        type: 'Physio',
        speciality: 'Sports Rehabilitation',
      },
    },
  ];
  
  export default staff;
  