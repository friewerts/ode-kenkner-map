import React from 'react';
import MapComponent from './components/Map/Map';
import addresses from './data/addresses.json';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          margin: 0,
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Oldsum
        </h1>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Friesisch und Gut</p>
      </header>
      <main style={{ flex: 1 }}>
        <MapComponent addresses={addresses} />
      </main>
    </div>
  );
};

export default App;
