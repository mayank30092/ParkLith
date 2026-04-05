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
      console.error(error);
      setServerStatus("offline");
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter((s) => s.status === "occupied").length;
  const vacantSlots = slots.filter((s) => s.status === "vacant").length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center w-full max-w-5xl mb-10 bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <img src="./P.png" className="w-10 rounded-lg" />
          <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
            ParkLith
          </h1>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${
            serverStatus === "online"
              ? "bg-green-500/20 text-green-600 border-green-300"
              : "bg-red-500/20 text-red-600 border-red-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              serverStatus === "online" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>

          {serverStatus === "online" ? "Online" : "Offline"}
        </div>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Total Slots</p>
            <span className="text-xl">🅿️</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{totalSlots}</p>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Occupied</p>
            <span className="text-xl">🚗</span>
          </div>
          <p className="text-4xl font-bold text-red-500">{occupiedSlots}</p>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Vacant</p>
            <span className="text-xl">✅</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{vacantSlots}</p>
        </div>
      </div>

      {/* AVAILABILITY */}

      <div className="dashboard-card w-full max-w-5xl mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-title">Parking Availability</h3>

          <span className="text-sm text-gray-500">
            {vacantSlots} / {totalSlots} available
          </span>
        </div>

        <div className="availability-bar">
          <div
            className="availability-fill"
            style={{ width: `${(vacantSlots / totalSlots) * 100 || 0}%` }}
          ></div>
        </div>
      </div>

      {/* SYSTEM INFO */}

      <div className="dashboard-card w-full max-w-5xl mb-10">
        <h3 className="section-title mb-4">System Info</h3>

        <div className="flex justify-between mb-3 text-gray-600">
          <span>Last Update</span>
          <span className="font-medium text-gray-800">
            {lastUpdated || "--"}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Refresh Rate</span>
          <span className="font-medium text-gray-800">5 sec</span>
        </div>
      </div>

      {/* PARKING LAYOUT */}

      <div className="dashboard-card w-full max-w-5xl">
        <h2 className="section-title mb-6">Parking Layout</h2>

        <SlotGrid slots={slots} />
      </div>
    </div>
  );
}

export default Dashboard;
