const moment = require('moment');
const { REGION } = require('../Credentials/libs/stsClient.js');
const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
  DescribeLogStreamsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

const updateLogs = async (req, res, next) => {
  //const logGroupName = '/aws/lambda/' + req.body.function;

  const oldFunctionLogs = req.body.logs;
  const functionsToFetch = [];
  for (let i = 0; i < oldFunctionLogs.length; i += 1) {
    if (oldFunctionLogs[i].timePeriod !== req.body.newTimePeriod) {
      functionsToFetch.push(oldFunctionLogs[i].name);
    }
  }
  console.log('array of functions being fetched: ', functionsToFetch);

  let StartTime;

  if (req.body.newTimePeriod === '30min') {
    StartTime = new Date(
      new Date().setMinutes(new Date().getMinutes() - 30)
    ).valueOf();
  } else if (req.body.newTimePeriod === '1hr') {
    StartTime = new Date(
      new Date().setMinutes(new Date().getMinutes() - 60)
    ).valueOf();
  } else if (req.body.newTimePeriod === '24hr') {
    StartTime = new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).valueOf();
  } else if (req.body.newTimePeriod === '7d') {
    StartTime = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).valueOf();
  } else if (req.body.newTimePeriod === '14d') {
    StartTime = new Date(
      new Date().setDate(new Date().getDate() - 14)
    ).valueOf();
  } else if (req.body.newTimePeriod === '30d') {
    StartTime = new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).valueOf();
  }

  const updatedArr = [];
  for (let i = 0; i < functionsToFetch.length; i += 1) {
    const functionName = functionsToFetch[i];
    const newLogObj = await loopFunc(
      functionName,
      StartTime,
      req.body.credentials,
      req.body.newTimePeriod
    );
    updatedArr.push(newLogObj);
  }
  res.locals.updatedLogs = updatedArr;
  return next();
};

module.exports = updateLogs;

const loopFunc = async (functionName, StartTime, credentials, timePeriod) => {
  const cwLogsClient = new CloudWatchLogsClient({
    region: REGION,
    credentials: credentials,
  });
  async function helperFunc(nextToken, data = []) {
    if (!nextToken) {
      return data;
    }
    const nextLogEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({
        logGroupName: '/aws/lambda/' + functionName,
        endTime: new Date().valueOf(),
        startTime: StartTime,
        nextToken,
        filterPattern: '- START - END - REPORT',
      })
    );
    data.push(nextLogEvents.events);
    return helperFunc(nextLogEvents.nextToken, data);
  }

  try {
    const logEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({
        logGroupName: '/aws/lambda/' + functionName,
        endTime: new Date().valueOf(),
        startTime: StartTime,
        filterPattern: '- START - END - REPORT',
      })
    );
    const shortenedEvents = [];
    if (logEvents.nextToken) {
      const helperFuncResults = await helperFunc(logEvents.nextToken);
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
    const eventLog = {
      name: functionName,
      timePeriod,
    };
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

    try {
      const errorEvents = await cwLogsClient.send(
        new FilterLogEventsCommand({
          logGroupName: '/aws/lambda/' + functionName,
          endTime: new Date().valueOf(),
          startTime: StartTime,
          filterPattern: 'ERROR',
        })
      );
      const errorStreams = [];
      for (let i = errorEvents.events.length - 1; i >= 0; i -= 1) {
        let errorObj = errorEvents.events[i];
        const rowArr = [];
        rowArr.push('...' + errorObj.logStreamName.slice(-5));
        rowArr.push(moment(errorObj.timestamp).format('lll'));
        rowArr.push(errorObj.message.slice(67));
        errorStreams.push(rowArr);
      }
      eventLog.errors = errorStreams;
      console.log('Inside Loop Func: ', eventLog);
      return eventLog;
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
