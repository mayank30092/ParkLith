import { useEffect, useRef } from "react";

// ── Ring Chart ─────────────────────────────────────────────
const R = 60;
const CIRC = 2 * Math.PI * R;

export function OccupancyRing({ occupied, total }) {
  const occRef = useRef(null);
  const vacRef = useRef(null);

  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const vacant = total - occupied;

  useEffect(() => {
    if (!occRef.current || !vacRef.current) return;

    const occFrac = total > 0 ? occupied / total : 0;
    const vacFrac = total > 0 ? vacant / total : 0;
    const gap = total > 0 ? 0.03 : 0;

    const eOcc = Math.max(0, occFrac - gap);
    const eVac = Math.max(0, vacFrac - gap);

    occRef.current.style.strokeDasharray = `${CIRC * eOcc} ${CIRC * (1 - eOcc)}`;
    occRef.current.style.strokeDashoffset = "0";

    vacRef.current.style.strokeDasharray = `${CIRC * eVac} ${CIRC * (1 - eVac)}`;
    vacRef.current.style.strokeDashoffset = `${-CIRC * occFrac}`;
  }, [occupied, vacant, total]);

  const pctClass = pct > 66 ? "high" : pct > 33 ? "mid" : "low";

  return (
    <div className="pk-ring-wrap">
      <div className="pk-ring-container">
        <svg
          className="pk-ring-svg"
          width="148"
          height="148"
          viewBox="0 0 148 148"
          aria-label={`Occupancy: ${pct}%`}
          role="img"
        >
          {/* track */}
          <circle className="pk-ring-bg" cx="74" cy="74" r={R} />
          {/* occupied arc */}
          <circle
            ref={occRef}
            className="pk-ring-occupied"
            cx="74"
            cy="74"
            r={R}
            strokeDasharray={`0 ${CIRC}`}
            strokeDashoffset="0"
          />
          {/* vacant arc */}
          <circle
            ref={vacRef}
            className="pk-ring-vacant"
            cx="74"
            cy="74"
            r={R}
            strokeDasharray={`0 ${CIRC}`}
            strokeDashoffset="0"
          />
        </svg>

        <div className="pk-ring-center">
          <span className={`pk-ring-pct ${pctClass}`}>{pct}%</span>
          <span className="pk-ring-pct-label">occupied</span>
        </div>
      </div>

      <div className="pk-ring-legend">
        <div className="pk-ring-legend-item">
          <div
            className="pk-ring-legend-dot"
            style={{ background: "var(--c-red-strong)" }}
          />
          <span>
            Occupied&nbsp;
            <strong style={{ color: "var(--c-red-mid)" }}>{occupied}</strong>
          </span>
        </div>
        <div className="pk-ring-legend-item">
          <div
            className="pk-ring-legend-dot"
            style={{ background: "var(--c-grn-strong)" }}
          />
          <span>
            Vacant&nbsp;
            <strong style={{ color: "var(--c-grn-mid)" }}>{vacant}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── History Bar Chart ──────────────────────────────────────
const MAX_HEIGHT = 88;
const MAX_SLOTS = 3;

export function HistoryBarChart({ history }) {
  if (!history.length) {
    return <div className="pk-chart-empty">collecting data…</div>;
  }

  return (
    <>
      <div className="pk-bar-chart">
        {history.map((point, i) => {
          const occH = Math.max(
            3,
            Math.round((point.occupied / MAX_SLOTS) * MAX_HEIGHT),
          );
          const vacH = Math.max(
            3,
            Math.round((point.vacant / MAX_SLOTS) * MAX_HEIGHT),
          );
          const isLatest = i === history.length - 1;

          return (
            <div
              className="pk-bar-group"
              key={i}
              title={`${point.time} · occ:${point.occupied} vac:${point.vacant}`}
            >
              <div className="pk-bar-pair">
                <div
                  className="pk-bar occ"
                  style={{ height: occH, opacity: isLatest ? 1 : 0.55 }}
                />
                <div
                  className="pk-bar vac"
                  style={{ height: vacH, opacity: isLatest ? 1 : 0.55 }}
                />
              </div>
              <span
                className="pk-bar-time"
                style={{ opacity: isLatest ? 1 : 0.6 }}
              >
                {point.time}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pk-bar-legend">
        <div className="pk-bar-legend-item">
          <div
            className="pk-bar-legend-dot"
            style={{ background: "var(--c-red-strong)" }}
          />
          <span>Occupied</span>
        </div>
        <div className="pk-bar-legend-item">
          <div
            className="pk-bar-legend-dot"
            style={{ background: "var(--c-grn-strong)" }}
          />
          <span>Vacant</span>
        </div>
      </div>
    </>
  );
}
