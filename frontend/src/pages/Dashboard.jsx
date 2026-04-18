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
    occupancyPct > 66
      ? "bg-red-500"
      : occupancyPct > 33
        ? "bg-yellow-400"
        : "bg-blue-600";

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      {/* ── HEADER ── */}
      <header className="bg-blue-700 text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white text-blue-700 font-bold text-sm w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            P
          </div>
          <div>
            <div className="text-base font-semibold leading-tight">
              ParkLith
            </div>
            <div className="text-xs text-blue-200">Campus · 3 Sensors</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-right font-mono">
            <div className="text-sm font-semibold">{formatTime(now)}</div>
            <div className="text-xs text-blue-200">
              {now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </div>
          </div>

          <button
            className="bg-white text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
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

          {isRefreshing && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
              serverStatus === "online"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-white ${
                serverStatus === "online" ? "animate-pulse" : ""
              }`}
            />
            {serverStatus === "online" ? "Live" : "Offline"}
          </div>
        </div>
      </header>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Slots
            </span>
            <span className="text-base">📡</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">{totalSlots}</div>
          <div className="text-xs text-slate-400 mt-1">ultrasonic sensors</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Occupied
            </span>
            <span className="text-base">🚗</span>
          </div>
          <div className="text-3xl font-bold text-red-500">{occupiedSlots}</div>
          <div
            className={`text-xs mt-1 ${
              trend > 0
                ? "text-red-500"
                : trend < 0
                  ? "text-green-500"
                  : "text-slate-400"
            }`}
          >
            {trendLabel}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Vacant
            </span>
            <span className="text-base">✅</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{vacantSlots}</div>
          <div className="text-xs text-slate-400 mt-1">
            {occupancyPct}% full
          </div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Occupancy{" "}
            <span className="text-blue-500 font-normal normal-case">live</span>
          </div>
          <OccupancyRing occupied={occupiedSlots} total={totalSlots} />
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Session History{" "}
            <span className="text-blue-500 font-normal normal-case">
              last {history.length} polls · 5s
            </span>
          </div>
          <HistoryBarChart history={history} />
        </div>
      </div>

      {/* ── AVAILABILITY BAR ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Availability
          </span>
          <span className="text-sm text-slate-500">
            <span className="text-green-600 font-semibold">{vacantSlots}</span>
            {" / "}
            <span className="text-blue-700 font-semibold">{totalSlots}</span>
            {" free"}
          </span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${fillLevel}`}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span className="font-medium text-blue-600">
            {occupancyPct}% occupied
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* ── SLOT GRID ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Parking Layout
          </span>
          <span className="text-xs text-slate-400">
            {slots.length} sensors active
          </span>
        </div>
        <SlotGrid slots={slots} />
      </div>

      {/* ── FOOTER ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200">
        <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
          <div className="px-2">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Last Poll
            </div>
            <div className="text-sm font-semibold text-slate-700 font-mono">
              {lastUpdated ? formatTime(lastUpdated) : "—"}
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Poll Count
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {fetchCount}
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Interval
            </div>
            <div className="text-sm font-semibold text-slate-700">5 000 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
