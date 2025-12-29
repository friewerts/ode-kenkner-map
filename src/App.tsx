import React from 'react';
import MapComponent from './components/Map/Map';
import addresses from './data/addresses.json';
import logo from './assets/logo.svg';

const App: React.FC = () => {
  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 10, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(73, 101, 76, 0.8) 0%, rgba(73, 101, 76, 0) 100%)',
        pointerEvents: 'none'
      }}>
        <img 
          src={logo} 
          alt="Oldsum Logo" 
          style={{ 
            height: '28px', 
            filter: 'brightness(0) invert(1)',
            pointerEvents: 'auto'
          }} 
        />
      </header>
      <MapComponent addresses={addresses} />
    </div>
  );
};

export default App;
