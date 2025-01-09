import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to GAA Connect</h1>
      <p style={styles.text}>
        This is a demo application 
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    margin: '20px 0',
  },
  text: {
    fontSize: '1.2rem',
    maxWidth: '600px',
  },
};

export default Home;
