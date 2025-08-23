import {Color, loadColors} from "./Color.js";
import { copy, Save, Load } from "./Saving.js";
let colors:Color[] = [];
const uiColors = document.getElementsByClassName("color-container");
const uiData = document.getElementsByClassName("color-data")
document.body.onload = async () => {colors = await loadColors(uiColors.length); setupColors(); setupUIButtonsFunctionality();};
const reloadBtn = document.getElementById("reload-btn") as HTMLButtonElement;
reloadBtn.onclick = async ()=>{await updateColors(); setupColors(); setupUIButtonsFunctionality();};
document.addEventListener("keydown", (e)=>{if (e.key == " "){reloadBtn.click()}})
const setupUIButtonsFunctionality = async () => {
    let copyEls = document.getElementsByClassName("copy");
    let otherCopyEls = document.getElementsByClassName("color-hex-data");
    for (let el = 0; el < copyEls.length; el++) {
        let elM = copyEls[el] as HTMLButtonElement;
        let elO = otherCopyEls[el] as HTMLButtonElement;
        let elC = colors[el] as Color;
        elM.onclick = ()=>copy(elC.hex);
        elO.onclick = ()=>copy(elC.hex);
    }

    let blockEls = document.getElementsByClassName("block");
    for (let el = 0; el < blockEls.length; el++) {
        let elM = blockEls[el] as HTMLButtonElement;
        let elC = colors[el] as Color;
        let elC_M = {...elC} as Color;
        elC_M.blocked = !elC_M.blocked;
        if (!elC_M.blocked) {
            if (!elM.classList.contains("blocked"))
                elM.classList.add("blocked"); 
            if (elM.classList.contains("unblocked"))
                elM.classList.remove("unblocked");
        }
        else {
            if (!elM.classList.contains("unblocked"))
                elM.classList.add("unblocked"); 
            if (elM.classList.contains("blocked"))
                elM.classList.remove("blocked");
        }
        elM.onclick = ()=>{colors[colors.indexOf(elC)] = elC_M; Save("Palette", colors); setupUIButtonsFunctionality()};
    }

    let shiftEls = document.getElementsByClassName("shift-buttons");
    for (let el = 0; el < shiftEls.length; el++) {
        let elM = shiftEls[el] as HTMLDivElement;
        let elMLeft = elM.getElementsByClassName("color-btn")[0] as HTMLButtonElement;
        let elMRight = elM.getElementsByClassName("color-btn")[1] as HTMLButtonElement;
        let elC = colors[el] as Color;
        console.log(elM.getElementsByClassName("color-btn"));
        elMLeft.onclick = ()=>{
            if (!elC.blocked)
            {
            let firstIndex:number = colors.indexOf(elC);

            let index:number = colors.indexOf(elC);
            index = Math.max(index - 1, 0);
            let shiftedColor:Color = colors[index] as Color;
            let mustEscape:boolean = false;

            while (shiftedColor.blocked) {
                index = Math.max(index - 1, 0);
                shiftedColor = colors[index] as Color;
                if (index == 0 && shiftedColor.blocked) {
                    mustEscape = true;
                    break;
                }
            }
            if (mustEscape) {
                return;
            }

            colors[index] = elC;
            colors[firstIndex] = shiftedColor;
            Save("Palette", colors); 
            setupColors();
            setupUIButtonsFunctionality()};
        }


        elMRight.onclick = () => {
            if (!elC.blocked)
            {
            let firstIndex:number = colors.indexOf(elC);
            let index:number = colors.indexOf(elC);
            index = Math.min(index + 1, colors.length - 1);
            let shiftedColor:Color = colors[index] as Color;
            let mustEscape:boolean = false;

            while (shiftedColor.blocked) {
                index = Math.min(index + 1, colors.length - 1);
                shiftedColor = colors[index] as Color;
                if ((index == colors.length - 1) && shiftedColor.blocked) {
                    mustEscape = true;
                    break;
                }
            }
            if (mustEscape) {
                return;
            }
            colors[index] = elC;
            colors[firstIndex] = shiftedColor;
            Save("Palette", colors); 
            setupColors();
            setupUIButtonsFunctionality()};
        }
        }
    }

const setupColors = ():void => {
    for (let i = 0; i < uiColors.length; i++) {
        const element = uiColors[i] as HTMLDivElement;
        const colorElement:Color = colors[i] as Color;
        element.style.backgroundColor = colorElement.hex as string;

        // UPDATE UI TEXT
        const dataElement = uiData[i];
        let colorText:HTMLSpanElement = dataElement!.getElementsByClassName("color-hex-data")[0] as HTMLSpanElement;
        let nameText:HTMLSpanElement = dataElement!.getElementsByClassName("color-name-data")[0] as HTMLSpanElement;
        colorText.innerText = colorElement.hex;
        nameText.innerText = colorElement.name;
    }
}

const updateColors = async () => {
    let count = uiColors.length // change later
    colors = await loadColors(count, true); 
    setupColors();
}
