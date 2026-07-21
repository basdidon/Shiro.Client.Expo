import api from "@/lib/api";

// The backend doesn't document a response schema for this endpoint yet
// (no ProducesResponseType on the controller), so this is typed by hand
// to match UserDto.roles (string[]) until the OpenAPI spec is annotated.
export const getAssignableRoles = async (): Promise<string[]> => {
    const { data } = await api.get<string[]>("/api/v1/users/assignable-roles");
    return data;
};
