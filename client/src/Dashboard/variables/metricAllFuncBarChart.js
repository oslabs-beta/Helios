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
  console.log('AWS Get Invocations: ', props.aws.getInvocations);
  console.log('AWS Render: ', props.aws.render);
  console.log('Credentials: ', props.credentials);

  console.log('data before if: ', props.invocationsAllData);
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
  console.log('REQUEST PARAMS: ', reqParams);
  console.log('Props Render before Fetch:', props.aws.render);
  // props.addLambda(reqParams);
  fetch('/aws/getLambdaFunctions', reqParams)
    .then((res) => res.json())
    .then((functions) => {
      props.addLambda(functions);
    })
    .catch((err) => console.log(err));
  //Invocations
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Invocations', reqParams)
    .then((res) => res.json())
    .then((invocationData) => {
      props.addInvocationsAlldata(invocationData);
      console.log(
        'Printing from Inside TestBarChart: ',
        props.invocationsAllData
      );
    })
    .catch((err) => console.log(err));

  //Errors
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Errors', reqParams)
    .then((res) => res.json())
    .then((errorData) => {
      props.addErrorsAlldata(errorData);

      console.log(
        'Printing from Inside Errors Bar Chart: ',
        props.errorsAllData
      );
    })
    .catch((err) => console.log(err));

  //Throttles
  //********************************************************* */

  fetch('/aws/getMetricsAllfunc/Throttles', reqParams)
    .then((res) => res.json())
    .then((throttleData) => {
      props.addThrottlesAlldata(throttleData);

      //COME BACK HERE to check on this

      props.updateFetchTime();

      console.log(
        'Printing from Inside Throttles Bar Chart: ',
        props.throttlesAllData
      );
    })
    .catch((err) => console.log(err));
};

export default metricAllFuncBarChart;
