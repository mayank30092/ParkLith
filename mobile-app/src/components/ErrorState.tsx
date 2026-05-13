import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  const { colors } = useTheme();
  const s = styles(colors);
  return (
    <View style={s.container}>
      <View style={s.iconBox}>
        <Text style={s.icon}>⚠️</Text>
      </View>
      <Text style={s.title}>Something went wrong</Text>
      <Text style={s.subtitle}>
        {message ??
          "Unable to reach the server.\nCheck your connection and try again."}
      </Text>
      {onRetry && (
        <TouchableOpacity style={s.button} onPress={onRetry}>
          <Text style={s.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
      <Text style={s.hint}>
        Server may be waking up — this can take 30s on free tier.
      </Text>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingTop: 60,
    },
    iconBox: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: "#fef2f2",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    icon: { fontSize: 36 },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    button: {
      backgroundColor: "#ef4444",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 28,
      marginBottom: 16,
    },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    hint: { fontSize: 12, color: colors.muted, textAlign: "center" },
  });
