const { REGION } = require('../Credentials/libs/stsClient.js');
const APIUtilFunc = require('./utils/APIUtilFunc');
const {
  CloudWatchClient,
  GetMetricDataCommand,
  ListDashboardsCommand,
} = require('@aws-sdk/client-cloudwatch');

const updateApiMetrics = async (req, res, next) => {
  let graphPeriod, graphUnits;
  if (req.body.newTimePeriod === '30min') {
    [graphPeriod, graphUnits] = [30, 'minutes'];
  } else if (req.body.newTimePeriod === '1hr') {
    [graphPeriod, graphUnits] = [60, 'minutes'];
  } else if (req.body.newTimePeriod === '24hr') {
    [graphPeriod, graphUnits] = [24, 'hours'];
  } else if (req.body.newTimePeriod === '7d') {
    [graphPeriod, graphUnits] = [7, 'days'];
  } else if (req.body.newTimePeriod === '14d') {
    [graphPeriod, graphUnits] = [14, 'days'];
  } else if (req.body.newTimePeriod === '30d') {
    [graphPeriod, graphUnits] = [30, 'days'];
  }

  const updatedApiMetrics = [];
  for (let i = 0; i < req.body.apiList.length; i += 1) {
    const currApi = req.body.apiList[i].name;
    const newMetricObj = await loopFunc(
      currApi,
      graphPeriod,
      graphUnits,
      req.body.credentials
    );
    updatedApiMetrics.push(newMetricObj);
  }
  res.locals.apiMetrics = updatedApiMetrics;
  return next();
};

module.exports = updateApiMetrics;

const loopFunc = async (currApi, graphPeriod, graphUnits, credentials) => {
  const cwClient = new CloudWatchClient({
    region: REGION,
    credentials: credentials,
  });

  const latencyParams = APIUtilFunc.getAPIMetrics(
    graphPeriod,
    graphUnits,
    currApi,
    'Latency'
  );

  const countParams = APIUtilFunc.getAPIMetrics(
    graphPeriod,
    graphUnits,
    currApi,
    'Count',
    'SampleCount'
  );

  const fiveXXParams = APIUtilFunc.getAPIMetrics(
    graphPeriod,
    graphUnits,
    currApi,
    '5XXError'
  );

  const fourXXParams = APIUtilFunc.getAPIMetrics(
    graphPeriod,
    graphUnits,
    currApi,
    '4XXError'
  );
  const allApiMetrics = [];
  try {
    const latencyMetrics = await cwClient.send(
      new GetMetricDataCommand(latencyParams)
    );

    const latencyData = latencyMetrics.MetricDataResults[0].Timestamps.map(
      (timeStamp, index) => {
        return {
          x: timeStamp,
          y: latencyMetrics.MetricDataResults[0].Values[index],
        };
      }
    );

    const latencyMaxValue = Math.max(
      ...latencyMetrics.MetricDataResults[0].Values,
      0
    );

    const latencyDataPoints = {
      title: latencyMetrics.MetricDataResults[0].Label,
      metricType: 'Latency',
      data: latencyData.reverse(),
      secondData: latencyMetrics.MetricDataResults[0].Values,
      secondLabels: latencyMetrics.MetricDataResults[0].Timestamps,
      options: {
        startTime: latencyParams.StartTime,
        endTime: latencyParams.EndTime,
        graphPeriod,
        graphUnits,
        maxValue: latencyMaxValue,
      },
    };

    allApiMetrics.push(latencyDataPoints);

    const countMetrics = await cwClient.send(
      new GetMetricDataCommand(countParams)
    );

    const countData = countMetrics.MetricDataResults[0].Timestamps.map(
      (timeStamp, index) => {
        return {
          x: timeStamp,
          y: countMetrics.MetricDataResults[0].Values[index],
        };
      }
    );

    const countMaxValue = Math.max(
      ...countMetrics.MetricDataResults[0].Values,
      0
    );

    const countDataPoints = {
      title: countMetrics.MetricDataResults[0].Label,
      metricType: 'Count',
      data: countData.reverse(),
      secondData: countMetrics.MetricDataResults[0].Values,
      secondLabels: countMetrics.MetricDataResults[0].Timestamps,
      options: {
        startTime: countParams.StartTime,
        endTime: countParams.EndTime,
        graphPeriod,
        graphUnits,
        maxValue: countMaxValue,
      },
    };

    allApiMetrics.push(countDataPoints);

    const fiveXXMetrics = await cwClient.send(
      new GetMetricDataCommand(fiveXXParams)
    );

    const fiveXXData = fiveXXMetrics.MetricDataResults[0].Timestamps.map(
      (timeStamp, index) => {
        return {
          x: timeStamp,
          y: fiveXXMetrics.MetricDataResults[0].Values[index],
        };
      }
    );

    const fiveXXMaxValue = Math.max(
      ...fiveXXMetrics.MetricDataResults[0].Values,
      0
    );

    const fiveXXDataPoints = {
      title: fiveXXMetrics.MetricDataResults[0].Label,
      metricType: '5XX',
      data: fiveXXData.reverse(),
      secondData: fiveXXMetrics.MetricDataResults[0].Values,
      secondLabels: fiveXXMetrics.MetricDataResults[0].Timestamps,
      options: {
        startTime: fiveXXParams.StartTime,
        endTime: fiveXXParams.EndTime,
        graphPeriod,
        graphUnits,
        maxValue: fiveXXMaxValue,
      },
    };

    allApiMetrics.push(fiveXXDataPoints);

    const fourXXMetrics = await cwClient.send(
      new GetMetricDataCommand(fourXXParams)
    );

    const fourXXData = fourXXMetrics.MetricDataResults[0].Timestamps.map(
      (timeStamp, index) => {
        return {
          x: timeStamp,
          y: fourXXMetrics.MetricDataResults[0].Values[index],
        };
      }
    );

    const fourXXMaxValue = Math.max(
      ...fourXXMetrics.MetricDataResults[0].Values,
      0
    );

    const fourXXDataPoints = {
      title: fourXXMetrics.MetricDataResults[0].Label,
      metricType: '4XX',
      data: fourXXData.reverse(),
      secondData: fourXXMetrics.MetricDataResults[0].Values,
      secondLabels: fourXXMetrics.MetricDataResults[0].Timestamps,
      options: {
        startTime: fourXXParams.StartTime,
        endTime: fourXXParams.EndTime,
        graphPeriod,
        graphUnits,
        maxValue: fourXXMaxValue,
      },
    };

    allApiMetrics.push(fourXXDataPoints);

    const wholeApiObject = { name: currApi, metrics: allApiMetrics };
    return wholeApiObject;
  } catch (err) {
    console.log(err.stack, err);
  }
};
