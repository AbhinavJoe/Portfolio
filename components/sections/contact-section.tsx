import { ContactForm } from "@/components/contact-form";
import { Socials } from "@/components/socials";
import { RepoList } from "@/components/repo-list";

export function ContactSection() {
  return (
    <footer id="contact" className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 md:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-8">
        <ContactForm />
        <Socials />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h2 className="font-mono text-sm uppercase tracking-wide text-teal">GitHub Repositories</h2>
        <div className="h-80">
          <RepoList />
        </div>
      </div>
    </footer>
  );
}
