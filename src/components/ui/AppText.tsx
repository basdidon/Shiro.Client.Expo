import { StyleProp, Text, TextProps, TextStyle } from "react-native";

const baseStyle: StyleProp<TextStyle> = { fontFamily: "Mali_400Regular" };

type AppTextSizeKey =
    | "extraSmall"
    | "small"
    | "medium"
    | "large"
    | "label"
    | "title"
    | "heading"
    | "display";

// Mali needs lineHeight = 2x fontSize or tall marks like ไม้เอก get clipped on Android.
// That leaves unwanted empty space below the glyph, so we claw it back with a negative
// marginBottom (margin sits outside the text's internal render box, so it doesn't
// reintroduce the clipping).
const LINE_HEIGHT_RATIO = 2;
const VISUAL_RATIO = 1.3;

function sizeStyle(fontSize: number): TextStyle {
    return {
        fontSize,
        lineHeight: fontSize * LINE_HEIGHT_RATIO,
        marginBottom: -(fontSize * (LINE_HEIGHT_RATIO - VISUAL_RATIO)),
    };
}

const AppTextSizeStyles: Record<AppTextSizeKey, StyleProp<TextStyle>> = {
    extraSmall: sizeStyle(10),
    small: sizeStyle(12),
    medium: sizeStyle(14),
    large: sizeStyle(16),
    label: { ...sizeStyle(16), fontFamily: "Mali_700Bold" },
    title: { ...sizeStyle(20), fontFamily: "Mali_700Bold" },
    heading: { ...sizeStyle(24), fontFamily: "Mali_700Bold" },
    display: { ...sizeStyle(36), fontFamily: "Mali_700Bold" },
} as const;

interface AppTextProps extends TextProps {
    size?: AppTextSizeKey;
}

export default function AppText({ size = "medium", style, ...props }: AppTextProps) {
    return <Text {...props} style={[baseStyle, AppTextSizeStyles[size], style]} />;
}
