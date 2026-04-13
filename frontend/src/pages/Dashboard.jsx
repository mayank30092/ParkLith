import { useState, useEffect, useRef } from "react";
import SlotGrid from "../components/SlotGrid";
import { OccupancyRing, HistoryBarChart } from "../components/OccupancyChart";
import ThemeToggle from "../components/ThemeToggle";

const MAX_HISTORY = 20;

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatTimeShort(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [serverStatus, setServerStatus] = useState("offline");
  const [history, setHistory] = useState([]);
  const [fetchCount, setFetchCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState(new Date());
  const timeoutRef = useRef(null);

  // clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchSlots = async () => {
    setIsRefreshing(true);
    try {
      const apiBase = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBase}/slots`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const trimmed = data.slice(0, 3);

      setSlots(trimmed);
      setLastUpdated(new Date());
      setServerStatus("online");
      setFetchCount((c) => c + 1);

      const occ = trimmed.filter((s) => s.status === "occupied").length;
      const vac = trimmed.filter((s) => s.status === "vacant").length;

      setHistory((prev) =>
        [
          ...prev,
          { time: formatTimeShort(new Date()), occupied: occ, vacant: vac },
        ].slice(-MAX_HISTORY),
      );
    } catch (err) {
      console.error(err);
      setServerStatus("offline");
    } finally {
      timeoutRef.current = setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    fetchSlots();
    const id = setInterval(fetchSlots, 5000);
    return () => {
      clearInterval(id);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // derived
  const totalSlots = slots.length;
  const occupiedSlots = slots.filter((s) => s.status === "occupied").length;
  const vacantSlots = slots.filter((s) => s.status === "vacant").length;
  const occupancyPct =
    totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

  const trend =
    history.length >= 2
      ? history[history.length - 1].occupied -
        history[history.length - 2].occupied
      : 0;
  const trendLabel =
    trend > 0
      ? `↑ ${trend} since last poll`
      : trend < 0
        ? `↓ ${Math.abs(trend)} since last poll`
        : "— no change";

  const fillLevel =
    occupancyPct > 66 ? "high" : occupancyPct > 33 ? "mid" : "low";

  return (
    <div className="pk-page">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="pk-header">
        <div className="pk-header-left">
          <div className="pk-logo-icon">🅿</div>
          <div>
            <div className="pk-logo-name">ParkLith</div>
            <div className="pk-logo-sub">Campus · 3 Sensors</div>
          </div>
        </div>

        <div className="pk-header-right">
          {/* live clock */}
          <div
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.65rem",
              color: "var(--c-text-2)",
              letterSpacing: "0.1em",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span style={{ color: "var(--c-text-1)", fontSize: "0.75rem" }}>
              {formatTime(now)}
            </span>
            <span>
              {now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>

          <button
            className="pk-download-btn"
            onClick={() =>
              window.open(
                "https://expo.dev/artifacts/eas/dJE8DvtVyq9vq6HKauM1QB.apk",
                "_blank",
              )
            }
          >
            ⬇ APK
          </button>

          <ThemeToggle />

          <div className={`pk-spinner ${isRefreshing ? "spinning" : ""}`} />

          <div className={`pk-status-pill ${serverStatus}`}>
            <span className="pk-status-dot" />
            {serverStatus === "online" ? "Live" : "Offline"}
          </div>
        </div>
      </header>

      {/* ── STAT CARDS ──────────────────────────────────────── */}
      <div className="pk-stat-grid">
        <div className="pk-stat-card glow-slate">
          <div className="pk-stat-row">
            <span className="pk-stat-label">Total Slots</span>
            <span className="pk-stat-icon">📡</span>
          </div>
          <div className="pk-stat-value slate">{totalSlots}</div>
          <div className="pk-stat-sub">ultrasonic sensors</div>
        </div>

        <div className="pk-stat-card glow-red">
          <div className="pk-stat-row">
            <span className="pk-stat-label">Occupied</span>
            <span className="pk-stat-icon">🚗</span>
          </div>
          <div className="pk-stat-value red">{occupiedSlots}</div>
          <div
            className={`pk-stat-sub ${trend > 0 ? "trend-up" : trend < 0 ? "trend-down" : ""}`}
          >
            {trendLabel}
          </div>
        </div>

        <div className="pk-stat-card glow-green">
          <div className="pk-stat-row">
            <span className="pk-stat-label">Vacant</span>
            <span className="pk-stat-icon">✅</span>
          </div>
          <div className="pk-stat-value green">{vacantSlots}</div>
          <div className="pk-stat-sub">{occupancyPct}% full</div>
        </div>
      </div>

      {/* ── CHARTS ──────────────────────────────────────────── */}
      <div className="pk-charts-row">
        <div className="pk-card">
          <div className="pk-card-title">
            Occupancy <span>live</span>
          </div>
          <OccupancyRing occupied={occupiedSlots} total={totalSlots} />
        </div>

        <div className="pk-card">
          <div className="pk-card-title">
            Session History
            <span>last {history.length} polls · 5 s</span>
          </div>
          <HistoryBarChart history={history} />
        </div>
      </div>

      {/* ── AVAILABILITY BAR ────────────────────────────────── */}
      <div className="pk-card">
        <div className="pk-avail-header">
          <span className="pk-avail-label">Availability</span>
          <span className="pk-avail-count">
            <span className="free">{vacantSlots}</span>
            {" / "}
            <span className="total">{totalSlots}</span>
            {" free"}
          </span>
        </div>
        <div className="pk-avail-track">
          <div
            className={`pk-avail-fill ${fillLevel}`}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
        <div className="pk-avail-ticks">
          <span>0%</span>
          <span className={`pct ${fillLevel}`}>{occupancyPct}% occupied</span>
          <span>100%</span>
        </div>
      </div>

      {/* ── SLOT GRID ───────────────────────────────────────── */}
      <div className="pk-card">
        <div className="pk-slots-header">
          <span className="pk-slots-title">Parking Layout</span>
          <span className="pk-slots-count">{slots.length} sensors active</span>
        </div>
        <SlotGrid slots={slots} />
      </div>

      {/* ── SYSTEM FOOTER ───────────────────────────────────── */}
      <div className="pk-card">
        <div className="pk-footer">
          <div className="pk-footer-item">
            <div className="pk-footer-label">Last Poll</div>
            <div className="pk-footer-value">
              {lastUpdated ? formatTime(lastUpdated) : "—"}
            </div>
          </div>
          <div className="pk-footer-item">
            <div className="pk-footer-label">Poll Count</div>
            <div className="pk-footer-value">{fetchCount}</div>
          </div>
          <div className="pk-footer-item">
            <div className="pk-footer-label">Interval</div>
            <div className="pk-footer-value">5 000 ms</div>
          </div>
          <div className="pk-footer-item">
            <div className="pk-footer-label">Endpoint</div>
            <div className="pk-footer-value muted">
              {import.meta.env.VITE_API_URL || "localhost"}/slots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
