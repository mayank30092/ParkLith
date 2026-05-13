import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const getSlots = async () => (await API.get("/slots")).data;

export const updateSlot = async (
  slotId: number,
  status: "occupied" | "available",
) => (await API.post("/update-slot", { slotId, status })).data;

export const checkServerHealth = async () => (await API.get("/health")).data;
