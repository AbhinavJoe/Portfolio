import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "./mermaid-diagram";

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-bg-raised p-4 font-mono text-sm" {...props} />
  );
}

type CodeElementChild = React.ReactElement<{
  className?: string;
  children?: React.ReactNode;
}>;

export const mdxComponents: MDXComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
    const codeChild = props.children as CodeElementChild | undefined;
    const className: string = codeChild?.props?.className ?? "";
    if (className.includes("language-mermaid")) {
      return <MermaidDiagram chart={String(codeChild?.props.children).trim()} />;
    }
    return <CodeBlock {...props} />;
  },
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-text" {...props} />,
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => <h3 className="mt-8 mb-3 text-xl font-semibold text-text" {...props} />,
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className="mb-4 leading-relaxed text-text-dim" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className="mb-4 list-disc pl-6 text-text-dim" {...props} />,
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="text-accent-strong underline underline-offset-2" {...props} />,
};
