#!/usr/bin/env node
import 'source-map-support/register';
import { core as cdk } from "monocdk-experiment";
import { AutoBuildStack } from '../lib/github-codebuild-stack';


const app = new cdk.App();
const github_repo:string = app.node.tryGetContext('github_repo');
const stack_name:string = 'AutoBuildStack-' + github_repo.replace('/', '-'); 
new AutoBuildStack(app, stack_name);
