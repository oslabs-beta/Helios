import * as types from '../Constants/actionTypes';
import moment from 'moment';
import Chartist from 'chartist';

// ##############################
// // // variables used to create animation on charts
// #############################
const delays = 80,
  durations = 500;
const delays2 = 80,
  durations2 = 500;

const initialState = {
  functions: [],
  render: true,
  getInvocations:true,
  getErrors:true,
  functionLogs: [],
  graphDefaultOptions: {
    axisX: {
      showGrid: true,
    },
    low: 0,
    high: 100,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    scaleMinSpace: 15,
  },
  graphDefaultResponsiveOptions: [
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
  graphDefaultAnimation: {
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
  invocationsAllData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
  },
  errorsAllData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
  },
};

const generateTicks = (startTime, metricTimeRange, metricTimeUnits) => {
  const ticks = [];

  switch (metricTimeUnits) {
    case 'days': {
      for (let i = 0; i <= metricTimeRange; i++) {
        ticks.push(moment(startTime).add(i, 'days'));
      }
      return ticks;
    }
    case 'hours': {
      for (let i = 0; i <= metricTimeRange; i++) {
        ticks.push(moment(startTime).add(i, 'hours'));
      }
      return ticks;
    }
    case 'minutes': {
      for (let i = 0; i <= metricTimeRange; i += 5) {
        ticks.push(moment(startTime).add(i, 'minutes'));
      }
      return ticks;
    }
    default: {
      return ticks;
    }
  }
};

const awsReducer = (state = initialState, action) => {
  let functions;
  let render;
  let functionLogs;
  // let series_data;
  // let invocationsAllData;
  // let errorsAllData;
  // let graphOptions, graphResponsiveOptions, graphtAnimation;
  // let graphPeriod, graphUnits;
  // let startTime, endTime;
  // let ticks = [];
  // let labelFormat;
  // let getInvocations, getErrors;

  switch (action.type) {
    case types.ADD_LAMBDA: {


      functions = action.payload;
      render = !state.render;
      return { ...state, functions, render };
    }
    case types.ADD_FUNCTION_LOGS: {
      functionLogs = state.functionLogs.slice(0);
      functionLogs.push(action.payload);
      return { ...state, functionLogs };
    }
    case types.REMOVE_FUNCTION_LOGS: {
      functionLogs = state.functionLogs.slice(0);
      for (let i = 0; i < functionLogs.length; i += 1) {
        if (functionLogs[i].name === action.payload) {
          functionLogs.splice(i, 1);
        }
      }
      return { ...state, functionLogs };
    }
    case types.ADD_INVOCATIONS_ALLDATA: {

  let series_data;
  let invocationsAllData;
  let graphOptions, graphResponsiveOptions, graphtAnimation;
  let graphPeriod, graphUnits;
  let startTime, endTime;
  let ticks = [];
  let labelFormat;
  let getInvocations;



      console.log("Inside Add Invocations All Data")



      getInvocations = !state.getInvocations
      series_data = action.payload.data.map((xydata) => {
        return { x: new Date(xydata.x), y: xydata.y };
      });
      graphOptions = { ...state.graphDefaultOptions };
      graphResponsiveOptions =  [...state.graphDefaultResponsiveOptions];
      graphtAnimation = { ...state.graphtDefaultAnimation };

      graphOptions.high = Math.max(
        Math.round(action.payload.options.metricMaxValue / 100) * 100,
        100
      );

      graphPeriod = action.payload.options.graphPeriod;
      graphUnits = action.payload.options.graphUnits;
      startTime = new Date(action.payload.options.startTime);
      endTime = new Date(action.payload.options.endTime);

      ticks = generateTicks(startTime, graphPeriod, graphUnits);

      graphOptions.axisX.ticks = ticks;
      console.log(ticks);

      if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
      else graphOptions.axisX.type = Chartist.FixedScaleAxis;

      //add dummy data for the chart to show up
      series_data.unshift({
        x: moment(startTime).subtract(5, 'minutes'),
        y: null,
      });
      series_data.push({ x: moment(endTime).add(5, 'minutes'), y: null });

      graphOptions.axisX.labelInterpolationFnc = (value) => {
        if (graphUnits === 'days') labelFormat = 'MMM Do';
        if (graphUnits === 'hours') labelFormat = 'LT';
        if (graphUnits === 'minutes') labelFormat = 'LT';

        return moment(value).format(labelFormat);
      };

      invocationsAllData = {
        data: {
          series: [{ name: action.payload.title, data: series_data }],
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
      };

      //console.log("Invocation Data from Reducer: ",errorsAllData )

      return { ...state, invocationsAllData,getInvocations };
    }
    case types.ADD_ERRORS_ALLDATA: {

  let series_data;
  
  let errorsAllData;
  let graphOptions, graphResponsiveOptions, graphtAnimation;
  let graphPeriod, graphUnits;
  let startTime, endTime;
  let ticks = [];
  let labelFormat;
  let  getErrors;



      console.log("Inside Add Erros All Data")

      // let getErrors;
      // let errorsAllData;
  
      getErrors = !state.getErrors
      series_data = action.payload.data.map((xydata) => {
        return { x: new Date(xydata.x), y: xydata.y };
      });
      graphOptions = { ...state.graphDefaultOptions };
      graphResponsiveOptions =  [...state.graphDefaultResponsiveOptions];
      graphtAnimation = { ...state.graphtDefaultAnimation };
  
      graphOptions.high = Math.max(
        Math.round(action.payload.options.metricMaxValue / 100) * 100,
        100
      );
  
      graphPeriod = action.payload.options.graphPeriod;
      graphUnits = action.payload.options.graphUnits;
      startTime = new Date(action.payload.options.startTime);
      endTime = new Date(action.payload.options.endTime);
  
      ticks = generateTicks(startTime, graphPeriod, graphUnits);
  
      graphOptions.axisX.ticks = ticks;
      console.log(ticks);
  
      if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
      else graphOptions.axisX.type = Chartist.FixedScaleAxis;
  
      //add dummy data for the chart to show up
      series_data.unshift({
        x: moment(startTime).subtract(5, 'minutes'),
        y: null,
      });
      series_data.push({ x: moment(endTime).add(5, 'minutes'), y: null });
  
      graphOptions.axisX.labelInterpolationFnc = (value) => {
        if (graphUnits === 'days') labelFormat = 'MMM Do';
        if (graphUnits === 'hours') labelFormat = 'LT';
        if (graphUnits === 'minutes') labelFormat = 'LT';
  
        return moment(value).format(labelFormat);
      };
  
      errorsAllData = {
        data: {
          series: [{ name: action.payload.title, data: series_data }],
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
      };

      console.log("Error Data from reducer: ",errorsAllData )
  
      return { ...state, errorsAllData,getErrors };
    }
    default: {

  let series_data;
  let invocationsAllData;
  let errorsAllData;
  let graphOptions, graphResponsiveOptions, graphtAnimation;
  let graphPeriod, graphUnits;
  let startTime, endTime;
  let ticks = [];
  let labelFormat;
  let getInvocations, getErrors;



      graphOptions = { ...state.graphDefaultOptions };
      graphResponsiveOptions =  [...state.graphDefaultResponsiveOptions];
      graphtAnimation = { ...state.graphtDefaultAnimation };

      invocationsAllData = {
        ...state.invocationsAllData,
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
      };

      errorsAllData = {
        ...state.errorsAllData,
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
      };

       //return { ...state, invocationsAllData, errorsAllData };
     return { ...state, invocationsAllData };
    }
  }
};
export default awsReducer;
