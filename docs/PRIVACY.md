# Public source privacy

The public repository contains source code, schema-only migrations, fictional sample stories and third-party notices. It does not include live accounts, password hashes, session tokens, IP-rate-limit records, user posts/comments or uploaded media.

Production hostnames and the maintainer’s Sites project identifier have been removed from the public source and reachable branch history. The GitHub account handle and copyright attribution remain public.

Keep runtime databases, uploaded media, exports, credentials, logs and local environment files out of Git. A .gitignore rule does not remove an already tracked file or erase a previously published copy. Do not attach real user data or secrets to public issues.

The configuration committed here is intended for independent deployment with your own resources.
