import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import type { Heading } from "@/lib/blog";
import { MermaidDiagram } from "./mermaid-diagram";

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return childrenToText(props.children);
  }
  return "";
}

function CodeBlock({ lang, ...props }: { lang: string } & React.HTMLAttributes<HTMLPreElement>) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-bg-raised">
      {lang && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-text-dim">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-strong" />
          {lang}
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed" {...props} />
    </div>
  );
}

type CodeElementChild = React.ReactElement<{
  className?: string;
  children?: React.ReactNode;
}>;

/**
 * Built per-post rather than as a static export, so h2/h3 can look up the
 * slug + sequential number `lib/blog.ts` extracted from the same post's raw
 * source (matched by rendered text) and render a real, linkable, numbered
 * heading instead of a plain one.
 */
export function createMdxComponents(headings: Heading[]): MDXComponents {
  const byText = new Map(headings.map((h) => [h.text, h]));

  return {
    pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
      const codeChild = props.children as CodeElementChild | undefined;
      const className: string = codeChild?.props?.className ?? "";
      if (className.includes("language-mermaid")) {
        return <MermaidDiagram chart={String(codeChild?.props.children).trim()} />;
      }
      const lang = className.replace(/^language-/, "");
      return <CodeBlock lang={lang} {...props} />;
    },
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => {
      const meta = byText.get(childrenToText(props.children));
      return (
        <h2
          id={meta?.slug}
          className="mb-4 mt-10 scroll-mt-24 flex items-baseline gap-3 font-heading text-[21px] font-semibold tracking-tight text-text"
        >
          {meta?.num && <span className="font-mono text-xs text-accent-strong">{meta.num}</span>}
          {props.children}
        </h2>
      );
    },
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => {
      const meta = byText.get(childrenToText(props.children));
      return (
        <h3 id={meta?.slug} className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold text-text" {...props} />
      );
    },
    p: (props: React.ComponentPropsWithoutRef<"p">) => <p className="mb-4 leading-relaxed text-text-dim" {...props} />,
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className="mb-4 list-disc pl-6 text-text-dim" {...props} />,
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className="mb-4 list-decimal pl-6 text-text-dim" {...props} />,
    li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="mb-1 leading-relaxed" {...props} />,
    blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="mb-4 border-l-2 border-accent-strong bg-[color-mix(in_srgb,var(--accent)_7%,transparent)] py-2 pl-4 text-text-dim"
        {...props}
      />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => {
      // Fenced code blocks compile to <pre><code class="language-x">…</code></pre>
      // and are already styled by the `pre` mapping above — only style bare
      // inline `code` spans (no language- className) with the pill treatment,
      // so block code doesn't get double-styled.
      const isFencedBlock = typeof props.className === "string" && props.className.startsWith("language-");
      if (isFencedBlock) return <code {...props} />;
      return <code className="rounded bg-bg-raised px-1.5 py-0.5 font-mono text-sm text-text" {...props} />;
    },
    a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="text-accent-strong underline underline-offset-2" {...props} />,
  };
}
