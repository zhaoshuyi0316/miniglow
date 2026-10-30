# Miniglow motion choices
Reference: https://kittenjam-motion-library.vercel.app/
- #104 Staggered Card Reveal: one-time viewport entry, 12px travel, 560ms, up to 165ms stagger. No blur or reverse playback.
- #112 Hover Lift Card: 3px lift and 2.5% image zoom on devices with a precise pointer.
- #111 Like Burst: reduced to one 16% heart pulse after a successful like; no particles or rings.
- Hero and dialogs use brief fades; no perpetual animations.
- CSS and Web Animations API; no added runtime packages. Reduced-motion preferences cancel or disable all motion. Cards remain readable without JS.
