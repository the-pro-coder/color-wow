export const Save = (key:string, value:Object) => {
    let newVal = JSON.stringify(value);
    window.localStorage.setItem(key, newVal);
}
export const Load = (key:string):Object => {
    if (window.localStorage.getItem(key) != null) return JSON.parse(window.localStorage.getItem(key)!);
    return "--NONEXISTENT--";
}

export const copy = async (text:string) => {
    await window.navigator.clipboard.writeText(text);
}

export const Delete = async (key:string) => {
    await window.localStorage.removeItem("Palette");
}