import { Load, Save } from "./Saving.js";

interface IColorFetcher {
    fetchColor(hex:string, blocked:boolean):Promise<Color>,
    generateRandomColor():string,
}

class ColorFetcher implements IColorFetcher {
    async fetchColor(hex:string, blocked:boolean) {
        const url = 'https://www.thecolorapi.com/id?hex=' + hex.replace("#", "");
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed loading color " + hex);

        const data = await res.json();
        
        let c = new Color(data.name.value, data.hex.value);
        c.blocked = blocked;
        return c;
    }
    generateRandomColor(): string {
        const hexadigits = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += hexadigits[this.random(0, hexadigits.length)];
        }
        return color;
    }
    private random(min:number, max:number) {
        let rnd = Math.floor(Math.random() * max) + min;
        return Math.min(Math.max(min, rnd), max);
    }
}

interface IColor {
    name:string,
    hex:string,
}

export class Color implements IColor{
    public readonly name:string;
    public readonly hex:string;
    public blocked:boolean;

    constructor(name:string, hex:string) {
        this.name = name;
        this.hex = hex;
        this.blocked = false;
    }
}


const colorFetcher = new ColorFetcher();
export default colorFetcher;

export const loadColors = async (count:number, update:boolean=false):Promise<Color[]> => {
    if (Load("Palette") != "--NONEXISTENT--" && !update)
        return Load("Palette") as Color[];

    let colors:Color[] = []
    let revColors = Load("Palette") as Color[];
    for (let i = 0; i < count; i++) {
        let genColor:string;
        let blocked:boolean = false;
        if (revColors[i]!.blocked)
        {
            genColor = revColors[i]!.hex;
            blocked = true;
        }
        else
        {
            genColor = colorFetcher.generateRandomColor();
        }
        colors.push(await colorFetcher.fetchColor(genColor, blocked));
    }
    Save("Palette", colors);
    return colors;
}