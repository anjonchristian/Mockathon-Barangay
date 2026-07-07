import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, ICONS } from "./Icons";

interface DropdownOption {
  label: string;
  value: string;
}

interface LargeDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function LargeDropdown({
  label,
  value,
  options,
  onSelect,
  loading = false,
  error = null,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: LargeDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const displayValue = value || `Select ${label}`;
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setModalVisible(false);
    setSearchText("");
  };

  const handleOpenModal = () => {
    if (!disabled && !loading) {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          disabled && styles.dropdownDisabled,
        ]}
        onPress={handleOpenModal}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={accessibilityLabel || `${label} dropdown`}
        accessibilityHint={
          accessibilityHint || `Double tap to open ${label} options`
        }
        accessibilityRole="combobox"
        accessibilityState={{
          disabled,
          expanded: modalVisible,
          selected: !!value,
        }}
      >
        <Text
          style={[
            styles.dropdownText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayValue}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#22c55e" />
        ) : (
          <MaterialCommunityIcons
            name={ICONS.ACTION_ARROW_DOWN}
            size={16}
            color="#6b7280"
            style={styles.chevron}
          />
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                accessible={true}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name={ICONS.ACTION_CLOSE} size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
                accessible={true}
                accessibilityLabel="Search options"
              />
            </View>

            <ScrollView style={styles.optionsList}>
              {filteredOptions.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found</Text>
                </View>
              ) : (
                filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      value === option.value && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    accessible={true}
                    accessibilityLabel={option.label}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: value === option.value }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option.value && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <MaterialCommunityIcons
                        name={ICONS.ACTION_CHECK}
                        size={18}
                        color="#22c55e"
                      />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownError: {
    borderColor: "#ef4444",
  },
  dropdownDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#d1d5db",
  },
  dropdownText: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#9ca3af",
  },
  disabledText: {
    color: "#6b7280",
  },
  chevron: {
    marginLeft: 12,
  },
  errorContainer: {
    marginTop: 8,
    backgroundColor: "#fee",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "60%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#6b7280",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  optionItemSelected: {
    backgroundColor: "#dcfce7",
  },
  optionText: {
    fontSize: 18,
    color: "#000",
    flex: 1,
  },
  optionTextSelected: {
    color: "#22c55e",
    fontWeight: "600",
  },
});
