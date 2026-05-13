import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { checkServerHealth } from "../services/api";
import { useTheme } from "../context/ThemeContext";

type Status = "checking" | "online" | "offline";

export default function ServerStatusCard() {
  const { colors } = useTheme();
  const [status, setStatus] = useState<Status>("checking");
  const [lastChecked, setLastChecked] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const checkHealth = async () => {
    setStatus("checking");
    const start = Date.now();
    try {
      await checkServerHealth();
      setResponseTime(Date.now() - start);
      setStatus("online");
    } catch {
      setStatus("offline");
      setResponseTime(null);
    }
    setLastChecked(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const cfg = {
    checking: { color: "#f59e0b", bg: "#fffbeb", label: "Checking..." },
    online: { color: "#22c55e", bg: "#f0fdf4", label: "Online" },
    offline: { color: "#ef4444", bg: "#fef2f2", label: "Offline" },
  };
  const { color, bg, label } = cfg[status];
  const s = styles(colors);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Backend Server</Text>
        {status === "checking" ? (
          <ActivityIndicator size="small" color="#f59e0b" />
        ) : (
          <View style={[s.pill, { backgroundColor: bg }]}>
            <View style={[s.dot, { backgroundColor: color }]} />
            <Text style={[s.pillText, { color }]}>{label}</Text>
          </View>
        )}
      </View>
      <Text style={s.url}>parklith-backend-fohb.onrender.com</Text>
      {responseTime !== null && (
        <Text style={s.meta}>Response time: {responseTime}ms</Text>
      )}
      {lastChecked !== "" && (
        <Text style={s.meta}>Last checked: {lastChecked}</Text>
      )}
      <TouchableOpacity
        style={[s.button, status === "checking" && { opacity: 0.6 }]}
        onPress={checkHealth}
        disabled={status === "checking"}
      >
        <Text style={s.buttonText}>
          {status === "checking" ? "Checking..." : "Check Again"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: { fontSize: 15, fontWeight: "700", color: colors.text },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      gap: 5,
    },
    dot: { width: 7, height: 7, borderRadius: 4 },
    pillText: { fontSize: 12, fontWeight: "700" },
    url: { fontSize: 12, color: colors.muted, marginBottom: 6 },
    meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
    button: {
      marginTop: 14,
      backgroundColor: colors.accent,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  });
