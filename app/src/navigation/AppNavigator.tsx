import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { type NativeStackScreenProps } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import RegistrationScreen from "../screens/onboarding/RegistrationScreen";
import MainTabNavigator from "./MainTabNavigator";
import CaptureScreen from "../screens/CaptureScreen";
import ReviewScreen from "../screens/ReviewScreen";
import StatusScreen from "../screens/StatusScreen";
import { VerificationProvider } from "../context/VerificationContext";

export type RootStackParamList = {
  Welcome: undefined;
  Registration: undefined;
  Capture: undefined;
  Review: { imageBase64: string };
  Status: { requestId: string };
  MainTabs: undefined;
  VideoCall: { userId: string };
};

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, "Welcome">;
type RegistrationScreenProps = NativeStackScreenProps<RootStackParamList, "Registration">;
type CaptureScreenProps = NativeStackScreenProps<RootStackParamList, "Capture">;
type ReviewScreenProps = NativeStackScreenProps<RootStackParamList, "Review">;
type StatusScreenProps = NativeStackScreenProps<RootStackParamList, "Status">;
type MainTabsProps = NativeStackScreenProps<RootStackParamList, "MainTabs">;

const Stack = createNativeStackNavigator<RootStackParamList>();

function WelcomeScreenWrapper({ navigation }: WelcomeScreenProps) {
  return (
    <WelcomeScreen
      onGetStarted={() => navigation.navigate("Registration")}
      onSkip={() => navigation.replace("MainTabs")}
    />
  );
}

function RegistrationScreenWrapper({ navigation }: RegistrationScreenProps) {
  return (
    <RegistrationScreen
      onComplete={() => navigation.replace("MainTabs")}
    />
  );
}

function CaptureScreenWrapper({ navigation }: CaptureScreenProps) {
  return (
    <CaptureScreen
      onCapture={(base64) => navigation.navigate("Review", { imageBase64: base64 })}
    />
  );
}

function ReviewScreenWrapper({ route, navigation }: ReviewScreenProps) {
  const { imageBase64 } = route.params;

  return (
    <ReviewScreen
      imageBase64={imageBase64}
      onSubmitSuccess={(requestId) => navigation.navigate("Status", { requestId })}
      onRetake={() => navigation.goBack()}
    />
  );
}

function StatusScreenWrapper({ route, navigation }: StatusScreenProps) {
  const { requestId } = route.params;

  return (
    <StatusScreen
      requestId={requestId}
      onDone={() => navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      })}
    />
  );
}

function MainTabsWrapper({ navigation }: MainTabsProps) {
  return (
    <MainTabNavigator
      onCompleteRegistration={() => navigation.navigate("Registration")}
    />
  );
}

export default function AppNavigator() {
  return (
    <VerificationProvider>
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreenWrapper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreenWrapper}
          options={{
            title: "Registration",
            headerBackAccessibilityLabel: "Go back to welcome",
          }}
        />
        <Stack.Screen
          name="Capture"
          component={CaptureScreenWrapper}
          options={{
            title: "Capture ID",
            headerShown: false, // Full-screen camera experience
          }}
        />
        <Stack.Screen
          name="Review"
          component={ReviewScreenWrapper}
          options={{
            title: "Review Details",
            headerBackAccessibilityLabel: "Go back to capture",
          }}
        />
        <Stack.Screen
          name="Status"
          component={StatusScreenWrapper}
          options={{
            title: "Request Status",
            headerBackButtonDisplayMode: "minimal",
            gestureEnabled: false, // Prevent going back from status
          }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabsWrapper}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </VerificationProvider>
  );
}
