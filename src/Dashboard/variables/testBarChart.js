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

const barChartFunc = (props) => {
  console.log('Credentials inside barChartFunc: ', props.credentials);
  console.log(props.aws.render);
  // let data = { labels: [], series: [[]] };
  let [userData, setData] = useState({
    labels: [],
    series: [[]],
  });
  console.log('data before if: ', userData);
  if (props.aws.render && props.credentials) {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials: props.credentials }),
    };
    fetch('/getLambdaFunctions', reqParams)
      .then((res) => res.json())
      .then((functions) => {
        props.addLambda(functions);
      })
      .catch((err) => console.log(err));

    fetch('/getLambdaInvocationsAllfunc', reqParams)
      .then((res) => res.json())
      .then((invocationData) => {
        setData({
          labels: invocationData.labels,
          series: invocationData.series,
        });
      })
      .catch((err) => console.log(err));

    // setData({
    //   labels: jsonLambdaInvocations.labels,
    //   series: jsonLambdaInvocations.series,
    // });

    //   .then((data) => {
    //     console.log(
    //       'Data in the barchart and after getting the Invocations for all Lambda Func: ',
    //       data
    //     );
    //   })
    //   .catch((err) => console.log(err));
  }
  return {
    data: userData,
    options: {
      axisX: {
        showGrid: false,
      },
      low: 0,
      high: 2000,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0,
      },
    },
    responsiveOptions: [
      [
        'screen and (max-width: 640px)',
        {
          // seriesBarDistance: 5,
          axisX: {
            divisor: 5,
            type: Chartist.FixedScaleAxis,
            labelInterpolationFnc: function (value) {
              // return value[0];
              return moment(value[0]).format('MMM Do YY');
            },
          },
        },
      ],
    ],
    animation: {
      draw: function (data) {
        if (data.type === 'bar') {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: 'ease',
            },
          });
        }
      },
    },
  };
};

export default barChartFunc;
