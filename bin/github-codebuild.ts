#!/usr/bin/env node
import 'source-map-support/register';
import { core as cdk } from "monocdk-experiment";
import { GithubCodebuildStack } from '../lib/github-codebuild-stack';

const app = new cdk.App();
new GithubCodebuildStack(app, 'GithubCodebuildStack');
