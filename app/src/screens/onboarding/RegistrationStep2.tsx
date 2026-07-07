import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { LocationData } from "../../services/psgcService";
import { MaterialCommunityIcons, ICONS } from "../../components/Icons";

interface RegistrationStep2Props {
  onNext: (idPhotoBase64: string) => void;
  onBack: () => void;
  location: LocationData;
}

export default function RegistrationStep2({
  onNext,
  onBack,
  location,
}: RegistrationStep2Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState<"back" | "front">("back");
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const cameraRef = React.useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>
            We need camera access to capture your ID for verification.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
          accessibilityLabel="Grant camera permission"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        if (photo?.base64) {
          setCapturedImage(photo.base64);
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 2],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setCapturedImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleNext = () => {
    if (capturedImage) {
      onNext(capturedImage);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepDot}>
          <Text style={styles.stepDotText}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, styles.activeStep]}>
          <Text style={styles.stepDotText}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepDot}>
          <Text style={styles.stepDotText}>3</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          Capture a clear photo of your government-issued ID (Barangay ID, National ID, or any valid
          government ID).
        </Text>

        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Registering for:</Text>
          <Text style={styles.locationText}>
            {location.barangay?.name}, {location.cityMunicipality?.name}, {location.province?.name}
          </Text>
        </View>

        {capturedImage ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>ID Preview</Text>
            <View style={styles.imagePreview}>
              <Text style={styles.previewPlaceholder}>Image captured successfully</Text>
            </View>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            <View style={styles.cameraOverlay}>
              <View style={styles.frame} />
            </View>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
              accessibilityLabel="Switch camera"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name={ICONS.ACTION_CAMERA_FLIP} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back to location selection"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {capturedImage ? (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRetake}
              accessibilityLabel="Retake photo"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              accessibilityLabel="Continue to registration completion"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePickFromGallery}
              accessibilityLabel="Choose from gallery"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCapture}
              accessibilityLabel="Capture photo"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#000",
  },
  stepDotText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  locationInfo: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cameraContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
  },
  flipButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  previewContainer: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  imagePreview: {
    height: 300,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  previewPlaceholder: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 32,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 18,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 18,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
