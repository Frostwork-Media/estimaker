# Estimaker

This is a monorepo the Frostwork Estimaker project.

## Packages

#### /app

vite react typescript

#### /api

Vercel Serverless + Edge Functions

#### /db

Prisma client, pointed to a postgres database hosted on Railway

#### /multiplayer

A partykit server for multiplayer, realtime stuff. The partykit server must be manually deployed right now with `pnpm partykit deploy`.

#### /shared

Shared code between packages

## Development

Must connect to vercel project and run `pnpm env:pull` to get environment variables. Then run `vercel dev` to start the dev server.

### Git / Release Setup

The `main` branch represents the staging environment and the next public release. The `production` branch represents the production environment and the current public release.

When a new release is ready, create a pull request from `main` to `production`. Use the changesets command line tool by running `pnpm changeset` to create a changeset for the release. The changeset will be automatically added to the pull request. Once the pull request is merged, the changeset will be published to npm and the production environment will be updated.