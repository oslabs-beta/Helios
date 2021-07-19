// ##############################
// // // javascript library for creating charts
// #############################
// var Chartist = require('chartist');
// import Chartist from 'chartist';
import { PinDropSharp } from '@material-ui/icons';
import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
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

// const mapDispatchToProps = (dispatch) => ({
//   addLambda: (functions) => dispatch(actions.addLambda(functions)),
// });

const barChartFunc = (props) => {
  console.log('Credentials inside barChartFunc: ', props.credentials);
  console.log(props.aws.render);

  if (props.aws.render && props.credentials) {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials: props.credentials }),
    };
    fetch('/getLambdaFunctions', reqParams)
      .then((res) => res.json())
      .then((data) => {
        console.log(
          'Data in barchart func and after getting lambda functions: ',
          data
        );
        props.addLambda(data);
      })
      .catch((err) => console.log(err));
  }
  console.log('testing aws state: ', props.aws.functions);
  return {
    data: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]],
    },
    options: {
      axisX: {
        showGrid: false,
      },
      low: 0,
      high: 1000,
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
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
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
