import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { useParking } from "../src/context/ParkingContext";
import { useTheme } from "../src/context/ThemeContext";
import SlotCard from "../src/components/SlotCard";
import ErrorState from "../src/components/ErrorState";
import EmptyState from "../src/components/EmptyState";

type Filter = "all" | "occupied" | "available";

export default function Slots() {
  const { slots, loading, fetchStatus, lastUpdated, error, fetchSlots } =
    useParking();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  // Memoize styles so they don't recreate on every render
  const s = useMemo(() => styles(colors), [colors]);

  // Memoize counts so they don't recalculate every render
  const counts = useMemo(
    () => ({
      all: slots.length,
      occupied: slots.filter((s) => s.status === "occupied").length,
      available: slots.filter((s) => s.status === "available").length,
    }),
    [slots],
  );

  // Memoize filtered list
  const filtered = useMemo(
    () => slots.filter((s) => filter === "all" || s.status === filter),
    [slots, filter],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchSlots();
    setRefreshing(false);
  }, [fetchSlots]);

  const onFilterChange = useCallback((f: Filter) => {
    Haptics.selectionAsync();
    setFilter(f);
  }, []);

  if (fetchStatus === "error" && slots.length === 0) {
    return (
      <View style={s.container}>
        <ErrorState message={error ?? undefined} onRetry={fetchSlots} />
      </View>
    );
  }

  if (loading && slots.length === 0) {
    return (
      <View
        style={[
          s.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.muted, marginTop: 12, fontSize: 14 }}>
          Loading slots...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={s.subtitle}>
        Auto-refreshes every 5s{lastUpdated ? ` · Last: ${lastUpdated}` : ""}
      </Text>

      <View style={s.filterRow}>
        {(["all", "available", "occupied"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[s.filterBtn, filter === f && s.filterBtnActive]}
            onPress={() => onFilterChange(f)}
          >
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
            <View style={[s.countBadge, filter === f && s.countBadgeActive]}>
              <Text style={[s.countText, filter === f && s.countTextActive]}>
                {counts[f]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={filter === "occupied" ? "🚗" : "✅"}
          title={`No ${filter === "all" ? "" : filter} slots`}
          subtitle={
            filter === "all"
              ? "No slots found. Check server connection."
              : `All slots are currently ${filter === "occupied" ? "available" : "occupied"}.`
          }
        />
      ) : (
        <View style={s.grid}>
          {filtered.map((slot) => (
            <SlotCard key={slot._id} slot={slot} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    subtitle: { fontSize: 12, color: colors.muted, marginBottom: 16 },
    filterRow: {
      flexDirection: "row",
      marginBottom: 20,
      backgroundColor: colors.border,
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    filterBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 9,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    filterBtnActive: {
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      elevation: 2,
    },
    filterText: { fontSize: 12, fontWeight: "600", color: colors.muted },
    filterTextActive: { color: colors.accent },
    countBadge: {
      backgroundColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    countBadgeActive: { backgroundColor: colors.accent + "22" },
    countText: { fontSize: 11, fontWeight: "700", color: colors.muted },
    countTextActive: { color: colors.accent },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
  });
