#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { DBStack } from "../lib/db";

const app = new cdk.App();

new DBStack(app, "DBStack", {
  vpcId: process.env.AWS_VPC_ID,
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
});
