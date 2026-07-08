import { Pressable, ScrollView, Text, View } from "react-native";

interface RadioPillButtonOption {
    id: number | string;
    label: string;
    value: string;
}

interface RadioPillButtonGroupProps {
    options: RadioPillButtonOption[];
    onPress: (id: string, value: string) => void;
    selectedId: string | undefined;
}

const RadioPillButtonGroup = ({ options, selectedId, onPress }: RadioPillButtonGroupProps) => {
    return (
        <View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ columnGap: 8, marginVertical: 4 }}
            >
                {options.map((x) => {
                    const selected = selectedId == x.id;
                    const id = x.id.toString();
                    return (
                        <Pressable
                            key={id}
                            style={[
                                {
                                    paddingHorizontal: 12,
                                    paddingVertical: 4,
                                    borderRadius: 12,
                                    borderColor: "blue",
                                    borderWidth: 1,
                                },
                                selected && { backgroundColor: "blue" },
                            ]}
                            onPress={() => onPress(id, x.value)}
                        >
                            <Text style={selected ? { color: "white" } : { color: "blue" }}>
                                {x.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default RadioPillButtonGroup;
