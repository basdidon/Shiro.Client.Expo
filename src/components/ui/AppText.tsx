import { StyleProp, Text, TextProps, TextStyle } from "react-native";

const baseStyle: StyleProp<TextStyle> = {};

type AppTextSizeKey =
    | "extraSmall"
    | "small"
    | "medium"
    | "large"
    | "label"
    | "title"
    | "heading"
    | "display";

const AppTextSizeStyles: Record<AppTextSizeKey, StyleProp<TextStyle>> = {
    extraSmall: { fontSize: 10 },
    small: { fontSize: 12 },
    medium: { fontSize: 14 },
    large: { fontSize: 16 },
    label: { fontSize: 16, fontWeight: "bold" },
    title: { fontSize: 20, fontWeight: "bold" },
    heading: { fontSize: 24, fontWeight: "bold" },
    display: { fontSize: 36, fontWeight: "bold" },
} as const;

interface AppTextProps extends TextProps {
    size?: AppTextSizeKey;
}

export default function AppText({ size = "medium", style, ...props }: AppTextProps) {
    return <Text {...props} style={[AppTextSizeStyles[size], baseStyle, style]} />;
}
