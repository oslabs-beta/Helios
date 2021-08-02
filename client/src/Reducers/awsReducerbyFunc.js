import * as types from '../Constants/actionTypes';
import moment from 'moment';
import Chartist from 'chartist';
//require ('chartist-plugin-legend')
//require('chartist-plugin-tooltips')
//require('chartist-plugin-legend')
// ##############################
// // // variables used to create animation on charts
// #############################
const delays = 80,
  durations = 500;
const delays2 = 80,
  durations2 = 500;

const initialState = {
  renderByFunc: true,
  byFuncLoading: false,
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
    plugins: [
      // Chartist.plugins.legend(),
      // Chartist.plugins.tooltip({appendToBody: false}),
    ],
    scaleMinSpace: 15,
    legendNames: [],
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
      //labels:[],
    },
    options: {},

    responsiveOptions: [],
    animation: {},
    total: 0,
  },
  errorsByFuncData: {
    data: {
      series: [{ name: '', data: [] }],
    },
    options: {},
    responsiveOptions: [],
    animation: {},
    total: 0,
  },
  throttlesByFuncData: {
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
  let plugins;
  let renderByFunc;
  let legendNames;
  let byFuncLoading;

  let lastMetricFetchTime;

  switch (action.type) {
    case types.UPDATE_RENDER_BYFUNC: {
      renderByFunc = true;
      let throttlesByFuncData = { ...initialState.throttlesByFuncData };
      let errorsByFuncData = { ...initialState.errorsByFuncData };
      let invocationsByFuncData = { ...initialState.invocationsByFuncData };
      return {
        ...state,
        renderByFunc,
        throttlesByFuncData,
        errorsByFuncData,
        invocationsByFuncData,
      };
    }
    case types.UPDATE_BY_FUNCTION_LOADING: {
      byFuncLoading = true;
      return { ...state, byFuncLoading };
    }

    case types.HANDLE_LOGOUT: {
      return {
        ...initialState,
      };
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

      console.log('Inside Add Invocations All Data');

      getInvocations = false;

      series_data = action.payload.series.map((metricData) => {
        let name = metricData.name;
        let total = metricData.total;

        let data = metricData.data.map((xydata) => {
          return { x: new Date(xydata.x), y: xydata.y };
        });
        return {
          name: name,
          total: total,
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

      // plugins = [
      //     Chartist.plugins.legend({
      //         clickable: false
      //     })
      // ];
      graphOptions.legendNames = action.payload.options.funcNames;

      invocationsByFuncData = {
        data: {
          series: series_data,
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
        // plugins:plugins
      };

      //console.log("Invocation Data from Reducer: ",errorsAllData )

      return { ...state, invocationsByFuncData, getInvocations };
    }

    case types.ADD_ERRORS_BYFUNCDATA: {
      let series_data;
      let errorsByFuncData;
      let graphOptions, graphResponsiveOptions, graphtAnimation;
      let graphPeriod, graphUnits;
      let startTime, endTime;
      let ticks = [];
      let labelFormat;
      let getErrors;

      console.log('Inside Add Errors All Data');

      getErrors = false;

      series_data = action.payload.series.map((metricData) => {
        let name = metricData.name;
        let total = metricData.total;

        let data = metricData.data.map((xydata) => {
          return { x: new Date(xydata.x), y: xydata.y };
        });
        return {
          name: name,
          total: total,
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

      // plugins = [
      //     Chartist.plugins.legend({
      //         clickable: false
      //     })
      // ];
      graphOptions.legendNames = action.payload.options.funcNames;

      errorsByFuncData = {
        data: {
          series: series_data,
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
        // plugins:plugins
      };

      //console.log("Error Data from Reducer: ",errorsAllData )

      return { ...state, errorsByFuncData, getErrors };
    }

    case types.ADD_THROTTLES_BYFUNCDATA: {
      let series_data;
      let throttlesByFuncData;
      let graphOptions, graphResponsiveOptions, graphtAnimation;
      let graphPeriod, graphUnits;
      let startTime, endTime;
      let ticks = [];
      let labelFormat;
      let getThrottles;

      console.log('Inside Add Throttles All Data');

      getThrottles = false;

      series_data = action.payload.series.map((metricData) => {
        let name = metricData.name;
        let total = metricData.total;

        let data = metricData.data.map((xydata) => {
          return { x: new Date(xydata.x), y: xydata.y };
        });
        return {
          name: name,
          total: total,
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

      // plugins = [
      //     Chartist.plugins.legend({
      //         clickable: false
      //     })
      // ];
      graphOptions.legendNames = action.payload.options.funcNames;

      throttlesByFuncData = {
        data: {
          series: series_data,
        },
        options: graphOptions,
        responsiveOptions: graphResponsiveOptions,
        animation: graphtAnimation,
        // plugins:plugins
      };

      //console.log("Throttle Data from Reducer: ",throttlesAllData )
      renderByFunc = false;
      byFuncLoading = false;
      return {
        ...state,
        throttlesByFuncData,
        getThrottles,
        renderByFunc,
        byFuncLoading,
      };
    }

    default: {
      return { ...state };
    }
  }
};
export default awsReducerByFunc;
