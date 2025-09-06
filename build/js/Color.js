import { Load, Save } from "./Saving.js";
class ColorFetcher {
    async fetchColor(hex, blocked) {
        const url = 'https://www.thecolorapi.com/id?hex=' + hex.replace("#", "");
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Failed loading color " + hex);
        const data = await res.json();
        let c = new Color(data.name.value, data.hex.value);
        c.blocked = blocked;
        return c;
    }
    generateRandomColor() {
        const hexadigits = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += hexadigits[this.random(0, hexadigits.length)];
        }
        return color;
    }
    random(min, max) {
        let rnd = Math.floor(Math.random() * max) + min;
        return Math.min(Math.max(min, rnd), max);
    }
}
export class Color {
    constructor(name, hex) {
        this.name = name;
        this.hex = hex;
        this.blocked = false;
    }
}
const colorFetcher = new ColorFetcher();
export default colorFetcher;
export const loadColors = async (count, update = false) => {
    if (Load("Palette") != "--NONEXISTENT--" && !update)
        return Load("Palette");
    let colors = [];
    let revColors = Load("Palette");
    for (let i = 0; i < count; i++) {
        let genColor;
        let blocked = false;
        if (revColors[i].blocked) {
            genColor = revColors[i].hex;
            blocked = true;
        }
        else {
            genColor = colorFetcher.generateRandomColor();
        }
        colors.push(await colorFetcher.fetchColor(genColor, blocked));
    }
    Save("Palette", colors);
    return colors;
};
//# sourceMappingURL=Color.js.map