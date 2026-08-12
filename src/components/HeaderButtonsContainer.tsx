import { ReactNode } from "react";
import { View } from "react-native";

const HeaderButtonsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <View style={{ flexDirection: "row", columnGap: 12, marginHorizontal: 12 }}>
            {children}
        </View>
    );
};

export default HeaderButtonsContainer;
