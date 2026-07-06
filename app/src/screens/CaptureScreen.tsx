import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CaptureScreenProps {
  onCapture: (base64: string) => void;
}

export default function CaptureScreen({ onCapture }: CaptureScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.5,
    });

    if (photo?.base64) {
      setCapturedImage(photo.base64);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionText}>Camera permission is required to capture your ID.</Text>
          <Text style={styles.permissionSubtext}>
            We need access to your camera to take a photo of your ID card. Your photos are processed securely and never shared.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          accessibilityLabel="Grant camera permission"
          accessibilityRole="button"
          accessibilityHint="Allow the app to access your camera to take ID photos"
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
          style={styles.preview}
          resizeMode="contain"
        />
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRetake}
            accessibilityLabel="Retake photo"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleUsePhoto}
            accessibilityLabel="Use this photo"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
      >
        {/* Top instruction bar */}
        <View style={styles.instructionBar}>
          <Text style={styles.instructionText}>
            Position your ID within the frame
          </Text>
        </View>

        {/* ID Card frame guide overlay */}
        <View style={styles.overlay}>
          <View style={styles.idFrame}>
            <Text style={styles.frameText}>Align your ID here</Text>
            <Text style={styles.frameSubtext}>
              Make sure all text is clearly visible
            </Text>
          </View>
        </View>

        {/* Bottom capture button */}
        <View style={styles.captureBar}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            accessibilityLabel="Capture ID photo"
            accessibilityRole="button"
            accessibilityHint="Take a photo of your ID card"
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <Text style={styles.captureHint}>
            Tap the button to take a photo
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  permissionText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  permissionSubtext: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  permissionButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  actionBar: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 32,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  instructionBar: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  instructionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  idFrame: {
    width: "80%",
    height: "45%",
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  frameText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  frameSubtext: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
  },
  captureBar: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureHint: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
});
