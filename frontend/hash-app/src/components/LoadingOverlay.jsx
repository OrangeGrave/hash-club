import React from 'react';

const LoadingOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',    // любой цвет фона вместо белого
    zIndex: 9999,              // поверх всего
  }}/>
);

export default LoadingOverlay;