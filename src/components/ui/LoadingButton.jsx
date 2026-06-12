import React from 'react';
import Spinner from './Spinner';

const LoadingButton = ({ loading, title }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    {loading && <Spinner />}
    <span>{loading ? 'Please wait…' : title}</span>
  </span>
);

export default LoadingButton;
