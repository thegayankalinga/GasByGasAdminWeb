export const SystemUserType = {
    3: "Admin",
    4: "Manager"
};


export const getSystemUserType = (value) => {
    return SystemUserType[value] || "Unknown";
};