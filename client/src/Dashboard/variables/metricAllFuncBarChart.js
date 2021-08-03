// ##############################
// // // javascript library for creating charts
// #############################
// var Chartist = require('chartist');
// import Chartist from 'chartist';
import { PinDropSharp } from '@material-ui/icons';
import React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Chartist from 'chartist';
import getRegionIDB from '../../indexedDB/getRegionIDB';
import { useLiveQuery } from 'dexie-react-hooks';

// ##############################
// // // variables used to create animation on charts
// #############################
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;

// ##############################
// // // Email Subscriptions
// #############################

const metricAllFuncBarChart = (props, timePeriod, region) => {
  // if (props.aws.render && props.credentials) {

  const reqParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credentials: props.credentials,
      timePeriod: timePeriod,
      region: region,
    }),
  };

  props.addLambda(reqParams);

  //Invocations
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Invocations', reqParams)
    .then((res) => res.json())
    .then((invocationData) => {
      props.addInvocationsAlldata(invocationData);
    })
    .catch((err) => console.error(err));

  //Errors
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Errors', reqParams)
    .then((res) => res.json())
    .then((errorData) => {
      props.addErrorsAlldata(errorData);
    })
    .catch((err) => console.error(err));

  //Throttles
  //********************************************************* */

  fetch('/aws/getMetricsAllfunc/Throttles', reqParams)
    .then((res) => res.json())
    .then((throttleData) => {
      props.addThrottlesAlldata(throttleData);

      props.updateFetchTime();
    })
    .catch((err) => console.error(err));
};

export default metricAllFuncBarChart;
