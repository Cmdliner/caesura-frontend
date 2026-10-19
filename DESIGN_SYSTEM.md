# Caesura design system

> **See it live at `/design-system`** (`app/design-system/page.tsx`): every token, component and state rendered from the real code. Update that page whenever you add or change a shared class/component.

Everything below already exists in `app/globals.css` or `components/ui/`. Use these instead of writing one-off styles.

## Principles
1. **One accent.** Orange is the brand. Everything else is neutral (`zinc`). Don't introduce other accent colours.
2. **Flat and crisp.** No blurred glows, orbs or animated blobs. Decoration is flat vector (`Splash`, `DotPattern`) or photography.
3. **One border, one ring.** A bordered element never also gets an outline or ring. Focus is handled globally (see Focus).
4. **Everything clickable looks clickable.** Buttons get `cursor: pointer` globally; use `disabled` (not a class) for disabled state.

## Colour
| Role | Token | Use |
| --- | --- | --- |
| Brand | `brand-600` | Filled buttons, solid brand sections |
| Brand hover | `brand-700` | Hover/pressed |
| Brand tint | `brand-50` / `brand-100` / `brand-200` | Section backgrounds, icon tiles, splashes |
| Brand text on white | `brand-700` (or `.eyebrow`) | Links, labels (meets contrast) |
| Brand text on dark | `brand-400` | Eyebrows/numbers on dark backgrounds |
| Ink | `zinc-950` headings, `zinc-600` body, `zinc-500` secondary | Never go lighter than `zinc-500` for text |
| Surfaces | `white`, `zinc-50`, `zinc-950` (dark sections) | |
| Borders | `zinc-200` (cards), `zinc-300` (inputs, outline buttons) | |

Never use raw `orange-*`; use `brand-*`. Never use `bg-black`; use `zinc-950`.

## Typography
- **Display / logo:** `font-brand` (Akaya Kanadaka), for the wordmark, hero and CTA headlines, and 404/500 numerals.
- **Everything else:** Sora (default `font-sans`).
- Section title: `text-4xl md:text-5xl font-bold tracking-tight`. Page title: `text-3xl sm:text-4xl font-extrabold tracking-tight`.
- Eyebrow label above titles: `.eyebrow` (`.eyebrow-light` on dark backgrounds).

## Spacing and layout
- Marketing sections: `<section className="section ...">` + `<div className="container-page">` (max 72rem).
- App pages: `container-app` (max 75rem), or a specific max-width where the page needs it.
- App nav is 60px tall; pages offset with `pt-[60px]`.
- Radius: inputs `rounded-xl`, cards `rounded-2xl`/`3xl`, buttons and chips fully round.

## Components (CSS classes)
| Class | What |
| --- | --- |
| `.btn` + `.btn-md`/`.btn-lg` | Base button (pill). Combine with a variant |
| `.btn-primary` / `.btn-dark` / `.btn-outline` / `.btn-outline-light` | Variants. Primary = brand fill; dark = zinc-900; outline-light is for dark/photo backgrounds |
| `.field` | Text input / textarea / select styling |
| `.card`, `.card-interactive` | White bordered surface; hover lift for clickable cards |
| `.icon-tile` | Rounded square holding a Lucide icon |
| `.badge` + `-brand` / `-neutral` / `-success` | Status pills |
| `.chip` | Filter pill; `aria-pressed="true"` marks the active one |
| `.pattern-dots` / `.pattern-grid` / `.pattern-stripes` | Flat textures (tint with `text-*`) |

## Components (React, `components/ui/`)
| Component | What |
| --- | --- |
| `Splash` (`variant` a/b/c) | Flat orange paint-splash vector. Tint with `text-brand-*`. Parent must be `relative overflow-hidden` |
| `WaveDivider` | Wavy section edge. Colour it with the *neighbouring* section's background (`text-brand-50`, `text-zinc-50`...) and give the section extra top/bottom padding. Used on the stats band |
| `DotPattern` | Dot texture; fade with a `[mask-image:...]` class |
| `SectionHeading` | Eyebrow + title + description for marketing sections (`tone="dark"` on dark/brand backgrounds) |
| `PageHero` | Header band for every signed-in page. `compact` = one slim row (title + count inline, filters/actions on the right) for browse/list pages so content starts at the top |
| `EmptyState` | Empty blocks inside pages (`fullPage` centres it below the nav) |
| `ErrorState` (from `empty-state`) | **Every failed load.** Friendly copy + Try again + optional way back |
| `PageLoader` (from `empty-state`) | Every loading spinner |
| `Alert` | Inline form/page banners (`error` / `success` / `info`). Never hand-roll red boxes |
| `StatusPage` | Full-page 404 / 500 |
| `Logo` / `LogoMark` | Brand mark + wordmark |
| `StoreBadge` | App Store / Google Play buttons ("Soon" until a URL is set in `lib/app-links.ts`) |
| `Phone` + `LibraryScreen` / `ReaderScreen` | Illustrative device mockups (drawn, not real screenshots) |
| `MenuButton` (layout) | Mobile menu trigger: `pill` (default) / `dots` / `lines` |

## Icons
Use **Lucide** (`lucide-react`). Default `h-4 w-4` inline with text, `h-5 w-5` in icon tiles, `strokeWidth={1.6}` for large decorative icons. Don't paste inline `<svg>` paths; the one exception is social brand marks (Lucide has none), see `components/layout/footer.tsx`.

## Logo
Use `<Logo />` (`components/ui/logo.tsx`: mark + wordmark; `tone="light"` on dark/photo backgrounds) wherever the brand appears; never bare "Caesura" text. `<LogoMark />` is the mark alone. Placements: home header, app nav, mobile menu, footer, auth pages, 404/500, favicon, iOS icon (`app/apple-icon.tsx`), share image (`app/opengraph-image.tsx`), web manifest (`app/manifest.ts`).

## Site icon
The favicon is `app/icon.svg` (dark tile, orange C, white full stop; the dot is the pause in "caesura"). Alternatives and wordmark lockups live at `/icon-options` (`app/icon-options/page.tsx`), kept as a design reference.

## Books
- **`BookCard variant="cover"`** is the one book tile everywhere (Discover, Library, genre pages): 2:3 cover with ring + hover lift, title (2 lines), author or `meta`, reads. Pass `progress` for the reading bar and `overlayAction="read"` in the library. No cover = brand-tinted tile with the title in the brand font.
- **Reader** (`app/book/[slug]`): brand-font chapter title with an eyebrow, orange drop-cap, thin orange progress line, desktop contents rail (≥1024px) with cover + overall progress, and Light / Paper / Dark themes + text size via `--reader-*` CSS variables (`components/reading/reader-settings.tsx`). Anything that renders chapter text must use those variables.
- **Editor** (`components/editor/story-editor.tsx`): Lucide toolbar with brand active states; the chapter title field uses the same brand-font style as the reader heading, so writing looks like reading.

## Imagery
Photos come from Unsplash (hotlinked with `?auto=format&fit=crop&w=…&q=70`). Always put a dark gradient/scrim under text on a photo. The hero photo lives at `public/images/hero-bg.avif`.

## Focus and interaction
- Keyboard focus = a single 2px brand outline (global `:focus-visible`). Inputs show a brand border + soft ring instead (`.field`).
- Do **not** add `focus:ring-*`, `outline-*` or `border` changes to buttons/links to simulate focus.
- Hover on cards: `.card-interactive`. Hover on buttons: handled by the variant.
- Motion respects `prefers-reduced-motion` (global).

## Failure and loading states
- Failed fetch: `<ErrorState />` (add `backHref` when there's a sensible place to go). Missing record: `EmptyState` with a `BookX`/`Compass` icon and a way forward. Never a bare red box or one line of text.
- Loading: skeletons (`.skeleton`) for lists, `PageLoader` for whole pages.
- Form errors: `Alert`. Transient feedback: sonner toasts.

## Page recipes
- **Marketing section:** `section` → optional `Splash`/`DotPattern` → `container-page` → `SectionHeading` → content. Alternate backgrounds: white → brand-50 → zinc-950 → zinc-50 → white → zinc-950. On dark sections keep splashes muted (`text-brand-600/10`–`/15`); never bright orange fills behind text-heavy content.
- **Navigation:** home uses `components/home/header.tsx`; every other page uses `AppNav` (handles signed-in and signed-out). The home header is transparent over the hero and shrinks to a floating pill on scroll; `AppNav` is a plain full-width bar (no pill).
- **Mobile menu:** both headers open `MobileMenu` (slide-in sheet) from a `MenuButton`. Add new top-level links to the lists in the header components so desktop and mobile stay in sync.
- **Marketing page without a hero photo** (e.g. `/download`): use `<Header solid />`, then sections per the rhythm above, ending with `<Cta />` and `<Footer />`.
- **App page:** `AppNav` → `main.pt-[60px]` → `PageHero` → content container → `EmptyState` for empty/error.
- **Auth pages:** flat `zinc-50` background with `Splash` corners + `DotPattern`; the form card is opaque white with a single border.
