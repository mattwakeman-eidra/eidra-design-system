import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

// Storybook's <Markdown> block renders ```mermaid fences as plain <code>; this
// renders the fence body to an inline SVG diagram instead. Used via the code
// override in DocMarkdown.
//
// Each render gets a unique DOM id (mermaid.render mounts a temp node by id, so
// a shared id collides under React StrictMode's double-invoke).
let seq = 0;

export function Mermaid({ chart }: { chart: string }) {
  const baseId = `eidra-mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Track the toolbar theme so diagrams read in both light and dark.
    const dark =
      (document.querySelector('[data-theme]')?.getAttribute('data-theme') ??
        document.documentElement.getAttribute('data-theme')) === 'dark';

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: dark ? 'dark' : 'neutral',
      fontFamily: 'var(--eidra-font-family-sans, system-ui, sans-serif)',
    });

    mermaid
      .render(`${baseId}-${seq++}`, chart.trim())
      .then((result) => {
        if (!cancelled) {
          setError(null);
          setSvg(result.svg);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
    };
  }, [chart, baseId]);

  if (error) {
    return <pre>{error}</pre>;
  }
  // mermaid output is sanitised (securityLevel: 'strict') before injection.
  return <div className="eidra-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
}
