const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { STSClient } = require('@aws-sdk/client-sts');

// Set the AWS Region.
const REGION = 'us-east-2'; //e.g. "us-east-1"
// Create an Amazon CloudWatch Logs service client object.
const stsClient = new STSClient({
  region: REGION,
  credentials: fromIni({
    profile: 'work-account',
  }),
});

module.exports = {
  REGION,
  stsClient,
};
