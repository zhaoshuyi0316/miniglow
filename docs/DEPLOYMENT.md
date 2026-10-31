# Deployment status

## Current hosting

The maintained application is published on Sites with public browsing and independent Miniglow accounts. The production hostname and project identifier are omitted from this source distribution. Source bindings are declared in .openai/hosting.json: DB (D1) and BUCKET (R2).

GitHub synchronization stores the source only; pushing here does not itself configure an automatic deployment pipeline.

## Local database setup

After npm run build, apply each migration once, in order:

    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_broad_joshua_kane.sql
    node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_same_landau.sql

These commands affect local data only. Do not replay already applied migrations. To change schema, edit db/schema.ts and run npm run db:generate; append new migrations rather than changing applied files.

## Planned Alibaba Cloud ECS migration

Not implemented yet. Required work:

1. Confirm domain and applicable filing requirements with the hosting provider.
2. Adapt Workers-specific runtime usage and replace D1 access with a persistent database suitable for the server.
3. Replace R2 access with local persistent uploads or object storage such as OSS.
4. Export production records and photos through authorized mechanisms; preserve account identifiers, password hashes and content ownership.
5. Replace external fonts/sample-image dependencies where appropriate.
6. Configure HTTPS, domain DNS, reverse proxy, process startup, backups, restore testing and monitoring.
7. Test authentication, ownership restrictions, photos and community interactions before switching DNS.

## Validation completed during development

Production build and TypeScript checks passed. Local tests covered registration, successful/failed login, password length validation, session identity, unauthenticated write rejection, CSRF rejection and logout invalidation. Earlier local checks covered photo upload/read, likes, comments, edit and delete.

Online deployment was confirmed by the Sites deployment API. Automated browser verification against the hosted origin encountered timeouts, so production end-to-end registration has not been independently verified.
