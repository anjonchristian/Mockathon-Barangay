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
        <Text style={styles.permissionText}>Camera permission is required to capture your ID.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          accessibilityLabel="Grant camera permission"
          accessibilityRole="button"
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
        {/* ID Card frame guide overlay */}
        <View style={styles.overlay}>
          <View style={styles.idFrame}>
            <Text style={styles.frameText}>Align your ID here</Text>
          </View>
        </View>

        {/* Bottom capture button */}
        <View style={styles.captureBar}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            accessibilityLabel="Capture ID photo"
            accessibilityRole="button"
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
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
  permissionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  idFrame: {
    width: "80%",
    height: "45%",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  frameText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  captureBar: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
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
