import { core as cdk } from "monocdk-experiment";
import delivlib = require('aws-delivlib');
import { AutoBuild } from 'aws-delivlib/lib/auto-build';
import { BuildSpec } from "monocdk-experiment/src/aws-codebuild";
import * as fs from 'fs';
const yaml = require('YAML')

export class AutoBuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const github_repo:string = this.node.tryGetContext('github_repo');
    const github_token:string = this.node.tryGetContext('github_token');
    const buildspec = BuildSpec.fromObject(yaml.parse(fs.readFileSync(this.node.tryGetContext('buildspec'), 'utf8')));


    new AutoBuild(this, 'codebuild-github-autobuild', {
      repo: new delivlib.GitHubRepo({
        repository: github_repo, // GitHub Repositoy
        tokenSecretArn: github_token, // GitHub Token from AWS Secrets Manager
      }),
      publicLogs: true,
      deletePreviousPublicLogsLinks: false,
      buildSpec: buildspec //Buildspec file path
    })
  }
}

