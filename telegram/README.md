# Telegram Instant View

`situ2001.com.iv` is the template for the site's blog article HTML. It reads the
title, description, author, publication time and preview image, then extracts
`article.reading`. Navigation and page footer sit outside that body. A leading
figure becomes the cover with its caption; later figures retain their position.

The image service generates full-size local JPEG/PNG/GIF variants and exposes
their URLs through `data-instant-view-src` because [IV documents these image formats](https://instantview.telegram.org/docs#supported-types).
The template replaces browser WebP sources with those URLs. External images
must themselves use a supported format. KaTeX and hydrated article charts are
marked `@unsupported`, as [Telegram requires complete essential content](https://instantview.telegram.org/checklist#2-3-pages-featuring-content-not-supported-by-the-iv-format).

## Activate

1. Deploy this version of the blog so Telegram can fetch the generated HTML and images.
2. Log in at [My Templates](https://instantview.telegram.org/my), create a template
   for `situ2001.com`, and paste `situ2001.com.iv` into its rules editor.
3. Check a text article, a photo article, a code/table article, a GIF article and
   the MDX chart article. Verify the unsupported chart/math articles do not create
   incomplete IV pages. Use the editor's **View in Telegram** to check an actual IV.
4. Save the template and copy its generated `t.me/iv?url=…&rhash=…` link. That link
   lets readers use this template directly. To make plain blog URLs show an IV for
   everyone, the template needs Telegram team's approval.

The two activation paths above are documented in
[Publishing templates](https://instantview.telegram.org/#publishing-templates).
No template hash or approval is fabricated by the site. Local DOM checks do not
execute Telegram's rule engine and cannot establish that the template is accepted.
