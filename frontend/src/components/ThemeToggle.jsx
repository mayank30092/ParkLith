import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(() => {
    try {
      const v = localStorage.getItem("parklith:theme");
      if (v) return v === "light";
    } catch (_) {}
    return (
      window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false
    );
  });

  useEffect(() => {
    if (light) {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
    try {
      localStorage.setItem("parklith:theme", light ? "light" : "dark");
    } catch (_) {}
  }, [light]);

  return (
    <button
      onClick={() => setLight((s) => !s)}
      aria-pressed={light}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors text-sm"
    >
      {light ? "🌙" : "🌞"}
    </button>
  );
}
