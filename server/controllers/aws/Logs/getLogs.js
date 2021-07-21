const moment = require('moment')
const { REGION } = require('../Credentials/libs/stsClient.js');
const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

const getLogs = async (req, res, next) => {
  const logGroupName = '/aws/lambda/' + req.body.function;
  console.log(logGroupName);
  const cwLogsClient = new CloudWatchLogsClient({
    region: REGION,
    credentials: req.body.credentials,
  });
  try {
    const logEvents = await cwLogsClient.send(
      new FilterLogEventsCommand({ logGroupName, limit: 25 })
    );
    console.log(logEvents.events);
    console.log(moment(logEvents.events[0].timestamp).format('lll'))
    // array of objects
    const eventLog = {name: req.body.function}
    const streams = []
    logEvents.events.forEach((eventObj) => {
        if (eventObj.message.slice(0, 5) !== 'START' && eventObj.message.slice(0, 3) !== 'END' ) {
        const dataArr = []
        dataArr.push('...' + eventObj.logStreamName.slice(-5))
        dataArr.push(moment(eventObj.timestamp).format('lll'))
        dataArr.push(eventObj.message)
        streams.push(dataArr)
        }
    })
    eventLog.streams = streams
    console.log(eventLog)
    res.locals.functionLogs = eventLog
    return next();
  } catch (err) {
    if (err) console.log(err);
    return next(err)
  }
};

module.exports = getLogs;
