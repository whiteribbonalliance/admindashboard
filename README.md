# WRA Admin Dashboard

This project allows a user to login and download data related to a campaign. For each campaign there exists a user
that has access to the data of the campaign. The user `admin` has access to all campaign data.

Authentication is kept simple. When login succeeds, the back-end returns a `httpOnly` cookie that contains an access
token to validate the user when making requests to the server. This token shall be valid for ~30 days.

The following main functionalities are included:

- Download all campaign data
- Download campaign data between dates
- Download campaign countries breakdown
- Download campaign source files breakdown

## Development

### Install

Configure .env.local.

- `NEXT_PUBLIC_WRA_DASHBOARD_API_URL=` The url to What Women Want Dashboard API.

```bash
npm install
```

### Run

```bash
npm run dev
```

On the local machine visit `http://localhost:3000`.

### Lint project

```bash
npm run lint
```

### Format project

```bash
npm run format
```