import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  title: string;
  value: string | number;
  color?: string;
  icon?: string;
};

export default function DashboardCard({
  title,
  value,
  color = "#0A66C2",
  icon,
}: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => styles(colors), [colors]);

  return (
    <View style={[s.card, { borderTopColor: color }]}>
      <View style={s.header}>
        {icon && <Text style={s.icon}>{icon}</Text>}
        <Text style={s.title}>{title}</Text>
      </View>
      <Text style={[s.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      width: "47%",
      borderTopWidth: 3,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 6,
    },
    icon: { fontSize: 16 },
    title: {
      fontSize: 11,
      color: colors.muted,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      flexShrink: 1,
    },
    value: { fontSize: 28, fontWeight: "800" },
  });
