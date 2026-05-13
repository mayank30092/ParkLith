import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { getSlots } from "../services/api";

export type RawSlot = {
  _id: string;
  slotId: number;
  status: string;
  updatedAt: string;
};

export type Slot = {
  _id: string;
  slotId: number;
  status: "occupied" | "available";
  updatedAt: string;
};

export const normalizeStatus = (raw: string): "occupied" | "available" => {
  const s = raw?.toLowerCase().trim();
  if (s === "occupied") return "occupied";
  return "available";
};

type FetchStatus = "idle" | "loading" | "success" | "error";

type ParkingContextType = {
  slots: Slot[];
  loading: boolean;
  fetchStatus: FetchStatus;
  lastUpdated: string | null;
  error: string | null;
  fetchSlots: () => Promise<void>;
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // useCallback so fetchSlots reference is stable — polling interval won't restart
  const fetchSlots = useCallback(async () => {
    if (!isMounted.current) return;
    setFetchStatus("loading");
    setError(null);
    try {
      const data = await getSlots();
      if (!isMounted.current) return;

      let raw: RawSlot[] = [];
      if (Array.isArray(data)) raw = data;
      else if (data?.slots) raw = data.slots;
      else if (data?.data) raw = data.data;

      const normalized: Slot[] = raw.map((s) => ({
        _id: s._id,
        slotId: s.slotId,
        status: normalizeStatus(s.status),
        updatedAt: s.updatedAt,
      }));

      setSlots(normalized);
      setFetchStatus("success");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      if (!isMounted.current) return;
      console.error("[ParkingContext] error:", err?.message);
      setFetchStatus("error");
      setError(err?.message || "Failed to fetch slots");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []); // empty deps — stable reference forever

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Polling every 5s instead of 3s — reduces lag noticeably on Expo Go
  useEffect(() => {
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, [fetchSlots]); // safe now because fetchSlots is stable

  return (
    <ParkingContext.Provider
      value={{ slots, loading, fetchStatus, lastUpdated, error, fetchSlots }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used within ParkingProvider");
  return ctx;
};
