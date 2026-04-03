import { useState, useEffect } from "react";
import SlotGrid from "../components/SlotGrid";

function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [serverStatus, setServerStatus] = useState("offline");

  const fetchSlots = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/slots`);

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setSlots(data.slice(0, 3));
      setLastUpdated(new Date().toLocaleTimeString());
      setServerStatus("online");
    } catch (error) {
      console.error("Server error:", error);
      setServerStatus("offline");
    }
  };

  useEffect(() => {
    fetchSlots();

    const interval = setInterval(fetchSlots, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalSlots = slots.length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "occupied",
  ).length;

  const vacantSlots = slots.filter((slot) => slot.status === "vacant").length;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide">
          🚗 Smart Parking Dashboard
        </h1>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">Server:</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              serverStatus === "online"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {serverStatus === "online" ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
          <p className="text-gray-300 text-sm">Last Update</p>
          <p className="text-2xl font-bold">{lastUpdated || "--"}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
          <p className="text-gray-300 text-sm">Refresh Rate</p>
          <p className="text-2xl font-bold">5 sec</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
          <p className="text-gray-300 text-sm">System</p>
          <p className="text-2xl font-bold text-blue-400">ESP32 Active</p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-xl hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Total Slots</h2>
          <p className="text-4xl font-bold mt-2">{totalSlots}</p>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-8 rounded-2xl shadow-xl hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Occupied</h2>
          <p className="text-4xl font-bold mt-2">{occupiedSlots}</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl shadow-xl hover:scale-105 transition">
          <h2 className="text-lg font-semibold">Vacant</h2>
          <p className="text-4xl font-bold mt-2">{vacantSlots}</p>
        </div>
      </div>

      {/* Parking Slots */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Parking Slots</h2>

        <SlotGrid slots={slots} />
      </div>
    </div>
  );
}

export default Dashboard;
