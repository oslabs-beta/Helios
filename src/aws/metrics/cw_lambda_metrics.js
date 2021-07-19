import { stsClient, REGION } from '../libs/stsClient.js';
import AWSUtilFunc from '../utils/AWSUtilFunc.js';

import { AssumeRoleCommand } from '@aws-sdk/client-sts';
import {
  Lambda,
  LambdaClient,
  ListFunctionsCommand,
} from '@aws-sdk/client-lambda';

import {
  CloudWatchClient,
  GetMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';

const roleParams = {
  RoleArn: 'arn:aws:iam::142167254676:role/HeliosDelegationRole',
  RoleSessionName: 'testingSessionWork',
};

//Async Function to Assume role of the Client and pull metrics

(async () => {
  let assumedRoleCredentials = {};
  //STS Assume Role
  //***********************Begin************************ */
  try {
    const assumedRole = await stsClient.send(new AssumeRoleCommand(roleParams));
    console.log('Result: ', assumedRole);

    //Assume role Credentials
    assumedRoleCredentials.accessKeyId = assumedRole.Credentials.AccessKeyId;
    assumedRoleCredentials.secretAccessKey =
      assumedRole.Credentials.SecretAccessKey;
    assumedRoleCredentials.sessionToken = assumedRole.Credentials.SessionToken;
  } catch (err) {
    console.error('Error in STS Clinet Assumed Role Function: ', err);
  }

  //***********************End************************ */


  //Extract Lambda Functions for the Assumed Role
  //***********************Begin************************ */

  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: assumedRoleCredentials,
  });

  const lamParams = { FunctionVersion: 'ALL' };
  let funcNames = [];
  try {
    const functions = await lambdaClient.send(
      new ListFunctionsCommand(lamParams)
    );
    funcNames = functions.Functions.map((el) => el.FunctionName);
    console.log('Lambda Func from Async', funcNames);
  } catch (err) {
    console.error('Error in Lambda List Functions: ', err);
  }

  //***********************End************************ */


  //Extract the CloudWatch Metrics for the Lambda Functions
  //***********************Begin************************ */

  const cwClient = new CloudWatchClient({
    region: REGION,
    credentials: assumedRoleCredentials,
  });

  let graphPeriod, graphUnits, metricStat;
  [graphPeriod, graphUnits, metricStat] = [7, 'days', 'Sum'];

  //Metrics for All Functions (combined)

  const invocationsAllFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(
    7,
    'days',
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
  } catch (err) {
    console.log('Error in CW getMetricsData All Functions', err);
  }

  //Metrics By Individual Lambda Function

  const invocationsByFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaByFunc(
    7,
    graphUnits,
    'Invocations',
    metricStat,
    funcNames
  );


  try {
    const invocationsByFunc = await cwClient.send(
      new GetMetricDataCommand(invocationsByFuncInput)
    );
    console.log(
      'Invocations By Lambda Functions:  ',
      JSON.stringify(invocationsByFunc, null, 2)
    );
  } catch (err) {
    console.log('Error in CW getMetricsData By Function', err);
  }
  //***********************End************************ */
})();

let outsideLambda = new Lambda({
  region: REGION,
});

let outsideLamParams = { FunctionVersion: 'ALL', MaxItems: 5 };

outsideLambda.listFunctions(outsideLamParams, function (err, data) {
  if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
  else
    console.log(
      '\n******------******\n',
      'Data from the Parent Lambda Functions: ',
      data,
      '\n******------******\n'
    );
});
