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
  renderbyfunc: true,
  lastMetricFetchTime: new Date(),
  getInvocations: true,
  getThrottles: true,
  getErrors: true,
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
  invocationsByFuncData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
    total: 0,
  },
  errorsAllData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
    total: 0,
  },
  throttlesAllData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
    total: 0,
  },
};

const generateTicks = (startTime, metricTimeRange, metricTimeUnits) => {
  const ticks = [];

  switch (metricTimeUnits) {
    case 'days': {
      if (metricTimeRange <= 14) {
        for (let i = 0; i <= metricTimeRange; i++) {
          ticks.push(moment(startTime).add(i, 'days'));
        }
      } else if (metricTimeRange <= 30) {
        for (let i = 0; i <= metricTimeRange + 1; i += 3) {
          ticks.push(moment(startTime).add(i, 'days'));
        }
      } else if (metricTimeRange > 30) {
        for (let i = 0; i <= metricTimeRange + 1; i += 5) {
          ticks.push(moment(startTime).add(i, 'days'));
        }
      }

      return ticks;
    }
    case 'hours': {
      if (metricTimeRange <= 10) {
        for (let i = 0; i <= metricTimeRange; i++) {
          ticks.push(moment(startTime).add(i, 'hours'));
        }
      } else if (metricTimeRange <= 24) {
        for (let i = 0; i <= metricTimeRange + 1; i += 3) {
          ticks.push(moment(startTime).add(i, 'hours'));
        }
      } else if (metricTimeRange > 24) {
        for (let i = 0; i <= metricTimeRange + 1; i += 6) {
          ticks.push(moment(startTime).add(i, 'hours'));
        }
      }
      return ticks;
    }
    case 'minutes': {
      if (metricTimeRange < 30) {
        for (let i = 0; i <= metricTimeRange; i += 5) {
          ticks.push(moment(startTime).add(i, 'minutes'));
        }
      } else if (metricTimeRange > 30) {
        for (let i = 0; i <= metricTimeRange; i += 10) {
          ticks.push(moment(startTime).add(i, 'minutes'));
        }
      }
      return ticks;
    }
    default: {
      return ticks;
    }
  }
};

const awsReducerByFunc = (state = initialState, action) => {
  let renderbyfunc;

  let lastMetricFetchTime;

  switch (action.type) {
    case types.UPDATE_RENDER_BYFUNC: {
      renderbyfunc = true;
      return { ...state, renderbyfunc };
    }

    case types.UPDATE_FETCH_TIME_BYFUNC: {
      lastMetricFetchTime = new Date();
      return { ...state, lastMetricFetchTime };
    }

    case types.ADD_INVOCATIONS_BYFUNCDATA: {
      let series_data;
      let invocationsByFuncData;
      let graphOptions, graphResponsiveOptions, graphtAnimation;
      let graphPeriod, graphUnits;
      let startTime, endTime;
      let ticks = [];
      let labelFormat;
      let getInvocations;
      let total = 0;

      console.log('Inside Add Invocations All Data');

      getInvocations = !state.getInvocations;

      series_data = action.payload.series.map((metricData) => {
        let name = metricData;

        let data = metricData.data.map((xydata) => {
          return { x: new Date(xydata.x), y: xydata.y };
        });
        return {
          name: name,
          data: data,
        };
      });

      graphOptions = { ...state.graphDefaultOptions };
      graphResponsiveOptions = [...state.graphDefaultResponsiveOptions];
      graphtAnimation = { ...state.graphtDefaultAnimation };

      graphOptions.high = Math.max(
        Math.round(action.payload.options.metricMaxValueAllFunc / 100) * 100,
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
      series_data.push({
        name: 'dummy',
        data: [
          { x: moment(startTime).subtract(5, 'minutes'), y: null },
          { x: moment(endTime).add(5, 'minutes'), y: null },
        ],
      });

      graphOptions.axisX.labelInterpolationFnc = (value) => {
        if (graphUnits === 'days') labelFormat = 'MMM Do';
        if (graphUnits === 'hours') labelFormat = 'LT';
        if (graphUnits === 'minutes') labelFormat = 'LT';

        return moment(value).format(labelFormat);
      };

      action.payload.data.forEach((dataPt) => {
        total += dataPt.y;
      });

      invocationsByFuncData = {
        data: {
          series: series_data,
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
        total,
      };

      //console.log("Invocation Data from Reducer: ",errorsAllData )

      return { ...state, invocationsByFuncData, getInvocations };
    }
    // case types.ADD_ERRORS_BYFUNCDATA: {
    //   let series_data;

    //   let errorsAllData;
    //   let graphOptions, graphResponsiveOptions, graphtAnimation;
    //   let graphPeriod, graphUnits;
    //   let startTime, endTime;
    //   let ticks = [];
    //   let labelFormat;
    //   let getErrors;
    //   let total = 0;
    //   console.log('Inside Add Erros All Data');

    //   // let getErrors;
    //   // let errorsAllData;

    //   getErrors = !state.getErrors;
    //   series_data = action.payload.data.map((xydata) => {
    //     return { x: new Date(xydata.x), y: xydata.y };
    //   });
    //   graphOptions = { ...state.graphDefaultOptions };
    //   graphResponsiveOptions = [...state.graphDefaultResponsiveOptions];
    //   graphtAnimation = { ...state.graphtDefaultAnimation };

    //   graphOptions.high = Math.max(
    //     Math.round(action.payload.options.metricMaxValue / 100) * 100,
    //     100
    //   );

    //   graphPeriod = action.payload.options.graphPeriod;
    //   graphUnits = action.payload.options.graphUnits;
    //   startTime = new Date(action.payload.options.startTime);
    //   endTime = new Date(action.payload.options.endTime);

    //   ticks = generateTicks(startTime, graphPeriod, graphUnits);

    //   graphOptions.axisX.ticks = ticks;
    //   console.log(ticks);

    //   if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
    //   else graphOptions.axisX.type = Chartist.FixedScaleAxis;

    //   //add dummy data for the chart to show up
    //   series_data.unshift({
    //     x: moment(startTime).subtract(5, 'minutes'),
    //     y: null,
    //   });
    //   series_data.push({ x: moment(endTime).add(5, 'minutes'), y: null });

    //   graphOptions.axisX.labelInterpolationFnc = (value) => {
    //     if (graphUnits === 'days') labelFormat = 'MMM Do';
    //     if (graphUnits === 'hours') labelFormat = 'LT';
    //     if (graphUnits === 'minutes') labelFormat = 'LT';

    //     return moment(value).format(labelFormat);
    //   };

    //   action.payload.data.forEach((dataPt) => {
    //     total += dataPt.y;
    //   });

    //   errorsAllData = {
    //     data: {
    //       series: [{ name: action.payload.title, data: series_data }],
    //     },
    //     options: graphOptions,
    //     responsiveOptions: graphResponsiveOptions,
    //     animation: graphtAnimation,
    //     total,
    //   };

    //   console.log('Error Data from reducer: ', errorsAllData);

    //   return { ...state, errorsAllData, getErrors };
    // }

    // case types.ADD_THROTTLES_BYFUNCDATA: {
    //   let series_data;

    //   let throttlesAllData;
    //   let graphOptions, graphResponsiveOptions, graphtAnimation;
    //   let graphPeriod, graphUnits;
    //   let startTime, endTime;
    //   let ticks = [];
    //   let labelFormat;
    //   let getThrottles;
    //   let total = 0;

    //   console.log('Inside Add Throttles All Data');

    //   // let getThrottles;
    //   // let throttlesAllData;

    //   getThrottles = !state.getThrottles;
    //   series_data = action.payload.data.map((xydata) => {
    //     return { x: new Date(xydata.x), y: xydata.y };
    //   });
    //   graphOptions = { ...state.graphDefaultOptions };
    //   graphResponsiveOptions = [...state.graphDefaultResponsiveOptions];
    //   graphtAnimation = { ...state.graphtDefaultAnimation };

    //   graphOptions.high = Math.max(
    //     Math.round(action.payload.options.metricMaxValue / 100) * 100,
    //     100
    //   );

    //   graphPeriod = action.payload.options.graphPeriod;
    //   graphUnits = action.payload.options.graphUnits;
    //   startTime = new Date(action.payload.options.startTime);
    //   endTime = new Date(action.payload.options.endTime);

    //   ticks = generateTicks(startTime, graphPeriod, graphUnits);

    //   graphOptions.axisX.ticks = ticks;
    //   console.log(ticks);

    //   if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
    //   else graphOptions.axisX.type = Chartist.FixedScaleAxis;

    //   //add dummy data for the chart to show up
    //   series_data.unshift({
    //     x: moment(startTime).subtract(5, 'minutes'),
    //     y: null,
    //   });
    //   series_data.push({ x: moment(endTime).add(5, 'minutes'), y: null });

    //   graphOptions.axisX.labelInterpolationFnc = (value) => {
    //     if (graphUnits === 'days') labelFormat = 'MMM Do';
    //     if (graphUnits === 'hours') labelFormat = 'LT';
    //     if (graphUnits === 'minutes') labelFormat = 'LT';

    //     return moment(value).format(labelFormat);
    //   };

    //   action.payload.data.forEach((dataPt) => {
    //     total += dataPt.y;
    //   });

    //   throttlesAllData = {
    //     data: {
    //       series: [{ name: action.payload.title, data: series_data }],
    //     },
    //     options: graphOptions,
    //     responsiveOptions: graphResponsiveOptions,
    //     animation: graphtAnimation,
    //     total,
    //   };

    //   console.log('Throttle Data from reducer: ', throttlesAllData);
    //   renderbyfunc = false;

    //   return { ...state, throttlesAllData, getThrottles, renderbyfunc };
    // }

    default: {
      return { ...state };
    }
  }
};
export default awsReducerByFunc;
