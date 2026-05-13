import { useEffect, useRef, useMemo, memo, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { Slot } from "../context/ParkingContext";
import { useTheme } from "../context/ThemeContext";

type Props = { slot: Slot };

function SlotCard({ slot }: Props) {
  const { colors } = useTheme();
  const occupied = slot.status === "occupied";
  const s = useMemo(() => styles(colors), [colors]);

  // Only scale animation — useNativeDriver: true (safe, runs on native thread)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Use regular state for background flash instead of Animated interpolation
  // This avoids the mixed useNativeDriver crash
  const [flashBg, setFlashBg] = useState<string | null>(null);
  const prevStatus = useRef(slot.status);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevStatus.current === slot.status) return;
    prevStatus.current = slot.status;

    // Haptic feedback
    Haptics.notificationAsync(
      occupied
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success,
    );

    // Scale bounce — native driver only, no crash
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.06,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Background flash via setState — safe, no native driver conflict
    setFlashBg(occupied ? "#fee2e2" : "#dcfce7");
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlashBg(null), 800);
  }, [slot.status]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, []);

  const formattedTime = useMemo(() => {
    try {
      return new Date(slot.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return slot.updatedAt;
    }
  }, [slot.updatedAt]);

  const bgColor = flashBg ?? colors.card;

  return (
    <Animated.View
      style={[
        s.card,
        {
          borderLeftColor: occupied ? "#ef4444" : "#22c55e",
          transform: [{ scale: scaleAnim }],
          backgroundColor: bgColor,
        },
      ]}
    >
      <View style={s.liveRow}>
        <Text style={s.slotId}>Slot {slot.slotId}</Text>
        <View
          style={[
            s.liveDot,
            { backgroundColor: occupied ? "#ef4444" : "#22c55e" },
          ]}
        />
      </View>

      <View
        style={[s.badge, { backgroundColor: occupied ? "#fef2f2" : "#f0fdf4" }]}
      >
        <Text
          style={[s.badgeText, { color: occupied ? "#dc2626" : "#16a34a" }]}
        >
          {occupied ? "Occupied" : "Available"}
        </Text>
      </View>

      <Text style={s.time}>Updated {formattedTime}</Text>
    </Animated.View>
  );
}

export default memo(SlotCard);

const styles = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 14,
      padding: 16,
      width: "47%",
      borderLeftWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    liveRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    slotId: { fontSize: 16, fontWeight: "700", color: colors.text },
    liveDot: { width: 8, height: 8, borderRadius: 4 },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    badgeText: { fontSize: 12, fontWeight: "700" },
    time: { fontSize: 11, color: colors.muted },
  });
