import SlotCard from "./SlotCard";

function SlotGrid({ slots }) {
  if (!slots?.length) {
    return (
      <div className="pk-slot-empty">
        <div className="icon">🅿</div>
        <p className="msg">Awaiting sensor data…</p>
      </div>
    );
  }

  return (
    <div className="pk-slot-grid">
      {slots.map((slot) => (
        <SlotCard
          key={slot.slotId}
          id={slot.slotId}
          status={slot.status}
          updatedAt={slot.updatedAt}
        />
      ))}
    </div>
  );
}

export default SlotGrid;
