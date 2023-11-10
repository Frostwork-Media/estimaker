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
