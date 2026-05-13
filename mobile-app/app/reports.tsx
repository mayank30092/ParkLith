import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  InteractionManager,
} from "react-native";
import { useParking } from "../src/context/ParkingContext";
import { useTheme } from "../src/context/ThemeContext";
import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const MAX_HISTORY = 10;

type HistoryPoint = {
  label: string;
  occupied: number;
  available: number;
  time: number;
};

// Memoized heavy chart components — only re-render when data changes
const MemoBarChart = memo(
  ({
    history,
    chartBg,
    chartColor,
    colors,
  }: {
    history: HistoryPoint[];
    chartBg: string;
    chartColor: string;
    colors: any;
  }) => {
    const data = useMemo(
      () => ({
        labels: history.slice(-6).map((h) => h.label),
        datasets: [{ data: history.slice(-6).map((h) => h.occupied) }],
      }),
      [history],
    );

    const config = useMemo(
      () => ({
        backgroundGradientFrom: chartBg,
        backgroundGradientTo: chartBg,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(${chartColor},${opacity})`,
        labelColor: () => colors.muted,
        barPercentage: 0.6,
        propsForLabels: { fontSize: 9 },
      }),
      [chartBg, chartColor, colors.muted],
    );

    return (
      <BarChart
        data={data}
        width={screenWidth - 56}
        height={180}
        yAxisSuffix=""
        yAxisLabel=""
        chartConfig={config}
        style={{ borderRadius: 12 }}
      />
    );
  },
);

const MemoLineChart = memo(
  ({
    history,
    chartBg,
    chartColor,
    colors,
    isDark,
  }: {
    history: HistoryPoint[];
    chartBg: string;
    chartColor: string;
    colors: any;
    isDark: boolean;
  }) => {
    const data = useMemo(
      () => ({
        labels: history.map((h) => h.label),
        datasets: [
          {
            data: history.map((h) => h.occupied),
            color: (o = 1) => `rgba(239,68,68,${o})`,
            strokeWidth: 2,
          },
          {
            data: history.map((h) => h.available),
            color: (o = 1) => `rgba(34,197,94,${o})`,
            strokeWidth: 2,
          },
        ],
        legend: ["Occupied", "Available"],
      }),
      [history],
    );

    const config = useMemo(
      () => ({
        backgroundGradientFrom: chartBg,
        backgroundGradientTo: isDark ? "#0f172a" : "#f0f7ff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(${chartColor},${opacity})`,
        labelColor: () => colors.muted,
        propsForDots: { r: "4" },
        propsForLabels: { fontSize: 9 },
      }),
      [chartBg, chartColor, colors.muted, isDark],
    );

    return (
      <LineChart
        data={data}
        width={screenWidth - 56}
        height={200}
        yAxisSuffix=""
        fromZero
        chartConfig={config}
        bezier
        style={{ borderRadius: 12 }}
      />
    );
  },
);

// Memoized slot row — won't re-render unless slot changes
const SlotRow = memo(
  ({
    slot,
    isLast,
    colors,
    s,
  }: {
    slot: any;
    isLast: boolean;
    colors: any;
    s: any;
  }) => {
    const isOccupied = slot.status === "occupied";
    const time = useMemo(
      () =>
        new Date(slot.updatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      [slot.updatedAt],
    );

    return (
      <View style={[s.slotRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={s.slotLeft}>
          <View
            style={[
              s.slotDot,
              { backgroundColor: isOccupied ? "#ef4444" : "#22c55e" },
            ]}
          />
          <Text style={s.slotName}>Slot {slot.slotId}</Text>
        </View>
        <View
          style={[
            s.slotBadge,
            { backgroundColor: isOccupied ? "#fef2f2" : "#f0fdf4" },
          ]}
        >
          <Text
            style={[
              s.slotBadgeText,
              { color: isOccupied ? "#dc2626" : "#16a34a" },
            ]}
          >
            {isOccupied ? "Occupied" : "Available"}
          </Text>
        </View>
        <Text style={s.slotTime}>{time}</Text>
      </View>
    );
  },
);

// Memoized KPI card
const KPICard = memo(
  ({
    label,
    value,
    color,
    colors,
  }: {
    label: string;
    value: string;
    color: string;
    colors: any;
  }) => {
    const s = useMemo(() => kpiStyles(colors), [colors]);
    return (
      <View style={[s.card, { borderTopColor: color }]}>
        <Text style={[s.value, { color }]}>{value}</Text>
        <Text style={s.label}>{label}</Text>
      </View>
    );
  },
);

export default function Reports() {
  const { slots } = useParking();
  const { colors, isDark } = useTheme();
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [peakOccupied, setPeakOccupied] = useState(0);
  const [chartsReady, setChartsReady] = useState(false);

  // Defer heavy chart rendering until after navigation animation
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setChartsReady(true);
    });
    return () => task.cancel();
  }, []);

  const { occupied, available, total, occupancyRate } = useMemo(() => {
    const occupied = slots.filter((s) => s.status === "occupied").length;
    const available = slots.filter((s) => s.status === "available").length;
    const total = slots.length;
    return {
      occupied,
      available,
      total,
      occupancyRate: total === 0 ? 0 : Math.round((occupied / total) * 100),
    };
  }, [slots]);

  const avgOccupied = useMemo(
    () =>
      history.length === 0
        ? 0
        : Math.round(
            history.reduce((sum, h) => sum + h.occupied, 0) / history.length,
          ),
    [history],
  );

  useEffect(() => {
    if (total === 0) return;
    const label = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].occupied === occupied)
        return prev;
      return [...prev, { label, occupied, available, time: Date.now() }].slice(
        -MAX_HISTORY,
      );
    });
    setPeakOccupied((prev) => Math.max(prev, occupied));
  }, [occupied, total]);

  const s = useMemo(() => styles(colors), [colors]);
  const chartBg = isDark ? "#1e293b" : "#fff";
  const chartColor = isDark ? "59,158,255" : "10,102,194";

  const pieData = useMemo(
    () =>
      total > 0
        ? [
            {
              name: "Occupied",
              population: occupied,
              color: "#EA580C",
              legendFontColor: colors.text,
              legendFontSize: 13,
            },
            {
              name: "Available",
              population: available,
              color: "#2563EB",
              legendFontColor: colors.text,
              legendFontSize: 13,
            },
          ]
        : [],
    [occupied, available, total, colors.text],
  );

  const pieChartConfig = useMemo(
    () => ({
      color: (opacity = 1) => `rgba(${chartColor},${opacity})`,
      labelColor: () => colors.text,
    }),
    [chartColor, colors.text],
  );

  const barColor = useMemo(
    () =>
      occupancyRate > 80
        ? "#ef4444"
        : occupancyRate > 50
          ? "#f59e0b"
          : "#22c55e",
    [occupancyRate],
  );

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* KPI Row */}
      <Text style={s.sectionTitle}>Overview</Text>
      <View style={s.kpiRow}>
        <KPICard
          label="Occupancy Rate"
          value={`${occupancyRate}%`}
          color="#f59e0b"
          colors={colors}
        />
        <KPICard
          label="Peak Occupied"
          value={`${peakOccupied}`}
          color="#ef4444"
          colors={colors}
        />
        <KPICard
          label="Avg Occupied"
          value={`${avgOccupied}`}
          color="#3b82f6"
          colors={colors}
        />
        <KPICard
          label="Total Slots"
          value={`${total}`}
          color="#8b5cf6"
          colors={colors}
        />
      </View>

      {/* Utilization Bar */}
      <Text style={s.sectionTitle}>Current Utilization</Text>
      <View style={s.card}>
        <View style={s.barTrack}>
          <View
            style={[
              s.barFill,
              { width: `${occupancyRate}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <View style={s.barLabels}>
          <Text style={s.barLabel}>{occupied} occupied</Text>
          <Text style={s.barLabel}>{occupancyRate}% full</Text>
          <Text style={s.barLabel}>{available} free</Text>
        </View>
      </View>

      {/* Charts — deferred until after navigation animation */}
      {chartsReady && (
        <>
          {/* Pie Chart */}
          {total > 0 && (
            <>
              <Text style={s.sectionTitle}>Slot Distribution</Text>
              <View style={s.card}>
                <PieChart
                  data={pieData}
                  width={screenWidth - 40}
                  height={180}
                  chartConfig={pieChartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </>
          )}

          {/* Line Chart */}
          <Text style={s.sectionTitle}>Occupancy Trend</Text>
          <View style={s.card}>
            {history.length >= 2 ? (
              <MemoLineChart
                history={history}
                chartBg={chartBg}
                chartColor={chartColor}
                colors={colors}
                isDark={isDark}
              />
            ) : (
              <View style={s.emptyChart}>
                <Text style={s.emptyIcon}>📡</Text>
                <Text style={s.emptyText}>Collecting trend data...</Text>
                <Text style={s.emptySubtext}>
                  Appears after occupancy changes
                </Text>
              </View>
            )}
          </View>

          {/* Bar Chart */}
          {history.length >= 2 && (
            <>
              <Text style={s.sectionTitle}>Occupied Slots Over Time</Text>
              <View style={s.card}>
                <MemoBarChart
                  history={history}
                  chartBg={chartBg}
                  chartColor={chartColor}
                  colors={colors}
                />
              </View>
            </>
          )}
        </>
      )}

      {/* Slot breakdown */}
      <Text style={s.sectionTitle}>Slot Status Breakdown</Text>
      <View style={s.card}>
        {slots.length === 0 ? (
          <Text style={[s.emptyText, { padding: 20 }]}>No slots available</Text>
        ) : (
          slots.map((slot, i) => (
            <SlotRow
              key={slot._id}
              slot={slot}
              isLast={i === slots.length - 1}
              colors={colors}
              s={s}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const kpiStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      width: "47%",
      borderTopWidth: 3,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      alignItems: "center",
    },
    value: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
    label: {
      fontSize: 11,
      color: colors.muted,
      textAlign: "center",
      fontWeight: "600",
    },
  });

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 50 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
      marginTop: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    kpiRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
      alignItems: "center",
    },
    barTrack: {
      width: "100%",
      height: 20,
      backgroundColor: colors.border,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 8,
    },
    barFill: { height: "100%", borderRadius: 10 },
    barLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    barLabel: { fontSize: 12, color: colors.muted, fontWeight: "500" },
    emptyChart: { alignItems: "center", paddingVertical: 30, gap: 6 },
    emptyIcon: { fontSize: 28 },
    emptyText: { fontSize: 14, fontWeight: "700", color: colors.text },
    emptySubtext: { fontSize: 12, color: colors.muted },
    slotRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.rowBorder,
      width: "100%",
    },
    slotLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
    slotDot: { width: 10, height: 10, borderRadius: 5 },
    slotName: { fontSize: 14, fontWeight: "600", color: colors.text },
    slotBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      marginHorizontal: 8,
    },
    slotBadgeText: { fontSize: 12, fontWeight: "700" },
    slotTime: { fontSize: 11, color: colors.muted },
  });
