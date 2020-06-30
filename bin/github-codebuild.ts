#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GithubCodebuildStack } from '../lib/github-codebuild-stack';

const app = new cdk.App();
new GithubCodebuildStack(app, 'GithubCodebuildStack');
