import type { components } from "@/types/api";
import { StyleSheet, View } from "react-native";
import StepIndicator from "react-native-step-indicator";

type OrderStatus = components["schemas"]["OrderStatus"];

const LABELS = ["อยู่ระหว่างดำเนินการ", "จัดส่งแล้ว", "เสร็จสมบูรณ์"];

const POSITIONS: Record<Exclude<OrderStatus, "Cancelled">, number> = {
    Created: 0,
    Shipped: 1,
    Completed: 2,
};

const customStyles = {
    stepIndicatorSize: 24,
    currentStepIndicatorSize: 28,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "blue",
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: "blue",
    stepStrokeUnFinishedColor: "#ccc",
    separatorFinishedColor: "blue",
    separatorUnFinishedColor: "#ccc",
    stepIndicatorFinishedColor: "blue",
    stepIndicatorUnFinishedColor: "#efefef",
    stepIndicatorCurrentColor: "#fff",
    stepIndicatorLabelFontSize: 12,
    currentStepIndicatorLabelFontSize: 12,
    stepIndicatorLabelCurrentColor: "blue",
    stepIndicatorLabelFinishedColor: "#fff",
    stepIndicatorLabelUnFinishedColor: "#aaa",
    labelColor: "gray",
    currentStepLabelColor: "blue",
    labelSize: 12,
    labelFontFamily: "Mali_400Regular",
};

interface OrderStatusStepperProps {
    status: Exclude<OrderStatus, "Cancelled">;
}

export default function OrderStatusStepper({ status }: OrderStatusStepperProps) {
    return (
        <View style={styles.container}>
            <StepIndicator
                currentPosition={POSITIONS[status]}
                stepCount={LABELS.length}
                labels={LABELS}
                customStyles={customStyles}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
});
