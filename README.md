# Admin Dashboard

Admin dashboard for downloading data of a campaign.

Login using the campaign code as username and the password set for the campaign as an environment variable in the
back-end. Check the `Environment variables` section in the back-end repo.

It is also required to configure the environment variables for either `Google` or `Azure` in the back-end.

The username `admin` has access to all campaigns data, to enable the admin you must set the environment
variable `ADMIN_PASSWORD` in the back-end.

When login succeeds, the back-end returns an access token to validate the user when making requests to the back-end.
This token is valid for ~30 days.

The following functionalities are included:

- Download all campaign data.
- Download campaign data between dates (requires the field `ingestion_time` in the CSV file).
- Download campaign countries breakdown.
- Download campaign source files breakdown (requires the field `data_source` in the CSV file).

## Environment variables

### Required:

- `NEXT_PUBLIC_DASHBOARD_API_URL=` The url to the Dashboard API.

## System requirements

- Node.js 18 or above.

## Install

Configure `.env.local.` with the environment variables.

Then:

```bash
npm install
npm run build
```

### Run

```bash
npm run start
```

### Lint project

```bash
npm run lint
```

### Format project

```bash
npm run format
```

## Deployment to Google App Engine

Add the required environment variables to `Repository secrets` in GitHub. Add optional
environment variables if needed. These variables will be loaded into `app.yaml`.

Inside `app.yaml` change `service` to your service name on App Engine.

For deployment, it is also required to add the following environment variables to `Repository secrets`:

- `SERVICE_NAME=` The service name in App Engine.
- `GOOGLE_CREDENTIALS_JSON_B64=` Content of credentials.json file in `Base64` format.
- `SERVICE_ACCOUNT=` The Google Cloud service account.
- `PROJECT_ID=` The Google Cloud project id.

Add/Modify `resources` in `app.yaml` as needed.

The GitHub action at `.github/workflows/prod-deploy-google-app-engine.yaml` will trigger a deployment to Google App
Engine on push or merge.

This script builds a Docker image and pushes to Google Container Registry and then deploys. In the future we may change
to a direct Dockerless deployment which would use `app.yaml`. No authentication is needed because authentication is
provided via the Google App Engine service account, whose credentials are stored in the GitHub
secret `GOOGLE_CREDENTIALS_JSON_B64` (to change this, go to the GitHub web interface and got o Settings -> Secrets and
variables -> Actions. You will need to be an administrator on the GitHub repo to modify these credentials).

There is also a manual Google App Engine deployment file set up in `app.yaml`. You can deploy manually from the command
line using `gcloud app deploy app.yaml` (you must directly include the env variables in `app.yaml`). You need to install
Google Cloud CLI (Command Line Interface) and be authenticated on the Google Cloud Platform service account.

## Deployment to Azure Web Apps

Add the following environment variables to `Repository secrets` in GitHub:

- `AZURE_WEBAPP_PUBLISH_PROFILE=` The publish profile of your web app.
- `AZURE_WEBAPP_NAME=` The web app name.
- `NEXT_PUBLIC_DASHBOARD_API_URL=` The url to the Dashboard API.

At `Configurations` -> `General settings` -> `Startup command` add `node server.js`.

The GitHub action at `.github/workflows/prod-deploy-azure-webapps.yaml` will trigger a deployment to Azure Web
App on push or merge.

## Workflows

In each repository there's two workflows (To deploy to `Google` or `Azure`), make sure to only enable the correct
workflow in
the repository on GitHub: `https://docs.github.com/en/actions/using-workflows/disabling-and-enabling-a-workflow`.

## Legacy campaigns

This section can be ignored as it details some information of dashboards used with this project originally.

Additional environment variables:

- `NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL=` The url to the PMNCH Dashboard API.

## License

MIT License.