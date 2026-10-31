# Third-party notices

The root MIT license applies to the original Miniglow application code and documentation. Third-party software retains its own copyright and license terms.

## Bundled source

- Sites Vite integration: scripts/vite/sites-vite-plugin.LICENSE (MIT, OpenAI).
- Vendored shadcn/Tailwind source: vendor/shadcn-tailwind-4.13.0.LICENSE.md (MIT, shadcn).

These notices must be retained with the corresponding source when redistributed. Dependencies installed from package-lock.json carry their respective licenses in their published packages; the root license does not replace them.

## External assets and references

Sample images are loaded from Unsplash URLs in app/seeds.ts and app/community.tsx. They are not owned by this project and are not relicensed under MIT. Review the source image licenses or use your own photos before redistributing a deployed copy.

Google Fonts resources are referenced from app/globals.css and retain their own licenses. Original posts, uploaded images, personal data and the contents of the live database are not part of this source distribution.

Motion inspiration: https://kittenjam-motion-library.vercel.app/ (see MOTION-NOTES.md). Miniglow uses its own small CSS/Web Animations implementation rather than bundling that site's source.
