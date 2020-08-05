# aws-codebuild-github-autobuild
aws-codebuild-github-autobuild utilizes the AutoBuild feature from the aws-delivlib library (https://github.com/awslabs/aws-delivlib).

An easy way to trigger AWS CodeBuild through any changes from a GitHub repository.


# Credentials File
1. In your root directory, create a file called `credentials.ts`

2. The file should look like:   
    ### Buildspec file in repository
    ```
    export var github_repo:string = 'PLACEHOLDER';
    export var github_token:string = 'PLACEHOLDER';
    export var buildspec:string = 'PLACEHOLDER'
    ```    
    * In `lib/github-codebuild-stack.ts`, change the buildspec line (line 19) to:
        ```
        buildSpec: BuildSpec.fromSourceFilename(buildspec)
        ```

    ### Buildspec object in Codebuild
    ```
    import { BuildSpec } from "monocdk-experiment/src/aws-codebuild";

    export var github_repo:string = 'PLACEHOLDER';
    export var github_token:string = 'PLACEHOLDER';

    // REPLACE WITH YOUR BUILDSPEC CONTEXT
    export var buildspec = BuildSpec.fromObject({
        version: '0.2',
        phases: {
        build: {
            commands: [
            'echo "Hello, world!"'
            ]
        }
        },
        artifacts: {
        files: [ '**/*' ],
        'base-directory': 'dist'
        }
    });
    ```

3. Replace `PLACEHOLDER` with a valid GitHub repository, GitHub Token Secrets Manager ARN, and name/path to the buildspec file OR buildspec context.



# CloudFormation Stack
1. Run `cdk synth` to emit the synthesized 
    * If you receive a `Subprocess exited with error 1`. Try deleting `node_modules` and running `npm i` in root directory.

2. Run `cdk deploy` to deploy this stack to your AWS account
3. If successful, the stack will be created in the configured AWS account with the specified GitHub repository
4. Any changes to the repository (pull requests or pushes) will trigger the CodeBuild
5. The specified buildspec in the repository will be ran
6. (Optional) To change the buildspec file name after the deployment of the stack: goto CodeBuild in the AWS console, click **Edit** then **Buildspec**. This will prevent you from creating another stack for a different buildspec file name.

One build file will be ran in the AutoBuild. If there are multiple build files, you may need to create one build file with all the builds. 

# (Optional) GitHub CodeBuild Logs
Reference: https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:277187709615:applications~github-codebuild-logs

This serverless app solves a common complaint when using AWS CodeBuild as a CI solution: PR contributors don't have access to the build logs if the CI build fails on their PR branch. The app creates publicly accessible links to PR build logs for a given AWS CodeBuild project and posts them as a comment on the corresponding GitHub PR.

![Logs](images/logs.png)


To attach this app to an existing AWS CodeBuild project in your AWS account,

1. Go to the app's page on the [Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:277187709615:applications~github-codebuild-logs) and click "Deploy"
2. Provide the CodeBuild project name and any other parameters (see parameter details below) and click "Deploy"

## App Parameters
1. CodeBuildProjectName (required) - Name of CodeBuild project this app is posting logs for.
2. ExpirationInDays (optional) - Number of days before a build's log page expires. Default: 30
3. CodeBuildProjectCustomLogGroupName (optional) - If the CodeBuild Project has a custom log group name, you can specify it here. If not provided, the app will assume the CodeBuild default log group name format of /aws/codebuild/<project name>.
4. GitHubOAuthToken (optional) - OAuth token used for writing comments to GitHub PRs. If not provided, the app will attempt to pull an OAuth token from the CodeBuild project. Note, if your CodeBuild project does not have a GitHub OAuth token, e.g., it is being used to build a public GitHub repo, then this parameter will be required for the app to function properly.
NOTE: The access token used requires public_repo permissions for public repositories or repo for private repositories.
5. DeletePreviousComments (optional) - Set to true to delete previously posted PR comments before posting a new one. Default: false
6. LogLevel (optional) - Log level for Lambda function logging, e.g., ERROR, INFO, DEBUG, etc. Default: INFO
7. CommentOnSuccess (optional) - Set to false to not publish a comment when build is successful. Default: true
