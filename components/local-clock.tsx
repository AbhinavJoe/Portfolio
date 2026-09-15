"use client";

import { useEffect, useState } from "react";
import { clock } from "@/lib/data/status";

function format(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: clock.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function LocalClock() {
  // Start empty so server and client markup match; fill in after mount.
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-[11px] uppercase tracking-wide text-text-dim">
      <span className="tabular-nums">{time || "--:--"}</span> {clock.label}
    </p>
  );
}
