export const Save = (key, value) => {
    let newVal = JSON.stringify(value);
    window.localStorage.setItem(key, newVal);
};
export const Load = (key) => {
    if (window.localStorage.getItem(key) != null)
        return JSON.parse(window.localStorage.getItem(key));
    return "--NONEXISTENT--";
};
export const copy = async (text) => {
    await window.navigator.clipboard.writeText(text);
};
export const Delete = async (key) => {
    await window.localStorage.removeItem("Palette");
};
//# sourceMappingURL=Saving.js.map