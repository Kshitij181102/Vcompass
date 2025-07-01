import React from 'react';
import Spinner from './Spinner';

const LoadingButton = ({ loading, title }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {loading && <Spinner />}
      <span className="text-white font-medium">
        {loading ? "Please wait..." : title}
      </span>
    </div>
  );
};

export default LoadingButton;
