"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Behavior unchanged from the previous form — wiring to an actual
    // submit endpoint is out of scope for this revamp (spec §9).
    setTimeout(() => setStatus("sent"), 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-text-dim">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-text-dim">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm text-text-dim">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <Button type="submit" disabled={status === "submitting"}>
        {status === "sent" ? "Sent" : status === "submitting" ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
