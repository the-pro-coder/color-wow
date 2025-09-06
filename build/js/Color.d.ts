interface IColorFetcher {
    fetchColor(hex: string, blocked: boolean): Promise<Color>;
    generateRandomColor(): string;
}
declare class ColorFetcher implements IColorFetcher {
    fetchColor(hex: string, blocked: boolean): Promise<Color>;
    generateRandomColor(): string;
    private random;
}
interface IColor {
    name: string;
    hex: string;
}
export declare class Color implements IColor {
    readonly name: string;
    readonly hex: string;
    blocked: boolean;
    constructor(name: string, hex: string);
}
declare const colorFetcher: ColorFetcher;
export default colorFetcher;
export declare const loadColors: (count: number, update?: boolean) => Promise<Color[]>;
//# sourceMappingURL=Color.d.ts.map