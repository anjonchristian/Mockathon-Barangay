import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export { MaterialCommunityIcons, MaterialIcons, FontAwesome };

/**
 * Centralized icon name mapping for the e-Kap app.
 * Uses MaterialCommunityIcons (MCI) as the primary icon set.
 * All icon names below are valid MCI icon names.
 * Browse at https://pictogrammers.com/library/mdi/
 */
export const ICONS = {
  // Tab bar icons
  TAB_DOCUMENTS: "file-document-outline",
  TAB_EBLOTTER: "clipboard-text-outline",
  TAB_AI_ASSISTANT: "robot-outline",
  TAB_PROFILE: "account-outline",

  // Document type icons
  DOC_BARANGAY_CLEARANCE: "file-certificate-outline",
  DOC_CERTIFICATE_INDIGENCY: "credit-card-outline",
  DOC_BARANGAY_ID: "card-account-details-outline",
  DOC_CERTIFICATE_RESIDENCY: "home-outline",

  // Verification status icons
  VERIFICATION_LOCKED: "lock-outline",
  VERIFICATION_PENDING: "clock-outline",
  VERIFICATION_REJECTED: "alert-circle-outline",
  VERIFICATION_APPROVED: "check-circle-outline",

  // Profile / info icons
  PROFILE_ID: "card-account-details-outline",
  PROFILE_ADDRESS: "map-marker-outline",
  PROFILE_PHONE: "phone-outline",
  PROFILE_DOCUMENTS: "file-document-outline",
  PROFILE_BLOTTER: "clipboard-text-outline",
  PROFILE_NOTIFICATIONS: "bell-outline",
  PROFILE_PRIVACY: "shield-lock-outline",
  PROFILE_HELP: "help-circle-outline",
  PROFILE_REFRESH: "refresh",
  PROFILE_REGISTER: "account-plus-outline",

  // Action icons
  ACTION_MIC: "microphone",
  ACTION_MIC_OFF: "microphone-off",
  ACTION_CAMERA: "camera",
  ACTION_CAMERA_FLIP: "camera-flip-outline",
  ACTION_PHONE: "phone",
  ACTION_PHONE_HANGUP: "phone-hangup",
  ACTION_VIDEO: "video",
  ACTION_VIDEO_OFF: "video-off",
  ACTION_CHAT: "chat-outline",
  ACTION_SEND: "send",
  ACTION_ARROW_BACK: "arrow-left",
  ACTION_ARROW_FORWARD: "arrow-right",
  ACTION_ARROW_DOWN: "chevron-down",
  ACTION_CLOSE: "close",
  ACTION_CHECK: "check",
  ACTION_EDIT: "pencil-outline",

  // Status icons
  STATUS_SUCCESS: "check-circle",
  STATUS_ERROR: "alert-circle",
  STATUS_INFO: "information-outline",
  STATUS_WARNING: "alert-outline",

  // Misc
  MISC_LOCATION: "map-marker",
  MISC_SEARCH: "magnify",
} as const;
