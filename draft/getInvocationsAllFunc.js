const { REGION } = require('../server/controllers/aws/Credentials/libs/stsClient.js');
const AWSUtilFunc = require('../server/controllers/aws/Metrics/utils/AWSUtilFunc.js');
const {
  CloudWatchClient,
  GetMetricDataCommand,
} = require('@aws-sdk/client-cloudwatch');

//Extract the CloudWatch Metrics for the Lambda Functions
//***********************Begin************************ */

const getInvocationsAllFunc = async (req, res, next) => {
  const cwClient = new CloudWatchClient({
    region: req.body.region,
    credentials: req.body.credentials,
  });

  let graphPeriod, graphUnits, metricStat;
  [graphPeriod, graphUnits, metricStat] = [7, 'days', 'Sum'];

  //Metrics for All Functions (combined)

  const invocationsAllFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(
    graphPeriod,
    graphUnits,
    'Invocations',
    'Sum'
  );

  try {
    const invocationsAllFunc = await cwClient.send(
      new GetMetricDataCommand(invocationsAllFuncInput)
    );
    console.log(
      'Invocations All Lambda Functions:  ',
      JSON.stringify(invocationsAllFunc, null, 2)
    );

    //Format of the MetricDataResults
    //******************************* */
    // "MetricDataResults": [
    //   {
    //     "Id": "m0",
    //     "Label": "Lambda Invocations CryptoRefreshProfits",
    //     "Timestamps": [
    //       "2021-07-17T02:54:00.000Z",
    //       "2021-07-17T01:54:00.000Z"
    //     ],
    //     "Values": [
    //       1400,
    //       34
    //     ],
    //     "StatusCode": "Complete",
    //     "Messages": []
    //   },
    // ]
    //******************************* */

    const invocationsAllFuncData =
      invocationsAllFunc.MetricDataResults[0].Timestamps.map(
        (timeStamp, index) => {
          return {
            x: timeStamp,
            y: invocationsAllFunc.MetricDataResults[0].Values[index],
          };
        }
      );
    const maxInvocations = Math.max(
      ...invocationsAllFunc.MetricDataResults[0].Values,
      0
    );

    res.locals.invocationsAllFunc = {
      title: invocationsAllFunc.MetricDataResults[0].Label,
      data: invocationsAllFuncData.reverse(),
      options: {
        startTime: invocationsAllFuncInput.StartTime,
        endTime: invocationsAllFuncInput.EndTime,
        graphPeriod,
        graphUnits,
        maxInvocations,
      },
    };
    console.log(res.locals.invocationsAllFunc);
    return next();
  } catch (err) {
    console.log('Error in CW getMetricsData All Functions', err);
  }
};

module.exports = getInvocationsAllFunc;
