const moment = require('moment');
const AWSUtilFunc = require('../utils/AWSUtilFunc.js');
const { REGION } = require('../libs/stsClient.js');
const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

const getLogs = async (req, res, next) => {
  const logGroupName = '/aws/lambda/' + req.body.function;
  console.log(logGroupName);
  console.log(req.body);
  const cwLogsClient = new CloudWatchLogsClient({
    region: REGION,
    credentials: req.body.credentials,
  });

  let timePeriod, timeUnits;
  if (req.body.timePeriod === '30min') {
    [timePeriod, timeUnits] = [30, 'minutes'];
  } else if (req.body.timePeriod === '1hr') {
    [timePeriod, timeUnits] = [60, 'minutes'];
  } else if (req.body.timePeriod === '24hr') {
    [timePeriod, timeUnits] = [24, 'hours'];
  } else if (req.body.timePeriod === '7d') {
    [timePeriod, timeUnits] = [7, 'days'];
  }
  const input = AWSUtilFunc.prepCwLogEventQuery(timePeriod, timeUnits);
  console.log(input);
  console.log(input.metricParamsBase.EndTime);
  try {
    const logEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({
        logGroupName,
        endTime: input.EndTime,
        startTime: input.StartTime,
      })
    );
    console.log(logEvents.events);
    const eventLog = { name: req.body.function };
    const streams = [];
    logEvents.events.forEach((eventObj) => {
      /// take off the redundant log events with just the start and end info
      if (
        eventObj.message.slice(0, 5) !== 'START' &&
        eventObj.message.slice(0, 3) !== 'END'
      ) {
        // create the individual arrays to populate the table, this info makes up one row
        const dataArr = [];
        dataArr.push('...' + eventObj.logStreamName.slice(-5));
        dataArr.push(moment(eventObj.timestamp).format('lll'));
        dataArr.push(eventObj.message);
        // push to the larger array to then make up the table
        streams.push(dataArr);
      }
    });
    eventLog.streams = streams;
    console.log(eventLog);
    res.locals.functionLogs = eventLog;
    return next();
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

module.exports = getLogs;
