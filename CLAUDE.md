# Frontend conventions

Before writing or changing any UI, read `DESIGN_SYSTEM.md` (and look at `/design-system`, the live version) and follow it. When you add or change a shared class or component, update the `/design-system` page too. In short:

- Use the shared classes in `app/globals.css` (`.btn`, `.field`, `.card`, `.chip`, `.badge`, `.eyebrow`, `.section`, `.container-page`) and components in `components/ui/` instead of one-off styles.
- Brand colour is `brand-*` (orange); never raw `orange-*`. Neutrals are `zinc-*`; no `bg-black`.
- Use `<Logo />` for the brand, never bare "Caesura" text.
- Icons come from `lucide-react`. No hand-pasted SVG paths.
- No blurred glows/blobs. Decoration is `Splash` / `DotPattern` / photography.
- Never put a border and an outline/ring on the same element; don't add `cursor-pointer` to buttons (it's global).
- Signed-in pages use `PageHero` for the header and `EmptyState` for empty/error states.
- This is Next.js 16 + Tailwind v4: check `node_modules/next/dist/docs/` before using unfamiliar Next APIs.
