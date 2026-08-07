import type { AlertButton, AlertOptions } from "react-native";

// react-native-web's Alert.alert is a no-op, so confirmation/error dialogs
// silently did nothing on web. This maps the same call shape onto
// window.alert/confirm. Only handles 0-2 buttons since that's all this app uses;
// with 2 buttons, whichever isn't style:"cancel" is treated as the confirm action.
export function showAlert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    _options?: AlertOptions,
) {
    const text = message ? `${title}\n\n${message}` : title;

    if (!buttons || buttons.length === 0) {
        window.alert(text);
        return;
    }

    if (buttons.length === 1) {
        window.alert(text);
        buttons[0].onPress?.();
        return;
    }

    const cancelButton = buttons.find((b) => b.style === "cancel");
    const confirmButton = buttons.find((b) => b !== cancelButton) ?? buttons[buttons.length - 1];

    if (window.confirm(text)) {
        confirmButton.onPress?.();
    } else {
        cancelButton?.onPress?.();
    }
}
