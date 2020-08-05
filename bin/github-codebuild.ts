#!/usr/bin/env node
import 'source-map-support/register';
import { core as cdk } from "monocdk-experiment";
import { AutobuildStack } from '../lib/github-codebuild-stack';

const app = new cdk.App();
new AutobuildStack(app, 'AutobuildStack');
