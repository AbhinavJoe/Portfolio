// Note: brief specified lucide-react's Github/Linkedin icons, but
// lucide-react doesn't export brand icons. Using react-icons/fa6 instead,
// which is already a project dependency and matches the icons used by the
// original component.
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export function Socials() {
  return (
    <div className="flex items-center justify-center gap-4 md:justify-start">
      <span className="text-sm text-text-dim">Find me on:</span>
      <a
        href="https://www.linkedin.com/in/abhinavjoe/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-text hover:text-accent-strong"
      >
        <FaLinkedin size={22} />
      </a>
      <a
        href="https://github.com/abhinavjoe"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-text hover:text-accent-strong"
      >
        <FaGithub size={22} />
      </a>
    </div>
  );
}
