import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "./mermaid-diagram";

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-bg-raised p-4 font-mono text-sm" {...props} />
  );
}

export const mdxComponents: MDXComponents = {
  pre: (props: any) => {
    const codeChild = props.children;
    const className: string = codeChild?.props?.className ?? "";
    if (className.includes("language-mermaid")) {
      return <MermaidDiagram chart={String(codeChild.props.children).trim()} />;
    }
    return <CodeBlock {...props} />;
  },
  h2: (props: any) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-text" {...props} />,
  h3: (props: any) => <h3 className="mt-8 mb-3 text-xl font-semibold text-text" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-text-dim" {...props} />,
  ul: (props: any) => <ul className="mb-4 list-disc pl-6 text-text-dim" {...props} />,
  a: (props: any) => <a className="text-accent-strong underline underline-offset-2" {...props} />,
};
