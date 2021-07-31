import * as types from '../Constants/actionTypes';
import moment from 'moment';
import Chartist from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';

// helper function to generate the X-Axis
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

//////////////////// Initial State for Reducer ////////////////////
const initialState = {
  apiKeys: [],
  apiMetrics: [],
  render: true,
};

/////////////////////////////////////////////////////////////////

const apiReducer = (state = initialState, action) => {
  let apiKeys;
  let render;
  switch (action.type) {
    // add list of APIs to state
    case types.ADD_API_GATEWAYS: {
      apiKeys = action.payload;
      render = false;
      return {
        ...state,
        apiKeys,
        render,
      };
    }

    // once an API is checked and metrics are fetched, add to apiMetrics array for display
    case types.ADD_API_METRIC_CHARTS: {
      let apiMetrics = state.apiMetrics.slice(0);
      let newMetricObj = {
        name: action.payload.name,
      };
      // loop through action.payload.metrics as the four metrics exist as an array on the api object
      for (let i = 0; i < action.payload.metrics.length; i += 1) {
        let series_data;
        let graphOptions, graphResponsiveOptions, graphAnimation;
        let graphPeriod, graphUnits;
        let startTime, endTime;
        let ticks = [];
        let labelFormat;
        let total = 0;
        let delays2 = 80,
          durations2 = 500;

        let currMetric = action.payload.metrics[i];

        // map the data to make the x,y coordinates
        series_data = currMetric.data.map((xydata) => {
          total += xydata.y;
          return { x: new Date(xydata.x), y: xydata.y };
        });
        graphOptions = {
          axisX: {
            showGrid: true,
          },
          low: 0,
          high: 100,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 20,
          },
          scaleMinSpace: 15,
          plugins: [
            ChartistTooltip({ anchorToPoint: true, appendToBody: true }),
          ],
        };
        graphOptions.high = Math.round(currMetric.options.maxValue) + 15;

        graphResponsiveOptions = [
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
        ];
        graphAnimation = {
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
        };

        graphPeriod = currMetric.options.graphPeriod;
        graphUnits = currMetric.options.graphUnits;
        startTime = new Date(currMetric.options.startTime);
        endTime = new Date(currMetric.options.endTime);

        // user helper function to create X-Axis
        ticks = generateTicks(startTime, graphPeriod, graphUnits);

        graphOptions.axisX.ticks = ticks;
        if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
        else graphOptions.axisX.type = Chartist.FixedScaleAxis;

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

        newMetricObj[currMetric.metricType] = {
          data: { series: [{ name: currMetric.title, data: series_data }] },
          options: graphOptions,
          responsiveOptions: graphResponsiveOptions,
          animation: graphAnimation,
          total,
        };
      }
      // push new metric object onto apiMetrics array
      // APIGateway.js loops through apiMetrics and displays each card which then holds each chart
      apiMetrics.push(newMetricObj);
      return {
        ...state,
        apiMetrics,
      };
    }

    // after an API is unchecked, remove from array
    case types.REMOVE_API_METRIC_CHARTS: {
      let apiMetrics = state.apiMetrics.slice(0);

      for (let i = 0; i < apiMetrics.length; i += 1) {
        if (apiMetrics[i].name === action.payload) {
          apiMetrics.splice(i, 1);
        }
      }
      return {
        ...state,
        apiMetrics,
      };
    }

    // if time period is updated, loop through and update each currently displayed chart
    case types.UPDATE_API_METRIC_CHARTS: {
      let apiMetrics = [];

      for (let j = 0; j < action.payload.length; j += 1) {
        let newMetricObj = {
          name: action.payload[j].name,
        };
        // loop through action.payload.metrics
        for (let i = 0; i < action.payload[j].metrics.length; i += 1) {
          let series_data;
          let graphOptions, graphResponsiveOptions, graphAnimation;
          let graphPeriod, graphUnits;
          let startTime, endTime;
          let ticks = [];
          let labelFormat;
          let total = 0;
          let delays2 = 80,
            durations2 = 500;

          let currMetric = action.payload[j].metrics[i];

          series_data = currMetric.data.map((xydata) => {
            total += xydata.y;
            return { x: new Date(xydata.x), y: xydata.y };
          });
          graphOptions = {
            axisX: {
              showGrid: true,
            },
            low: 0,
            high: 100,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 5,
            },
            scaleMinSpace: 15,
            plugins: [
              ChartistTooltip({ anchorToPoint: true, appendToBody: true }),
            ],
          };
          graphOptions.high = Math.round(currMetric.options.maxValue) + 15;

          graphResponsiveOptions = [
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
          ];
          graphAnimation = {
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
          };

          graphPeriod = currMetric.options.graphPeriod;
          graphUnits = currMetric.options.graphUnits;
          startTime = new Date(currMetric.options.startTime);
          endTime = new Date(currMetric.options.endTime);

          ticks = generateTicks(startTime, graphPeriod, graphUnits);

          graphOptions.axisX.ticks = ticks;
          if (!ticks.length) graphOptions.axisX.type = Chartist.AutoScaleAxis;
          else graphOptions.axisX.type = Chartist.FixedScaleAxis;

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

          newMetricObj[currMetric.metricType] = {
            data: { series: [{ name: currMetric.title, data: series_data }] },
            options: graphOptions,
            responsiveOptions: graphResponsiveOptions,
            animation: graphAnimation,
            total,
          };
        }
        apiMetrics.push(newMetricObj);
      }
      return {
        ...state,
        apiMetrics,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default apiReducer;
