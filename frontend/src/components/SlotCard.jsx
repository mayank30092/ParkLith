function SlotCard({ id, status }) {
  const isOccupied = status === "occupied";

  return (
    <div
      className={`relative w-32 h-40 rounded-xl border flex flex-col items-center justify-between p-4 shadow-md transition-all duration-200 hover:scale-105
      ${
        isOccupied ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
    >
      {/* Sensor indicator */}
      <div
        className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full animate-pulse ${
          isOccupied ? "bg-red-500" : "bg-green-500"
        }`}
      />

      {/* Slot label */}
      <div className="text-xs font-semibold tracking-wide text-gray-600">
        SLOT {id}
      </div>

      {/* Center icon */}
      <div className="text-4xl">{isOccupied ? "🚗" : "🅿️"}</div>

      {/* Status badge */}
      <div
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          isOccupied ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
        }`}
      >
        {isOccupied ? "Occupied" : "Vacant"}
      </div>

      {/* Parking line */}
      <div className="w-full border-t border-gray-300"></div>
    </div>
  );
}

export default SlotCard;
