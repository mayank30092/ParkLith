import SlotCard from "./SlotCard";

function SlotGrid({ slots }) {
  if (!slots?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
        <span className="text-3xl">🅿</span>
        <p className="text-sm">Awaiting sensor data…</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
