import SlotCard from "./SlotCard";

function SlotGrid({ slots }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Parking Area */}
      <div className="bg-gray-800/60 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-white/10 w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-white mb-8 text-center">
          🅿️ Parking Layout
        </h2>

        {/* Parking Slots */}
        <div className="flex justify-center gap-8 flex-wrap mb-10">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className="flex flex-col items-center hover:scale-105 transition duration-300"
            >
              <span className="text-gray-300 mb-2 text-sm font-semibold">
                Slot {slot.id}
              </span>

              <SlotCard
                key={slot.slotId}
                id={slot.slotId}
                status={slot.status}
              />
            </div>
          ))}
        </div>

        {/* Road */}
        <div className="relative w-full h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold tracking-widest">
          {/* Road Label */}
          ROAD
          {/* Road Lines */}
          <div className="absolute flex gap-6">
            <div className="w-10 h-1 bg-white"></div>
            <div className="w-10 h-1 bg-white"></div>
            <div className="w-10 h-1 bg-white"></div>
            <div className="w-10 h-1 bg-white"></div>
            <div className="w-10 h-1 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlotGrid;
