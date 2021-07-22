// const AWSLogRecursiveFunc = {};

// AWSLogRecursiveFunc.getLogStreams = () => {
//   console.log('...');
// };

// module.exports = AWSLogRecursiveFunc;

// try {
//   const logStreams = await cwLogsClient.send(
//     new DescribeLogStreamsCommand({
//       logGroupName,
//       orderBy: 'LastEventTime',
//     })
//   );
//   console.log('---------------LOG STREAMS-------------');
//   console.log(logStreams.nextToken);
//   const nextLogStreams = await cwLogsClient.send(
//     new DescribeLogStreamsCommand({
//       logGroupName,
//       orderBy: 'LastEventTime',
//       nextToken: logStreams.nextToken,
//     })
//   );
//   console.log(
//     '------------------------------------NEXT LOG STREAMS FETCH-------------------------------'
//   );
//   console.log(nextLogStreams);
// } catch (err) {
//   if (err) console.log(err);
//   return next(err);
// }

// // const helperFunc = () => {
// //   const nextLogEvents = await cwLogsClient.send(
// //     new FilterLogEventsCommand({
// //       logGroupName,
// //       endTime: moment(new Date()).valueOf(),
// //       startTime: StartTime,
// //     })
// // }
