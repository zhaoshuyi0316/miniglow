# Miniglow

一个暖色、简约的幸福瞬间分享社区。支持简体中文、繁体中文与英文界面，可供学习、修改和二次开发。

原创代码采用 MIT 许可证，允许使用、修改、分发和商业使用；分发时请保留版权及许可声明。第三方软件和图片适用其自身条款，见 THIRD-PARTY-NOTICES.md。

**复用提示：当前版本依赖 Cloudflare Workers、D1 和 R2，不能直接当作普通 Node.js 应用部署。独立部署需创建自己的云资源，并在本地 .openai/hosting.json 中设置自己的项目标识。**

A warm, minimal community for sharing small moments of happiness.

The public source intentionally omits the maintainer’s production hostname and deployment identifiers.

## Current features

- Discover feed, categories, search, recommended and newest sorting
- Simplified Chinese, Traditional Chinese and English UI; saved language preference
- Username/password registration and sign-in, expiring server-side sessions, sign-out
- Create, edit and delete your own text/photo posts
- Up to four JPG/PNG/WebP photos per post, up to 5 MB each
- Likes, comments and shareable post links
- Gentle entrance, hover and like animations; reduced-motion support

## Stack

React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1 (SQLite) and R2 object storage. D1 tables and migrations are under db/ and drizzle/. Passwords use salted scrypt hashes; session tokens are stored as hashes. Registration/login attempts are rate limited.

## Run locally

Requires Node.js >=22.13.0 and npm.

1. Run npm run install:ci.
2. Run npm run build to produce the local Wrangler configuration.
3. Apply the two existing migrations in order using the commands in docs/DEPLOYMENT.md.
4. Run npm run dev and open the printed localhost URL.
5. Create a local Miniglow account to test publishing. Local and production data are separate.

Run node node_modules/typescript/bin/tsc --noEmit for type checking, and npm run build for a production build.

## Current limitations

SMS verification and password recovery are not implemented. Sample stories use externally hosted photos; fonts also have an external dependency. Public-community moderation, reporting and administration need further development before wider operation.

The current app targets Cloudflare Workers. It cannot be deployed unchanged to an ordinary Alibaba Cloud ECS Linux server: database, storage and runtime access must first be adapted. See docs/DEPLOYMENT.md.

## Repository scope

This repository contains source, lockfile, schema migrations and deployment configuration. It does not include production accounts, password hashes, session records, posts, comments, uploaded photos, credentials, node_modules, builds or local runtime databases. A GitHub source backup is not a production data backup.

The public .openai/hosting.json contains only logical DB and BUCKET binding names. Configure your own project identifier locally before hosted deployment. The maintainer’s live project identifier is intentionally omitted.

## Development references

- docs/DEPLOYMENT.md — deployment and migration status
- docs/SITES-DEVELOPMENT.md — original starter/runtime documentation
- MOTION-NOTES.md — animation choices and reference

## License

Original application code is available under the MIT License. See LICENSE and THIRD-PARTY-NOTICES.md.
