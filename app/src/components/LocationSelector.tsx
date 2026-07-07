import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Region,
  Province,
  City,
  Municipality,
  Barangay,
  LocationData,
  fetchRegions,
  fetchProvinces,
  fetchCitiesMunicipalities,
  fetchBarangays,
} from "../services/psgcService";
import { MaterialCommunityIcons, ICONS } from "./Icons";

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData;
  disabled?: boolean;
}

export default function LocationSelector({
  onLocationChange,
  initialLocation,
  disabled = false,
}: LocationSelectorProps) {
  const [location, setLocation] = useState<LocationData>(
    initialLocation || { region: null, province: null, cityMunicipality: null, barangay: null }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showBarangayModal, setShowBarangayModal] = useState(false);

  // Data states
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [citiesMunicipalities, setCitiesMunicipalities] = useState<(City | Municipality)[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  // Search states
  const [regionSearch, setRegionSearch] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [barangaySearch, setBarangaySearch] = useState("");

  // Load regions on mount
  useEffect(() => {
    loadRegions();
  }, []);

  // Notify parent of location changes
  useEffect(() => {
    onLocationChange(location);
  }, [location]);

  const loadRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRegions();
      setRegions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load regions");
    } finally {
      setLoading(false);
    }
  };

  const loadProvinces = async (regionCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProvinces(regionCode);
      setProvinces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load provinces");
    } finally {
      setLoading(false);
    }
  };

  const loadCitiesMunicipalities = async (provinceCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCitiesMunicipalities(provinceCode);
      setCitiesMunicipalities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cities/municipalities");
    } finally {
      setLoading(false);
    }
  };

  const loadBarangays = async (cityMunicipalityCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBarangays(cityMunicipalityCode);
      setBarangays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load barangays");
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSelect = (region: Region) => {
    setLocation({
      region,
      province: null,
      cityMunicipality: null,
      barangay: null,
    });
    setShowRegionModal(false);
    setRegionSearch("");
    // Load provinces for this region
    loadProvinces(region.code);
  };

  const handleProvinceSelect = (province: Province) => {
    setLocation((prev) => ({
      ...prev,
      province,
      cityMunicipality: null,
      barangay: null,
    }));
    setShowProvinceModal(false);
    setProvinceSearch("");
    // Load cities/municipalities for this province
    loadCitiesMunicipalities(province.code);
  };

  const handleCitySelect = (city: City | Municipality) => {
    setLocation((prev) => ({
      ...prev,
      cityMunicipality: city,
      barangay: null,
    }));
    setShowCityModal(false);
    setCitySearch("");
    // Load barangays for this city/municipality
    loadBarangays(city.code);
  };

  const handleBarangaySelect = (barangay: Barangay) => {
    setLocation((prev) => ({
      ...prev,
      barangay,
    }));
    setShowBarangayModal(false);
    setBarangaySearch("");
  };

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const filteredCities = citiesMunicipalities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredBarangays = barangays.filter((b) =>
    b.name.toLowerCase().includes(barangaySearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Your Location</Text>

      {/* Region Selector */}
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() => !disabled && setShowRegionModal(true)}
        disabled={disabled}
        accessibilityLabel="Select region"
        accessibilityRole="button"
        accessibilityHint="Opens region selection modal"
      >
        <Text style={location.region ? styles.selectedText : styles.placeholderText}>
          {location.region ? location.region.name : "Select Region"}
        </Text>
        <MaterialCommunityIcons name={ICONS.ACTION_ARROW_DOWN} size={12} color="#666" />
      </TouchableOpacity>

      {/* Province Selector */}
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() => !disabled && location.region && setShowProvinceModal(true)}
        disabled={disabled || !location.region}
        accessibilityLabel="Select province"
        accessibilityRole="button"
        accessibilityHint="Opens province selection modal"
      >
        <Text style={location.province ? styles.selectedText : styles.placeholderText}>
          {location.province
            ? location.province.name
            : location.region
            ? "Select Province"
            : "Select Region First"}
        </Text>
        <MaterialCommunityIcons name={ICONS.ACTION_ARROW_DOWN} size={12} color="#666" />
      </TouchableOpacity>

      {/* City/Municipality Selector */}
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() => !disabled && location.province && setShowCityModal(true)}
        disabled={disabled || !location.province}
        accessibilityLabel="Select city or municipality"
        accessibilityRole="button"
        accessibilityHint="Opens city/municipality selection modal"
      >
        <Text style={location.cityMunicipality ? styles.selectedText : styles.placeholderText}>
          {location.cityMunicipality
            ? location.cityMunicipality.name
            : location.province
            ? "Select City/Municipality"
            : "Select Province First"}
        </Text>
        <MaterialCommunityIcons name={ICONS.ACTION_ARROW_DOWN} size={12} color="#666" />
      </TouchableOpacity>

      {/* Barangay Selector */}
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={() =>
          !disabled && location.cityMunicipality && setShowBarangayModal(true)
        }
        disabled={disabled || !location.cityMunicipality}
        accessibilityLabel="Select barangay"
        accessibilityRole="button"
        accessibilityHint="Opens barangay selection modal"
      >
        <Text style={location.barangay ? styles.selectedText : styles.placeholderText}>
          {location.barangay
            ? location.barangay.name
            : location.cityMunicipality
            ? "Select Barangay"
            : "Select City/Municipality First"}
        </Text>
        <MaterialCommunityIcons name={ICONS.ACTION_ARROW_DOWN} size={12} color="#666" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Region Modal */}
      <Modal
        visible={showRegionModal}
        animationType="slide"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Region</Text>
            <TouchableOpacity onPress={() => setShowRegionModal(false)}>
              <MaterialCommunityIcons name={ICONS.ACTION_CLOSE} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search regions..."
            value={regionSearch}
            onChangeText={setRegionSearch}
            accessibilityLabel="Search regions"
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {filteredRegions.map((region) => (
                <TouchableOpacity
                  key={region.code}
                  style={styles.modalItem}
                  onPress={() => handleRegionSelect(region)}
                  accessibilityLabel={`Select ${region.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalItemText}>{region.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Province Modal */}
      <Modal
        visible={showProvinceModal}
        animationType="slide"
        onRequestClose={() => setShowProvinceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Province</Text>
            <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
              <MaterialCommunityIcons name={ICONS.ACTION_CLOSE} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search provinces..."
            value={provinceSearch}
            onChangeText={setProvinceSearch}
            accessibilityLabel="Search provinces"
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {filteredProvinces.map((province) => (
                <TouchableOpacity
                  key={province.code}
                  style={styles.modalItem}
                  onPress={() => handleProvinceSelect(province)}
                  accessibilityLabel={`Select ${province.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalItemText}>{province.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* City/Municipality Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City/Municipality</Text>
            <TouchableOpacity onPress={() => setShowCityModal(false)}>
              <MaterialCommunityIcons name={ICONS.ACTION_CLOSE} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities/municipalities..."
            value={citySearch}
            onChangeText={setCitySearch}
            accessibilityLabel="Search cities and municipalities"
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {filteredCities.map((city) => (
                <TouchableOpacity
                  key={city.code}
                  style={styles.modalItem}
                  onPress={() => handleCitySelect(city)}
                  accessibilityLabel={`Select ${city.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalItemText}>{city.name}</Text>
                  <Text style={styles.modalItemSubtext}>
                    {city.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Barangay Modal */}
      <Modal
        visible={showBarangayModal}
        animationType="slide"
        onRequestClose={() => setShowBarangayModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Barangay</Text>
            <TouchableOpacity onPress={() => setShowBarangayModal(false)}>
              <MaterialCommunityIcons name={ICONS.ACTION_CLOSE} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search barangays..."
            value={barangaySearch}
            onChangeText={setBarangaySearch}
            accessibilityLabel="Search barangays"
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {filteredBarangays.map((barangay) => (
                <TouchableOpacity
                  key={barangay.code}
                  style={styles.modalItem}
                  onPress={() => handleBarangaySelect(barangay)}
                  accessibilityLabel={`Select ${barangay.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalItemText}>{barangay.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 56,
  },
  disabledSelector: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  selectedText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  searchInput: {
    margin: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  modalContent: {
    flex: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalItemText: {
    fontSize: 16,
    color: "#000",
  },
  modalItemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
