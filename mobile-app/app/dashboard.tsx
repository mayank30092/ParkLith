import {
  ScrollView,
  View,
  Text,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useEffect, useMemo, memo } from "react";
import * as Haptics from "expo-haptics";
import { useParking } from "../src/context/ParkingContext";
import { useTheme } from "../src/context/ThemeContext";
import DashboardCard from "../src/components/DashboardCard";
import ErrorState from "../src/components/ErrorState";
import EmptyState from "../src/components/EmptyState";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const MAX_HISTORY = 7;

// Memoized chart so it never re-renders unless data/theme changes
const OccupancyChart = memo(
  ({
    history,
    colors,
    isDark,
  }: {
    history: { label: string; occupied: number }[];
    colors: any;
    isDark: boolean;
  }) => {
    const chartConfig = useMemo(
      () => ({
        backgroundGradientFrom: isDark ? "#1e293b" : "#fff",
        backgroundGradientTo: isDark ? "#0f172a" : "#f0f7ff",
        decimalPlaces: 0,
        color: (opacity = 1) =>
          `rgba(${isDark ? "59,158,255" : "10,102,194"},${opacity})`,
        labelColor: () => colors.muted,
        propsForDots: { r: "5", strokeWidth: "2", stroke: colors.accent },
        propsForLabels: { fontSize: 9 },
      }),
      [isDark, colors.muted, colors.accent],
    );

    const chartData = useMemo(
      () => ({
        labels: history.map((h) => h.label),
        datasets: [{ data: history.map((h) => h.occupied) }],
      }),
      [history],
    );

    if (history.length < 2) {
      return (
        <EmptyState
          icon="📡"
          title="Collecting live data"
          subtitle={
            "Chart appears after occupancy changes.\nRefreshing every 5 seconds."
          }
        />
      );
    }

    return (
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        yAxisSuffix=""
        fromZero
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 12 }}
      />
    );
  },
);

export default function Dashboard() {
  const { slots, loading, fetchStatus, lastUpdated, error, fetchSlots } =
    useParking();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<{ label: string; occupied: number }[]>(
    [],
  );

  // Memoize derived values — no recalculation unless slots change
  const { total, occupied, available, percentage } = useMemo(() => {
    const total = slots.length;
    const occupied = slots.filter((s) => s.status === "occupied").length;
    return {
      total,
      occupied,
      available: total - occupied,
      percentage: total === 0 ? 0 : Math.round((occupied / total) * 100),
    };
  }, [slots]);

  const s = useMemo(() => styles(colors), [colors]);

  useEffect(() => {
    if (total === 0) return;
    const label = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].occupied === occupied)
        return prev;
      return [...prev, { label, occupied }].slice(-MAX_HISTORY);
    });
  }, [occupied, total]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchSlots();
    setRefreshing(false);
  }, [fetchSlots]);

  if (fetchStatus === "error" && slots.length === 0) {
    return (
      <View style={s.container}>
        <ErrorState message={error ?? undefined} onRetry={fetchSlots} />
      </View>
    );
  }

  if (loading && slots.length === 0) {
    return (
      <View style={[s.container, s.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={s.loadingText}>Connecting to server...</Text>
        <Text style={s.loadingSubtext}>May take up to 30s on free tier</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Status bar */}
      <View style={s.statusBar}>
        {fetchStatus === "loading" && !refreshing && (
          <ActivityIndicator
            size="small"
            color={colors.accent}
            style={s.statusSpinner}
          />
        )}
        <Text style={fetchStatus === "error" ? s.statusError : s.statusOk}>
          {fetchStatus === "error"
            ? "⚠️ Connection error"
            : `● Live · Updated ${lastUpdated}`}
        </Text>
      </View>

      {/* KPI Cards */}
      <View style={s.cardRow}>
        <DashboardCard
          title="Total Slots"
          value={total}
          color="#3b82f6"
          icon="🅿️"
        />
        <DashboardCard
          title="Occupied"
          value={occupied}
          color="#ef4444"
          icon="🚗"
        />
        <DashboardCard
          title="Available"
          value={available}
          color="#22c55e"
          icon="✅"
        />
        <DashboardCard
          title="Occupancy"
          value={`${percentage}%`}
          color="#f59e0b"
          icon="📊"
        />
      </View>

      {/* Chart */}
      <Text style={s.sectionTitle}>Live Occupancy Trend</Text>
      <View style={s.chartWrapper}>
        <OccupancyChart history={history} colors={colors} isDark={isDark} />
      </View>
    </ScrollView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    centered: { alignItems: "center", justifyContent: "center" },
    statusBar: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    statusSpinner: { marginRight: 6 },
    statusOk: { fontSize: 12, color: "#22c55e", fontWeight: "600" },
    statusError: { fontSize: 12, color: "#ef4444", fontWeight: "600" },
    loadingText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginTop: 16,
    },
    loadingSubtext: { fontSize: 13, color: colors.muted, marginTop: 6 },
    cardRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    chartWrapper: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 10,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 16,
      minHeight: 180,
      justifyContent: "center",
    },
  });
