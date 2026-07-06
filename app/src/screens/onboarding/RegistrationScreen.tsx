import React, { useState } from "react";
import { View } from "react-native";
import RegistrationStep1 from "./RegistrationStep1";
import RegistrationStep2 from "./RegistrationStep2";
import RegistrationStep3 from "./RegistrationStep3";
import { LocationData } from "../../services/psgcService";

interface RegistrationScreenProps {
  onComplete: () => void;
}

export default function RegistrationScreen({ onComplete }: RegistrationScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState<LocationData>({
    region: null,
    province: null,
    cityMunicipality: null,
    barangay: null,
  });
  const [idPhotoBase64, setIdPhotoBase64] = useState<string | null>(null);

  const handleStep1Complete = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
    setCurrentStep(2);
  };

  const handleStep2Complete = (photoBase64: string) => {
    setIdPhotoBase64(photoBase64);
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleStep3Complete = () => {
    onComplete();
  };

  return (
    <View style={{ flex: 1 }}>
      {currentStep === 1 && (
        <RegistrationStep1 onNext={handleStep1Complete} initialLocation={location} />
      )}
      {currentStep === 2 && (
        <RegistrationStep2
          onNext={handleStep2Complete}
          onBack={handleStep2Back}
          location={location}
        />
      )}
      {currentStep === 3 && idPhotoBase64 && (
        <RegistrationStep3
          onComplete={handleStep3Complete}
          onBack={handleStep3Back}
          location={location}
          idPhotoBase64={idPhotoBase64}
        />
      )}
    </View>
  );
}
