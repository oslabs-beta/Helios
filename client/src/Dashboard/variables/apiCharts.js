import Chartist from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
const moment = require('moment');

var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;

export const latencyChart = {
  options: {
    axisX: {
      showGrid: false,
    },
    low: 0,
    high: 4000,
    chartPadding: {
      top: 0,
      right: 5,
      bottom: 0,
      left: 0,
    },
    plugins: [ChartistTooltip({ anchorToPoint: true, appendToBody: true })],
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
