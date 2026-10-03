# Situ Note design

The site’s identity is warm paper, soft ink, misty pink marker accents, and generous serif reading text. Interface controls use sans serif; code uses Maple Mono. Preserve these choices when adding components or adapting the identity to another tool.

## Tokens

`src/features/site/global.css` owns browser tokens and Tailwind configuration. Use their Tailwind utilities or CSS variables; component-local palettes should not redefine a shared role.

| Role | Token / utility | Use |
| --- | --- | --- |
| Page and main text | `page`, `content` | Shared shell and primary text |
| Supporting text | `secondary` | Descriptions and quote text |
| Metadata | `muted` | Dates, captions, placeholders, footer |
| Decoration | `decoration` | Archive years and resting decorative icons |
| Surfaces | `surface`, `surface-strong` | Quotes/code/hover backgrounds; controls and keyboard chips |
| Overlay | `panel`, `backdrop` | Search popup and scrim |
| Rules | `border`, `border-strong`, `quote-rule` | Dividers, emphasized control borders, quotation accents |
| Emphasis | `highlight` | Marker backgrounds; not a primary text color |
| Keyboard focus | `focus` | Shared visible outline |
| Motion | `duration-feedback`, `duration-emphasis` | 200ms feedback, 300ms marker/logo motion; explicit `@utility` mappings |

`paper` and `ink` retain the original light identity colors. Theme-aware roles map to them in light mode and to zinc/blue-washed surfaces in dark mode. `.dark` on the document is the effective theme selector for both tokens and Tailwind variants. It follows system preference on initial load, OS changes, and Astro route swaps. There is no stored manual override.

Reading uses `text-prose`, its 1.9 line height, `tracking-prose`, and `max-w-measure` (38 CJK characters). Keep UI typography distinct. Component-specific corner sizes and spacing remain appropriate to their layouts.

## Patterns

- **Reading:** blog posts, Insights articles, and changelog share serif prose, narrow measure, underlined links, warm code/table/quote surfaces; start alignment on narrow screens.
- **Metadata:** use `text-muted` consistently across archive rows, article dates/categories, introductions, placeholders, and footer.
- **Markers:** section headings, project titles, and friend titles share the highlight color while retaining their own marker geometry.
- **Cards:** friends have resting borders; projects reveal borders on hover. Both share page/surface and border roles.
- **Search:** Base UI Dialog owns modal focus, dismissal, and scroll locking. SearchSession retains Pagefind queries/results and pagination. The panel uses shared tokens, fills the mobile viewport, and scrolls its result region. Index initialization failures have an explicit message.
- **Focus and motion:** global focus styling applies on every page; reduced-motion preference removes CSS animations and transitions.

`/colors` remains an experimental color page, with additional shared-role previews. Swatch edits are temporary and resettable; they do not save design changes.

## Other tools and future components

Carry the role meanings, identity colors, typography roles, and marker motif into another tool; adapt layout and scale to its medium. No token package is required for this single browser consumer.

Base UI is styled directly with these tokens. If shadcn components are added later, map its background/foreground, popover, muted, border/input, and ring variables to the corresponding site roles before adopting default styles. Keep the pale marker accent distinct from action text.

## Verification

Review home, archive, article, friends/projects, `/colors`, and open search in both themes and narrow/wide viewports. For search, check trigger and Cmd/Ctrl+K opening, typing/results, pagination, Tab/Shift+Tab containment, Escape/backdrop/close dismissal, restored trigger focus, and route navigation. Run `pnpm test --run` and `pnpm build`.
