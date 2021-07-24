const AWS = require('aws-sdk');
const AWSUtilFunc = require('../server/controllers/aws/Metrics/utils/AWSUtilFunc')

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: 'work-account',
});

var sts = new AWS.STS({
  apiVersion: '2011-06-15',
  httpOptions: { xhrAsync: false },
});

AWS.config.update({ region: 'us-east-2' });

const roleParams = {
  RoleArn: 'arn:aws:iam::142167254676:role/HeliosDelegationRole',
  RoleSessionName: 'testingSessionWork',
};

const assumedRole = sts.assumeRole(roleParams, function (err, data) {
  if (err) console.log('ERROR IN ASSUME ROLE: ', err, err.stack);
  else console.log('Assumed Role Data: ', data, '\n\n');
});

assumedRole.on('complete', function (response) {
  const accessKeyId = response.data.Credentials.AccessKeyId;
  const secretAccessKey = response.data.Credentials.SecretAccessKey;
  const sessionToken = response.data.Credentials.SessionToken;
  const credentials = { accessKeyId, secretAccessKey, sessionToken };
  var lambda = new AWS.Lambda({
    credentials,
  });

  var lamParams = { FunctionVersion: 'ALL' };
  let funcNames = [];

  lambda.listFunctions(lamParams, function (err, data) {
    if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
    else {
      funcNames = data.Functions.map((el) => el.FunctionName);
      const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01', credentials });

      const metricInvocationsAllFunc = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(7,'days','Invocations', 'Sum')

      // console.log("Parameters All Func: ", metricInvocationsAllFunc)

      const metricInvocationsByFunc = AWSUtilFunc.prepCwMetricQueryLambdaByFunc(7,'days','Invocations', 'Sum',funcNames)

      // console.log("Parameters By Func Outside: ",metricInvocationsByFunc)


      cw.getMetricData(metricInvocationsAllFunc, function (err, data) {
        if (err) {
          console.log('Error in CW getMetricsData', err);
          console.log("Parameters All Func Inside: ", metricInvocationsAllFunc)
        } else {
          console.log('Invocations All Lambda Functions:  ', JSON.stringify(data, null, 2));
        }
      });

      cw.getMetricData(metricInvocationsByFunc, function (err, data) {
        if (err) {
          console.log('Error in CW getMetricsData', err);
          console.log("Parameters By Func Inside: ",metricInvocationsByFunc)
        } else {
          console.log('Invocations By Lambda Functions:  ', JSON.stringify(data, null, 2));
        }
      });

      console.log(
        'LAMBDA DATA FROM THE ACCOUNT WE ASSUMED A NEW ROLE FOR: ',
        funcNames,
        '\n**************\n'
      );
    }
  });
});

let outsideLambda = new AWS.Lambda();

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
