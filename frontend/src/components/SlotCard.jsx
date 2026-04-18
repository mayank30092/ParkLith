function SlotCard({ id, status, updatedAt }) {
  const isOccupied = status === "occupied";

  const timeAgo = updatedAt
    ? (() => {
        const parsed = Date.parse(updatedAt);
        if (isNaN(parsed)) return null;
        const diff = Math.floor((Date.now() - parsed) / 1000);
        if (diff < 0) return null;
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        const d = Math.floor(diff / 86400);
        return d < 365 ? `${d}d ago` : `${Math.floor(d / 365)}y ago`;
      })()
    : null;

  const titleText = isOccupied
    ? `Occupied — Slot ${id}`
    : `Available — Slot ${id}`;
  const titleId = `slot-${id}-title`;

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${
        isOccupied ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
      }`}
      role="group"
      aria-label={titleText}
    >
      {/* Top row: ID + ping */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
          S-{String(id).padStart(2, "0")}
        </span>
        <div className="relative flex items-center justify-center w-4 h-4">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${
              isOccupied ? "bg-blue-400" : "bg-green-400"
            }`}
          />
          <span
            className={`relative inline-flex w-2 h-2 rounded-full ${
              isOccupied ? "bg-blue-600" : "bg-green-500"
            }`}
          />
        </div>
      </div>

      {/* Visual area */}
      <div className="flex items-center justify-center relative h-14">
        {isOccupied ? (
          <svg
            viewBox="0 0 64 32"
            width="78"
            height="39"
            fill="none"
            role="img"
            aria-labelledby={titleId}
            className="text-blue-600"
          >
            <title id={titleId}>{titleText}</title>
            <rect
              x="8"
              y="14"
              width="48"
              height="14"
              rx="4"
              fill="currentColor"
              opacity="0.92"
            />
            <rect
              x="16"
              y="7"
              width="28"
              height="12"
              rx="3"
              fill="currentColor"
              opacity="0.62"
            />
            <circle
              cx="16"
              cy="28"
              r="4.5"
              fill="#0f172a"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <circle
              cx="48"
              cy="28"
              r="4.5"
              fill="#0f172a"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <circle cx="16" cy="28" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="48" cy="28" r="1.5" fill="currentColor" opacity="0.4" />
            <rect
              x="18"
              y="9"
              width="10"
              height="7"
              rx="1.5"
              fill="rgba(255,255,255,.25)"
            />
            <rect
              x="32"
              y="9"
              width="10"
              height="7"
              rx="1.5"
              fill="rgba(255,255,255,.25)"
            />
            <rect
              x="5"
              y="18"
              width="5"
              height="4"
              rx="1"
              fill="#fbbf24"
              opacity="0.9"
            />
            <rect
              x="54"
              y="18"
              width="5"
              height="4"
              rx="1"
              fill="#ff2d55"
              opacity="0.8"
            />
          </svg>
        ) : (
          <div className="w-full border-t-2 border-dashed border-slate-300 mx-4" />
        )}
        <div
          className={`absolute right-2 bottom-0 text-xl font-black opacity-10 select-none ${
            isOccupied ? "text-blue-700" : "text-slate-400"
          }`}
        >
          P
        </div>
      </div>

      {/* Badge + timestamp */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOccupied
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isOccupied ? "Occupied" : "Vacant"}
        </span>
        {timeAgo && <span className="text-xs text-slate-400">{timeAgo}</span>}
      </div>
    </div>
  );
}

export default SlotCard;
