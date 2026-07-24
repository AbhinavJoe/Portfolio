// react-icons/fa6 supplies the brand glyphs (lucide has none).
import { FaGithub, FaLinkedin, FaPenNib } from "react-icons/fa6";

const LINKS = [
  { href: "https://github.com/abhinavjoe", label: "GitHub", Icon: FaGithub, external: true },
  { href: "https://www.linkedin.com/in/abhinavjoe/", label: "LinkedIn", Icon: FaLinkedin, external: true },
  { href: "/blog", label: "Writing", Icon: FaPenNib, external: false },
];

/** Row of 44px icon tiles. `traced` opts them into the scroll-trace marker (once per page). */
export function Socials({ traced = false }: { traced?: boolean }) {
  const trace = traced ? { "data-trace-group": "socials", "data-trace-shape": "circle" } : {};

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      {LINKS.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          title={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...trace}
          className="trace-tile flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
