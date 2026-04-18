import { useEffect, useRef } from "react";

const R = 60;
const CIRC = 2 * Math.PI * R;
const MAX_HEIGHT = 88;
const MAX_SLOTS = 3;

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

  const pctColor =
    pct > 66 ? "text-red-500" : pct > 33 ? "text-yellow-500" : "text-blue-600";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[148px] h-[148px]">
        <svg
          width="148"
          height="148"
          viewBox="0 0 148 148"
          className="-rotate-90"
          aria-label={`Occupancy: ${pct}%`}
          role="img"
        >
          {/* track */}
          <circle
            cx="74"
            cy="74"
            r={R}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          {/* occupied arc */}
          <circle
            ref={occRef}
            cx="74"
            cy="74"
            r={R}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`0 ${CIRC}`}
            strokeDashoffset="0"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
          {/* vacant arc */}
          <circle
            ref={vacRef}
            cx="74"
            cy="74"
            r={R}
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`0 ${CIRC}`}
            strokeDashoffset="0"
            style={{
              transition:
                "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>

        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${pctColor}`}>{pct}%</span>
          <span className="text-xs text-slate-400">occupied</span>
        </div>
      </div>

      {/* legend */}
      <div className="flex gap-5 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
          Occupied <strong className="text-blue-700 ml-1">{occupied}</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
          Vacant <strong className="text-green-600 ml-1">{vacant}</strong>
        </div>
      </div>
    </div>
  );
}

export function HistoryBarChart({ history }) {
  if (!history.length) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-slate-400">
        collecting data…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-flex-end gap-1 h-[88px] overflow-x-auto pb-1">
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
              key={i}
              className="flex flex-col items-center gap-0.5 shrink-0"
              title={`${point.time} · occ:${point.occupied} vac:${point.vacant}`}
            >
              <div className="flex items-end gap-0.5 h-[88px]">
                <div
                  className="w-2.5 rounded-t bg-blue-600 transition-all duration-500"
                  style={{ height: occH, opacity: isLatest ? 1 : 0.45 }}
                />
                <div
                  className="w-2.5 rounded-t bg-green-500 transition-all duration-500"
                  style={{ height: vacH, opacity: isLatest ? 1 : 0.45 }}
                />
              </div>
              {isLatest && (
                <span className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">
                  {point.time}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-blue-600 shrink-0" />
          Occupied
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-green-500 shrink-0" />
          Vacant
        </div>
      </div>
    </div>
  );
}
