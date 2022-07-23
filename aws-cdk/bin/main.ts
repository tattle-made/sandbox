#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { DBStack } from "../lib/db";

const app = new cdk.App();

new DBStack(app, "DBStack", {
  env: { account: "628038590822", region: "ap-south-1" },
});
