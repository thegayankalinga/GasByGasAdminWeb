import React from 'react';
import ReactLoading from 'react-loading';

const LoadingScreen = () => {
  return (
    <div className="center-container"> 
    <ReactLoading type="spin" color="blue" /> 
  </div>
  );
};

export default LoadingScreen;