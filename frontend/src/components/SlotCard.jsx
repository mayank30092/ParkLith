function SlotCard({ id, status }) {
  const isOccupied = status === "occupied";

  return (
    <div
      className={`relative w-32 h-40 border-4 rounded-xl flex flex-col items-center justify-between p-3 text-white font-bold shadow-xl transition duration-300 hover:scale-105
      ${
        isOccupied
          ? "bg-red-600 border-yellow-300 shadow-red-500/40"
          : "bg-green-600 border-white shadow-green-500/40"
      }`}
    >
      {/* Slot Label */}
      <div className="text-sm tracking-wide">SLOT {id}</div>

      {/* Parking Symbol */}
      {!isOccupied && <div className="text-3xl opacity-60">🅿️</div>}

      {/* Car Icon */}
      {isOccupied && <div className="text-5xl animate-bounce">🚗</div>}

      {/* Status */}
      <div
        className={`text-xs px-2 py-1 rounded-full ${
          isOccupied ? "bg-red-800" : "bg-green-800"
        }`}
      >
        {isOccupied ? "Occupied" : "Vacant"}
      </div>

      {/* Parking Line */}
      <div className="w-full border-t-2 border-white opacity-70"></div>

      {/* Sensor Indicator */}
      <div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
          isOccupied ? "bg-red-400" : "bg-green-400"
        } animate-pulse`}
      ></div>
    </div>
  );
}

export default SlotCard;
