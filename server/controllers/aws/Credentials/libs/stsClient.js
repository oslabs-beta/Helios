const dotenv = require('dotenv');
// const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { STSClient } = require('@aws-sdk/client-sts');

dotenv.config();

AWS_ACCESS_KEY_ID="AKIASSMS4AJV2WW3MRES"
AWS_SECRET_ACCESS_KEY="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"
AWS_REGION = "eu-west-1"

const credentials = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
};
const region = AWS_REGION;

// root user credentials
// const credentials = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// };
// const region = process.env.AWS_REGION;

// Create an Amazon CloudWatch Logs service client object.
const stsClient = new STSClient({
  region: region,
  credentials: credentials,
});

module.exports = {
  stsClient,
};
