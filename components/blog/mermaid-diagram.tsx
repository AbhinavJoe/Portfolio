"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark" });
      initialized = true;
    }
    let cancelled = false;
    mermaid.render(`mermaid-${id}`, chart).then(({ svg: rendered }) => {
      if (!cancelled) setSvg(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      data-testid="mermaid-container"
      className="my-6 overflow-x-auto rounded-lg border border-border bg-bg-raised p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
