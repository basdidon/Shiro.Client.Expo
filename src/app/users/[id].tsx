import AppText from "@/components/ui/AppText";
import { useAssignRole, useAssignableRoles, useRemoveRole, useUser } from "@/hooks/useUsers";
import { showAlert } from "@/lib/alert";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ContactRow({
    icon,
    value,
    confirmed,
}: {
    icon: "email-outline" | "phone-outline";
    value?: string;
    confirmed?: boolean;
}) {
    if (!value) return null;

    return (
        <View style={styles.contactRow}>
            <MaterialDesignIcons name={icon} size={20} color="gray" style={{ marginRight: 8 }} />
            <AppText size="medium" style={{ flex: 1 }}>
                {value}
            </AppText>
            <MaterialDesignIcons
                name={confirmed ? "check-circle" : "alert-circle-outline"}
                size={16}
                color={confirmed ? "green" : "orange"}
                style={{ marginRight: 4 }}
            />
            <AppText size="small" style={{ color: confirmed ? "green" : "orange" }}>
                {confirmed ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
            </AppText>
        </View>
    );
}

function RoleChip({
    role,
    removable,
    onRemove,
}: {
    role: string;
    removable: boolean;
    onRemove: () => void;
}) {
    return (
        <View style={[styles.chip, removable && styles.chipRemovable]}>
            <AppText size="medium" style={styles.chipText}>
                {role}
            </AppText>
            {removable && (
                <Pressable onPress={onRemove} hitSlop={8}>
                    <MaterialDesignIcons name="close" size={14} color="white" />
                </Pressable>
            )}
        </View>
    );
}

export default function UserDetailScreen() {
    const { id: userId } = useLocalSearchParams<{ id: string }>();
    const { data: user, isPending, isError } = useUser(userId);
    const { data: assignableRoles } = useAssignableRoles();
    const assignRole = useAssignRole();
    const removeRole = useRemoveRole();

    const [pickerOpen, setPickerOpen] = useState(false);

    const handleRemoveRole = (role: string) => {
        showAlert("นำบทบาทออก", `ต้องการนำบทบาท "${role}" ออกจาก ${user?.username} หรือไม่?`, [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "นำออก",
                style: "destructive",
                onPress: () =>
                    removeRole.mutate(
                        { userId, role },
                        {
                            onError: () => showAlert("เกิดข้อผิดพลาด", "ไม่สามารถนำบทบาทออกได้"),
                        },
                    ),
            },
        ]);
    };

    const handleAssignRole = (role: string) => {
        setPickerOpen(false);
        assignRole.mutate(
            { userId, role },
            {
                onError: () => showAlert("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มบทบาทได้"),
            },
        );
    };

    if (isPending) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={64} />
            </View>
        );
    }

    if (isError || !user) {
        return (
            <View style={styles.center}>
                <AppText>ไม่พบผู้ใช้</AppText>
            </View>
        );
    }

    const userRoles = user.roles ?? [];
    const assignableSet = new Set(assignableRoles ?? []);
    const rolesToAdd = (assignableRoles ?? []).filter((role) => !userRoles.includes(role));

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
            <View style={{ flexDirection: "row", gap: 12 }}>
                <View
                    style={{
                        backgroundColor: "cyan",
                        width: 120,
                        aspectRatio: 1,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MaterialDesignIcons name="account" size={92} color="white" />
                </View>
                <View style={{ gap: 8 }}>
                    <AppText size="heading">{user.username}</AppText>
                    {(user.firstname || user.lastname) && (
                        <AppText size="medium" style={{ color: "gray" }}>
                            {`${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()}
                        </AppText>
                    )}
                    <AppText size="small" style={{ color: "#ccc" }}>
                        {user.userId}
                    </AppText>
                </View>
            </View>

            <View style={styles.section}>
                <AppText size="title" style={{ marginBottom: 12 }}>
                    ข้อมูลติดต่อ
                </AppText>
                <ContactRow
                    icon="email-outline"
                    value={user.email}
                    confirmed={user.isEmailConfirmed}
                />
                <ContactRow
                    icon="phone-outline"
                    value={user.phoneNumber}
                    confirmed={user.isPhoneNimberConfirmed}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <AppText size="title">บทบาท</AppText>
                    <Pressable
                        onPress={() => setPickerOpen(true)}
                        hitSlop={8}
                        disabled={rolesToAdd.length === 0}
                    >
                        <MaterialDesignIcons
                            name="plus-circle-outline"
                            size={24}
                            color={rolesToAdd.length === 0 ? "#ccc" : "blue"}
                        />
                    </Pressable>
                </View>

                <View style={styles.chipRow}>
                    {userRoles.length === 0 ? (
                        <AppText style={{ color: "gray" }}>ยังไม่มีบทบาท</AppText>
                    ) : (
                        userRoles.map((role) => (
                            <RoleChip
                                key={role}
                                role={role}
                                removable={assignableSet.has(role)}
                                onRemove={() => handleRemoveRole(role)}
                            />
                        ))
                    )}
                </View>
            </View>

            <Modal
                visible={pickerOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <AppText size="title" style={{ marginBottom: 12 }}>
                            เพิ่มบทบาท
                        </AppText>
                        {rolesToAdd.map((role) => (
                            <Pressable
                                key={role}
                                style={styles.roleOption}
                                onPress={() => handleAssignRole(role)}
                            >
                                <AppText size="large">{role}</AppText>
                            </Pressable>
                        ))}
                        <Pressable style={styles.closeBtn} onPress={() => setPickerOpen(false)}>
                            <AppText style={styles.closeBtnText}>ปิด</AppText>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: "snow" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    section: { marginTop: 24 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#999",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    chipRemovable: { backgroundColor: "blue" },
    chipText: { color: "white" },
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    modalCard: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 4,
    },
    roleOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
    closeBtn: { marginTop: 16, paddingVertical: 12, alignItems: "center" },
    closeBtnText: { color: "blue", fontSize: 16, fontFamily: "Mali_600SemiBold" },
});
