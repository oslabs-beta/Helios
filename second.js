const AWS = require('aws-sdk');

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
  else console.log('Assumed Role Data: ',data,'\n\n');
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

  lambda.listFunctions(lamParams, function (err, data) {
    if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
    else console.log('LAMBDA DATA FROM THE ACCOUNT WE ASSUMED A NEW ROLE FOR: ', data,'\n**************\n');
  });

  const cloudWatchLogs = new AWS.CloudWatchLogs({ credentials });
  cloudWatchLogs.describeLogStreams(
    { logGroupName: '/aws/lambda/RequestUnicorn2' },
    (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log('Data from Describe Log Streams',data,'\n**************\n');
    }
  );

  cloudWatchLogs.filterLogEvents(
    { logGroupName: '/aws/lambda/RequestUnicorn2' },
    (err, data) => {
      if (err) console.log(err, err.stack);
      else console.log('Data from Filter Log Events',data,'\n**************\n');
    }
  );
});

let outsideLambda = new AWS.Lambda();

let outsideLamParams = { FunctionVersion: 'ALL', MaxItems: 5 };

outsideLambda.listFunctions(outsideLamParams, function (err, data) {
  if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
  else console.log('\n******------******\n','Data from the Parent Lambda Functions: ', data, '\n******------******\n');
});
