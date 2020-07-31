import { core as cdk } from "monocdk-experiment";
import delivlib = require('aws-delivlib');
import { AutoBuild } from 'aws-delivlib/lib/auto-build';
import {github_repo, github_token, buildspec_name} from '../credentials';
import { BuildSpec } from "monocdk-experiment/src/aws-codebuild";


export class GithubCodebuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new AutoBuild(this, 'codebuild-github-autobuild', {
      repo: new delivlib.GitHubRepo({
        repository: github_repo, // GitHub Repositoy
        tokenSecretArn: github_token, // GitHub Token from AWS Secrets Manager
      }),
      publicLogs: true,
      deletePreviousPublicLogsLinks: false,
      buildSpec: BuildSpec.fromSourceFilename(buildspec_name)
    });
  }
}
