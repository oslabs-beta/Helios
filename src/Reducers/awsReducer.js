import * as types from '../Constants/actionTypes';
import moment from 'moment';
import Chartist from 'chartist';

const initialState = {
  functions: [],
  render: true,
  functionLogs: [],
  invocationsAllData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {
      axisX: {
        showGrid: true,
      },
      low: 0,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      scaleMinSpace: 15,
    },
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
  let invocationsAllData;
  let series_data;
  let graphOptions;
  let graphPeriod, graphUnits;
  let startTime, endTime;
  let ticks = [];
  let labelFormat;

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
      series_data = action.payload.data.map((xydata) => {
        return { x: new Date(xydata.x), y: xydata.y };
      });
      graphOptions = { ...state.invocationsAllData.options };

      graphOptions.high = Math.max(
        Math.round(action.payload.options.maxInvocations / 100) * 100,
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
      };

      return { ...state, invocationsAllData };
    }
    default: {
      return state;
    }
  }
};
export default awsReducer;
