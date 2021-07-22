const moment = require('moment');
const AWSLogRecursiveFunc = require('./AWSLogRecursiveFunc.js');
const { REGION } = require('../Credentials/libs/stsClient.js');
const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
  DescribeLogStreamsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');
console.log(
  moment(
    new Date(new Date().setMinutes(new Date().getMinutes() - 30))
  ).valueOf()
);
const getLogs = async (req, res, next) => {
  const logGroupName = '/aws/lambda/' + req.body.function;

  const cwLogsClient = new CloudWatchLogsClient({
    region: REGION,
    credentials: req.body.credentials,
  });

  let StartTime;
  if (req.body.timePeriod === '30min') {
    StartTime = moment(
      new Date(new Date().setMinutes(new Date().getMinutes() - 30))
    ).valueOf();
  } else if (req.body.timePeriod === '1hr') {
    StartTime = moment(
      new Date(new Date().setMinutes(new Date().getMinutes() - 60))
    ).valueOf();
  } else if (req.body.timePeriod === '24hr') {
    StartTime = moment(
      new Date(new Date().setDate(new Date().getDate() - 24))
    ).valueOf();
  } else if (req.body.timePeriod === '7d') {
    StartTime = moment(
      new Date(new Date().setDate(new Date().getDate() - 7))
    ).valueOf();
  } else if (req.body.timePeriod === '14d') {
    StartTime = moment(
      new Date(new Date().setDate(new Date().getDate() - 14))
    ).valueOf();
  } else if (req.body.timePeriod === '30d') {
    StartTime = moment(
      new Date(new Date().setDate(new Date().getDate() - 730))
    ).valueOf();
  }

  async function helperFunc(nextToken, data = []) {
    console.log(nextToken);
    if (!nextToken) {
      return data;
    }
    const nextLogEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({
        logGroupName,
        endTime: moment(new Date()).valueOf(),
        startTime: StartTime,
        nextToken,
        filterPattern: '- START - END - REPORT',
        // limit: 600,
      })
    );
    data.push(nextLogEvents.events);
    return helperFunc(nextLogEvents.nextToken, data);
  }

  try {
    const logEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({
        logGroupName,
        endTime: moment(new Date()).valueOf(),
        startTime: StartTime,
        filterPattern: '- START - END - REPORT',
        limit: 400,
      })
    );
    const shortenedEvents = [];
    if (logEvents.nextToken) {
      const helperFuncResults = await helperFunc(logEvents.nextToken);
      // console.log(helperFuncResults[0].slice(0, 25));
      console.log(helperFuncResults.length);
      let poppedEl;
      while (helperFuncResults.length) {
        poppedEl = helperFuncResults.pop();
        for (let i = poppedEl.length - 1; i >= 0; i -= 1) {
          if (shortenedEvents.length === 50) {
            break;
          }
          shortenedEvents.push(poppedEl[i]);
        }
      }
    }
    if (!logEvents.nextToken) {
      for (let i = logEvents.events.length - 1; i >= 0; i -= 1) {
        if (shortenedEvents.length === 50) break;
        shortenedEvents.push(logEvents.events[i]);
      }
    }
    const eventLog = { name: req.body.function };
    const streams = [];

    for (let i = 0; i < shortenedEvents.length; i += 1) {
      let eventObj = shortenedEvents[i];
      // create the individual arrays to populate the table, this info makes up one row
      const dataArr = [];
      dataArr.push('...' + eventObj.logStreamName.slice(-5));
      dataArr.push(moment(eventObj.timestamp).format('lll'));
      dataArr.push(eventObj.message.slice(67));
      // push to the larger array to then make up the table
      streams.push(dataArr);
    }
    eventLog.streams = streams;
    res.locals.functionLogs = eventLog;
    return next();
  } catch (err) {
    if (err) console.log(err);
    return next(err);
  }
};

module.exports = getLogs;
