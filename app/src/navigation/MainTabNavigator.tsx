import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, ICONS } from "../components/Icons";
import DocumentsScreen from "../screens/tabs/DocumentsScreen";
import EBlotterScreen from "../screens/tabs/EBlotterScreen";
import AIAssistantScreen from "../screens/tabs/AIAssistantScreen";
import ProfileScreen from "../screens/tabs/ProfileScreen";

const Tab = createBottomTabNavigator();

interface MainTabNavigatorProps {
  /** Called when a guest user wants to start registration from the Profile tab. */
  onCompleteRegistration: () => void;
}

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: { [key: string]: string } = {
    Documents: ICONS.TAB_DOCUMENTS,
    "e-Blotter": ICONS.TAB_EBLOTTER,
    "AI Assistant": ICONS.TAB_AI_ASSISTANT,
    Profile: ICONS.TAB_PROFILE,
  };

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <MaterialCommunityIcons
        name={icons[name] || ICONS.TAB_PROFILE}
        size={24}
        color={focused ? "#000" : "#666"}
      />
    </View>
  );
}

export default function MainTabNavigator({
  onCompleteRegistration,
}: MainTabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabBarIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="e-Blotter" component={EBlotterScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen onCompleteRegistration={onCompleteRegistration} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  iconContainerFocused: {
    backgroundColor: "#E6F4FE",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  tabBarLabelFocused: {
    fontWeight: "600",
  },
});
