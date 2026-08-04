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

function sizeStyle(fontSize: number): TextStyle {
    return {
        fontSize,
    };
}

const AppTextSizeStyles: Record<AppTextSizeKey, StyleProp<TextStyle>> = {
    extraSmall: { fontSize: 10 },
    small: { fontSize: 12 },
    medium: { fontSize: 14 },
    large: { fontSize: 16 },
    label: { fontSize: 16, fontFamily: "Mali_700Bold" },
    title: { fontSize: 20, fontFamily: "Mali_700Bold" },
    heading: { fontSize: 24, fontFamily: "Mali_700Bold" },
    display: { fontSize: 36, fontFamily: "Mali_700Bold" },
} as const;

interface AppTextProps extends TextProps {
    size?: AppTextSizeKey;
}

export default function AppText({ size = "medium", style, ...props }: AppTextProps) {
    return <Text {...props} style={[baseStyle, AppTextSizeStyles[size], style]} />;
}
