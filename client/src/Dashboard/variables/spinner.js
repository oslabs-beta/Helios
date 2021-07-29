import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';

export const Spinner = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div className='spinner'>
      <Loader type='ThreeDots' color='#4caf50' height='100' width='100' />
    </div>
  );
};
