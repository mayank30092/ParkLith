import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(() => {
    try {
      const v = localStorage.getItem("parklith:theme");
      if (v) return v === "light";
    } catch (_) {}
    // default: respect system preference
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
      className="theme-toggle"
      onClick={() => setLight((s) => !s)}
      aria-pressed={light}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
    >
      {light ? "🌙" : "🌞"}
    </button>
  );
}
