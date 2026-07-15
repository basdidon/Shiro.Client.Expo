// Curated subset of @react-native-vector-icons/material-design-icons names,
// picked to cover common retail categories. Keep this list in sync with the
// icon grid in FormIconPicker.
export const CATEGORY_ICON_NAMES = [
    "toy-brick",
    "cellphone",
    "tshirt-crew",
    "food-apple",
    "coffee",
    "book-open-variant",
    "tools",
    "sofa",
    "basketball",
    "lipstick",
    "paw",
    "baby-carriage",
    "pill",
    "flower",
    "car",
    "laptop",
    "television",
    "watch",
    "shoe-formal",
    "glasses",
    "headphones",
    "camera",
    "gamepad-variant",
    "bottle-wine",
    "fridge",
    "washing-machine",
    "lightbulb",
    "silverware-fork-knife",
    "candy",
    "tag",
] as const;

export type CategoryIconName = (typeof CATEGORY_ICON_NAMES)[number];

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "tag";
