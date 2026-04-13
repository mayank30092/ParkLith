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
    <div className="pk-slot-wrap">
      <div
        className={`pk-slot-card ${isOccupied ? "occupied" : "vacant"}`}
        role="group"
        aria-label={titleText}
        data-state={isOccupied ? "occupied" : "vacant"}
      >
        {/* Top: slot ID + sensor ping */}
        <div className="pk-slot-top">
          <span className="pk-slot-id">S-{String(id).padStart(2, "0")}</span>
          <div className="pk-ping">
            <span className="pk-ping-ring" />
            <span className="pk-ping-dot" />
          </div>
        </div>

        {/* Visual */}
        <div className="pk-slot-visual">
          {isOccupied ? (
            <svg
              className="pk-slot-car"
              viewBox="0 0 64 32"
              width="78"
              height="39"
              fill="none"
              role="img"
              aria-labelledby={titleId}
            >
              <title id={titleId}>{titleText}</title>
              {/* body */}
              <rect
                x="8"
                y="14"
                width="48"
                height="14"
                rx="4"
                fill="currentColor"
                opacity="0.92"
              />
              {/* cabin */}
              <rect
                x="16"
                y="7"
                width="28"
                height="12"
                rx="3"
                fill="currentColor"
                opacity="0.62"
              />
              {/* wheels */}
              <circle
                cx="16"
                cy="28"
                r="4.5"
                fill="#050d1a"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              <circle
                cx="48"
                cy="28"
                r="4.5"
                fill="#050d1a"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              {/* wheel centres */}
              <circle
                cx="16"
                cy="28"
                r="1.5"
                fill="currentColor"
                opacity="0.4"
              />
              <circle
                cx="48"
                cy="28"
                r="1.5"
                fill="currentColor"
                opacity="0.4"
              />
              {/* windows */}
              <rect
                x="18"
                y="9"
                width="10"
                height="7"
                rx="1.5"
                fill="rgba(255,255,255,.18)"
              />
              <rect
                x="32"
                y="9"
                width="10"
                height="7"
                rx="1.5"
                fill="rgba(255,255,255,.18)"
              />
              {/* headlights */}
              <rect
                x="5"
                y="18"
                width="5"
                height="4"
                rx="1"
                fill="#fbbf24"
                opacity="0.9"
              />
              {/* tail lights */}
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
            <div className="pk-slot-divider" />
          )}
          <div className="pk-slot-p">P</div>
        </div>

        {/* Badge + timestamp */}
        <div className="pk-slot-bottom">
          <div className="pk-slot-badge">
            {isOccupied ? "Occupied" : "Vacant"}
          </div>
          {timeAgo && <span className="pk-slot-time">{timeAgo}</span>}
        </div>
      </div>
    </div>
  );
}

export default SlotCard;
