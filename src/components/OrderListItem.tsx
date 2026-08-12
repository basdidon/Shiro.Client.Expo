import AppText from "@/components/ui/AppText";
import { formatDate, formatTime } from "@/lib/date";
import { getStatusIcon } from "@/lib/orderStatusIcon";
import { components } from "@/types/api";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { View } from "react-native";

type Order = components["schemas"]["OrderDto"];

export default ({ order: x }: { order: Order }) => {
    return (
        <View
            style={{
                backgroundColor: "white",
                padding: 12,
                columnGap: 12,
                marginBottom: 8,
            }}
        >
            <View style={{ flexDirection: "row", columnGap: 12, marginBottom: 8 }}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 88,
                        aspectRatio: 1,
                        backgroundColor: "beige",
                        borderRadius: 12,
                    }}
                >
                    <MaterialDesignIcons
                        name={getStatusIcon(x.status)}
                        size={64}
                        color={"lightsalmon"}
                    />
                </View>

                <View style={{ flex: 1, rowGap: 8 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            columnGap: 8,
                        }}
                    >
                        <AppText size="label"># {x.orderId?.slice(0, 8)}</AppText>
                        <View
                            style={{
                                alignItems: "flex-end",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 4,
                                }}
                            >
                                <AppText size="extraSmall">{formatTime(x.createdAt)}</AppText>
                                <MaterialDesignIcons
                                    name="clock-plus-outline"
                                    size={12}
                                    color={"gray"}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 4,
                                }}
                            >
                                <AppText size="extraSmall">{formatDate(x.createdAt)}</AppText>
                                <MaterialDesignIcons
                                    name="calendar-month-outline"
                                    size={12}
                                    color={"gray"}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        {x.orderLines !== undefined &&
                            (x.orderLines.length <= 4 ? (
                                <>
                                    {x.orderLines.map((line) => (
                                        <View
                                            key={line.productId}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginRight: 24,
                                            }}
                                        >
                                            <AppText
                                                size="small"
                                                style={{
                                                    color: "gray",
                                                    flexShrink: 1,
                                                    minWidth: 0,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {line.productName}
                                            </AppText>
                                            <AppText size="small" style={{ color: "gray" }}>
                                                x {line.quantity}
                                            </AppText>
                                        </View>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {x.orderLines.slice(0, 3).map((line) => (
                                        <View
                                            key={line.productId}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginRight: 24,
                                            }}
                                        >
                                            <AppText
                                                size="small"
                                                style={{
                                                    color: "gray",
                                                    flexShrink: 1,
                                                    minWidth: 0,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {line.productName}
                                            </AppText>
                                            <AppText size="small" style={{ color: "gray" }}>
                                                x {line.quantity}
                                            </AppText>
                                        </View>
                                    ))}
                                    <AppText size="small" style={{ color: "gray" }}>
                                        และอีก {x.orderLines.length - 3} รายการ
                                    </AppText>
                                </>
                            ))}
                    </View>
                </View>
            </View>
            {/* footer */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialDesignIcons
                        name="account-outline"
                        size={20}
                        color={"gray"}
                        style={{ marginRight: 8 }}
                    />
                    <AppText style={{ color: "gray" }}>{x.orderByName}</AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialDesignIcons
                        name="currency-thb"
                        size={20}
                        color={"gray"}
                        style={{ marginRight: 8 }}
                    />
                    <AppText style={{ fontSize: 14, fontFamily: "Mali_600SemiBold" }}>
                        {x.orderLines?.reduce((sum, line) => sum + Number(line.lineTotal ?? 0), 0)}
                        .-
                    </AppText>
                </View>
            </View>
        </View>
    );
};
