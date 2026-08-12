import { Redirect, useLocalSearchParams } from "expo-router";

export default function () {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <Redirect
            href={{ pathname: "/products/[id]/upload-image/select-image-type", params: { id } }}
        />
    );
}
