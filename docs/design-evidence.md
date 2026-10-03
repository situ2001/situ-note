# Design consistency verification

Compared against main at `7706a076` using local production builds on 2026-10-03. No production deployment was performed.

## Search comparison

Before: a white panel and yellow matches; the sticky navigation paints above the overlay. With the empty dialog open, Tab twice from the input moves focus outside the dialog.

![Search on main](design-evidence/search-before.jpg)

After: paper surface, shared text/border roles, and pink matches. The Base UI portal covers the page; Tab wraps to the input, Shift+Tab wraps to Close, and the underlying site is hidden from the accessibility tree. Escape and backdrop dismissal return focus to the search trigger.

![Search with shared tokens and Base UI](design-evidence/search-after.jpg)

## Other checks

- Button and Cmd+K opening, real `NAS` results, 10 → 20 result pagination, and result-link navigation passed. Search also reopened successfully on the destination article.
- At 390×844, search starts at y=0, measures 390×844, and has no horizontal overflow. The result region scrolls independently.
- Home, archive, friends, projects, article, and colors pages had no horizontal overflow at 390px or desktop width.
- Article typography remains 17px / 32.3px line height with a 646px desktop measure.
- Light and dark palette rendering was inspected. Dark checks used temporary copies of built HTML with the `.dark` class forced and the system-preference script removed; they do not test live OS preference switching. These copies are build-only fixtures, absent from tracked source.
- Production-preview console checks found no warnings/errors during search and result navigation.
- TypeScript check passed; `pnpm test --run` passed all 8 tests across 5 files; `pnpm build` built and indexed 84 pages; `git diff --check` passed.

![Mobile search](design-evidence/search-mobile.jpg)

![Dark search](design-evidence/search-dark.jpg)

Not checked on physical mobile hardware: virtual keyboard resizing and iOS Safari chrome. Reduced-motion behavior is implemented through CSS; it was not emulated in these browser checks. Index-failure copy consumes the existing session state; network failure was not injected during browser validation.
