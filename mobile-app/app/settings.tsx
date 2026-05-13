import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../src/context/ThemeContext";
import ServerStatusCard from "../src/components/ServerStatusCard";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { colors, isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  const s = styles(colors);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionLabel}>APPEARANCE</Text>
      <View style={s.card}>
        <View style={s.row}>
          <View style={s.rowLeft}>
            <View
              style={[
                s.iconBox,
                { backgroundColor: isDark ? "#1e3a5f" : "#eff6ff" },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={18}
                color={colors.accent}
              />
            </View>
            <View>
              <Text style={s.rowLabel}>Dark Mode</Text>
              <Text style={s.rowSub}>
                {isDark
                  ? "Dark theme active · Saved"
                  : "Light theme active · Saved"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggle}
            trackColor={{ false: "#e5e7eb", true: colors.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <Text style={s.sectionLabel}>SERVER</Text>
      <ServerStatusCard />

      <Text style={s.sectionLabel}>ABOUT</Text>
      <View style={s.card}>
        <InfoRow label="App Name" value="Parklith" colors={colors} />
        <InfoRow label="Version" value="1.0.0" colors={colors} />
        <InfoRow label="Poll Interval" value="5 seconds" colors={colors} last />
      </View>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: any;
  last?: boolean;
}) {
  const s = styles(colors);
  return (
    <View style={[s.row, last && { borderBottomWidth: 0 }]}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.muted,
      letterSpacing: 1,
      marginBottom: 8,
      marginTop: 8,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.rowBorder,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: { fontSize: 14, color: colors.text, fontWeight: "500" },
    rowSub: { fontSize: 12, color: colors.muted, marginTop: 1 },
    rowValue: { fontSize: 14, color: colors.subtext, fontWeight: "500" },
  });
