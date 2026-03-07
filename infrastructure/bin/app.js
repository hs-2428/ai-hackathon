#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { TribalAppStack } = require('../lib/tribal-app-stack');

const app = new cdk.App();
new TribalAppStack(app, 'TribalAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});
