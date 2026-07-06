import { useState } from "react";
import CaptureScreen from "../screens/CaptureScreen";
import ReviewScreen from "../screens/ReviewScreen";
import StatusScreen from "../screens/StatusScreen";

type Screen = "capture" | "review" | "status";

export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("capture");
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");

  const handleCapture = (base64: string) => {
    setCapturedImage(base64);
    setCurrentScreen("review");
  };

  const handleRetake = () => {
    setCurrentScreen("capture");
  };

  const handleSubmitSuccess = (id: string) => {
    setRequestId(id);
    setCurrentScreen("status");
  };

  const handleDone = () => {
    setCapturedImage("");
    setRequestId("");
    setCurrentScreen("capture");
  };

  switch (currentScreen) {
    case "capture":
      return <CaptureScreen onCapture={handleCapture} />;
    case "review":
      return (
        <ReviewScreen
          imageBase64={capturedImage}
          onSubmitSuccess={handleSubmitSuccess}
          onRetake={handleRetake}
        />
      );
    case "status":
      return (
        <StatusScreen requestId={requestId} onDone={handleDone} />
      );
    default:
      return <CaptureScreen onCapture={handleCapture} />;
  }
}
