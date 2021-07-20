// import { stsClient, REGION } from '../libs/stsClient.js';
const { stsClient, REGION } = require('../libs/stsClient.js');
const AWSUtilFunc = require('../utils/AWSUtilFunc.js');

const { AssumeRoleCommand } = require('@aws-sdk/client-sts');
const {
  Lambda,
  LambdaClient,
  ListFunctionsCommand,
} = require('@aws-sdk/client-lambda');

const {
  CloudWatchClient,
  GetMetricDataCommand,
} = require('@aws-sdk/client-cloudwatch');

// const roleParams = {
//   RoleArn: 'arn:aws:iam::142167254676:role/HeliosDelegationRole',
//   RoleSessionName: 'testingSessionWork',
// };

//Async Function to Assume role of the Client and pull metrics

const getCredentials = async (req, res, next) => {
  const roleParams = {
    RoleArn: req.body.arn,
    RoleSessionName: 'HeliosSession',
  };

  try {
    const assumedRole = await stsClient.send(new AssumeRoleCommand(roleParams));
    console.log('Result in getCredentials middleware: ', assumedRole);
    const accessKeyId = assumedRole.Credentials.AccessKeyId;
    const secretAccessKey = assumedRole.Credentials.SecretAccessKey;
    const sessionToken = assumedRole.Credentials.SessionToken;
    res.locals.credentials = { accessKeyId, secretAccessKey, sessionToken };
    return next();
  } catch (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
  }
};

// (async () => {
//   let assumedRoleCredentials = {};
//   //STS Assume Role
//   //***********************Begin************************ */
//   try {
//     const assumedRole = await stsClient.send(new AssumeRoleCommand(roleParams));
//     console.log('Result: ', assumedRole);

//     //Assume role Credentials
//     assumedRoleCredentials.accessKeyId = assumedRole.Credentials.AccessKeyId;
//     assumedRoleCredentials.secretAccessKey =
//       assumedRole.Credentials.SecretAccessKey;
//     assumedRoleCredentials.sessionToken = assumedRole.Credentials.SessionToken;
//   } catch (err) {
//     console.error('Error in STS Client Assumed Role Function: ', err);
//   }

//   //***********************End************************ */

//   //Extract Lambda Functions for the Assumed Role
//   //***********************Begin************************ */

//   const lambdaClient = new LambdaClient({
//     region: REGION,
//     credentials: assumedRoleCredentials,
//   });

//   const lamParams = { FunctionVersion: 'ALL' };
//   let funcNames = [];
//   try {
//     const functions = await lambdaClient.send(
//       new ListFunctionsCommand(lamParams)
//     );
//     funcNames = functions.Functions.map((el) => el.FunctionName);
//     console.log('Lambda Func from Async', funcNames);
//   } catch (err) {
//     console.error('Error in Lambda List Functions: ', err);
//   }

//   //***********************End************************ */

//   //Extract the CloudWatch Metrics for the Lambda Functions
//   //***********************Begin************************ */

//   const cwClient = new CloudWatchClient({
//     region: REGION,
//     credentials: assumedRoleCredentials,
//   });

//   let graphPeriod, graphUnits, metricStat;
//   [graphPeriod, graphUnits, metricStat] = [7, 'days', 'Sum'];

//   //Metrics for All Functions (combined)

//   const invocationsAllFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(
//     7,
//     'days',
//     'Invocations',
//     'Sum'
//   );

//   try {
//     const invocationsAllFunc = await cwClient.send(
//       new GetMetricDataCommand(invocationsAllFuncInput)
//     );
//     console.log(
//       'Invocations All Lambda Functions:  ',
//       JSON.stringify(invocationsAllFunc, null, 2)
//     );
//   } catch (err) {
//     console.log('Error in CW getMetricsData All Functions', err);
//   }

//   //Metrics By Individual Lambda Function

//   const invocationsByFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaByFunc(
//     7,
//     graphUnits,
//     'Invocations',
//     metricStat,
//     funcNames
//   );

//   try {
//     const invocationsByFunc = await cwClient.send(
//       new GetMetricDataCommand(invocationsByFuncInput)
//     );
//     console.log(
//       'Invocations By Lambda Functions:  ',
//       JSON.stringify(invocationsByFunc, null, 2)
//     );
//   } catch (err) {
//     console.log('Error in CW getMetricsData By Function', err);
//   }
//   //***********************End************************ */
// })();

// let outsideLambda = new Lambda({
//   region: REGION,
// });

// let outsideLamParams = { FunctionVersion: 'ALL', MaxItems: 5 };

// outsideLambda.listFunctions(outsideLamParams, function (err, data) {
//   if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
//   else
//     console.log(
//       '\n******------******\n',
//       'Data from the Parent Lambda Functions: ',
//       data,
//       '\n******------******\n'
//     );
// });

module.exports = getCredentials;
