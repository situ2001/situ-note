/** Vite bundles this entry separately from server configuration and vault access. */
let renderer: Promise<typeof import('mermaid')['default']> | undefined;

async function renderDiagrams() {
  if (!document.querySelector('pre[data-obsidian-mermaid]:not([data-processed])')) return;
  const mermaid = await (renderer ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
    return mermaid;
  }));
  // Navigation may replace the document while the lazy renderer is loading.
  const nodes = document.querySelectorAll<HTMLElement>('pre[data-obsidian-mermaid]:not([data-processed])');
  if (nodes.length) await mermaid.run({ nodes });
}

function renderPage() {
  void renderDiagrams().catch(error => console.error('[obsidian] Mermaid rendering failed', error));
}

renderPage();
document.addEventListener('astro:page-load', renderPage);
export {};
