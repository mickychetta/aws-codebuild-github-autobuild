# aws-codebuild-github-autobuild
aws-codebuild-github-autobuild utilizes the AutoBuild feature from the aws-delivlib library (https://github.com/awslabs/aws-delivlib).

An easy way to trigger AWS CodeBuild through any changes from a GitHub repository.

# CodeBuild CLI Repository Credentials Set Up
Imports the source repository credentials for an AWS CodeBuild project that has its source code stored in a GitHub or GitHub Enterprise repository.

1. On your terminal, check if there is a valid GitHub token stored for an AWS CodeBuild project

    ```
    $ aws codebuild list-source-credentials
    ```

    ## Output 

    No Token Set Up:
    ```
    {
        "sourceCredentialsInfos": []
    }
    ```

    Pre-configured Token:
    ```
    {
        "sourceCredentialsInfos": [
            {
                "arn": "XXXXXXXXXXX",
                "serverType": "GITHUB",
                "authType": "PERSONAL_ACCESS_TOKEN"
            }
        ]
    }
    ```
    **You may not have more than one token of the same authType. Make sure it is the correct token for the repository.**

    To delete the token shown, you could run `aws codebuild delete-source-credentials --arn <arn>`

    *If you have a valid token, you may skip the rest of the set up in this section.*

2. To connect to GitHub, you will need to create [Personal GitHub Access Token](https://github.com/settings/tokens) and store it in the token parameter of this command.

    For GitHub, your personal access token must have the following scopes:
    * public_repo: Grants access to public repositories
    * repo:status: Grants access to commit statuses
    * admin:repo_hook: Grants full control of repository hooks 

    ```
    $ aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <value>
    ```

    If successful, it will output:

    ```
    {
        "arn": "XXXXXXXXXXXXXXXXXXXXXXXXX"
    }
    ```

    You have successfully set up the source repository credentials for an AWS CodeBuild project.

3. Store the created Personal GitHub token in Secrets Manager for the next section.


# Context Variables
Specify context variables as part of the AWS CDK CLI command 

0. Run `npm install` to install dependencies.

1. Run `npm run build` to perform the necessary build tasks for the project


2. Replace `PLACEHOLDER` with:
    * GitHub repository path
    * Secrets Manager ARN of the GitHub token (Step 3 of *CodeBuild CLI Repository Credentials Set Up*)
        * OAuth token is used for writing comments to GitHub PRs
    * Name/path of buildspec file in this repository 
    ```
    $ cdk deploy --context github_repo=PLACEHOLDER --context github_token=PLACEHOLDER --context buildspec=PLACEHOLDER
    ```

3. Run this command in the terminal when deploying your stack. This will create a new CodeBuild project with the Autobuild feature.
    * If you receive a `Subprocess exited with error 1`. Try deleting `node_modules` and re-installing using `npm i`

4. Any changes to the repository (pull requests or pushes) will trigger the CodeBuild. GitHub CodeBuild Logs will be automatically commented in the repository once the CodeBuild finishes running. *More details in the next section.*



One build file will be ran in the AutoBuild. If there are multiple build files, you may need to create one build file with all the builds combined. 

# GitHub CodeBuild Logs
Reference: https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:277187709615:applications~github-codebuild-logs

This serverless app solves a common complaint when using AWS CodeBuild as a CI solution: PR contributors don't have access to the build logs if the CI build fails on their PR branch. The app creates publicly accessible links to PR build logs for a given AWS CodeBuild project and posts them as a comment on the corresponding GitHub PR.

![Logs](images/logs.png)

This is automatically attached to the created AWS CodeBuild project in your AWS account
  
  