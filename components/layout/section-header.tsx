type SectionHeaderProps = {
  index: string;
  title: string;
  /** Opt this heading in as a scroll-trace waypoint. */
  traceGroup?: string;
};

/** "01  About ───────── +" — the numbered, ruled heading every section opens with. */
export function SectionHeader({ index, title, traceGroup }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span aria-hidden="true" className="font-mono text-sm text-accent">
        {index}
      </span>
      <h2
        data-trace-group={traceGroup}
        className="text-xl font-semibold tracking-tight sm:text-2xl"
      >
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span aria-hidden="true" className="-ml-2 select-none font-mono text-[10px] text-faint">
        +
      </span>
    </div>
  );
}
