import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ParkingProvider } from "../src/context/ParkingContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, focused }: { name: IoniconsName; focused: boolean }) {
  const { colors } = useTheme();
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IoniconsName)}
      size={24}
      color={focused ? colors.accent : colors.muted}
    />
  );
}

function ThemedTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          tabBarStyle: {
            backgroundColor: colors.tabBg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 6,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="speedometer" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="slots"
          options={{
            title: "Live Slots",
            tabBarLabel: "Slots",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="car" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reports",
            tabBarLabel: "Reports",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="bar-chart" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarLabel: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="settings" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ParkingProvider>
          <ThemedTabs />
        </ParkingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
