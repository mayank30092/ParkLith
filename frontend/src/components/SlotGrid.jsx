import SlotCard from "./SlotCard";

function SlotGrid({ slots }) {
  return (
    <div className="w-full flex justify-center">
      <div className="dashboard-card w-full max-w-5xl">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title flex items-center gap-2">
            🅿️ Parking Layout
          </h2>

          <span className="text-sm text-gray-500">{slots.length} slots</span>
        </div>

        {/* Slots */}

        {slots.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No parking slots available
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {slots.map((slot) => (
              <div
                key={slot.slotId}
                className="transition-transform duration-200 hover:scale-105"
              >
                <SlotCard id={slot.slotId} status={slot.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotGrid;
