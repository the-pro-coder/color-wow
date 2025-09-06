import { Color, loadColors } from "./Color.js";
import { copy, Save, Load, Delete } from "./Saving.js";
let colors = [];
const uiColors = document.getElementsByClassName("color-container");
const uiData = document.getElementsByClassName("color-data");
document.body.onload = async () => { checkConnection(); checkSavedData(); colors = await loadColors(uiColors.length); setupColors(); setupUIButtonsFunctionality(); };
const reloadBtn = document.getElementById("reload-btn");
reloadBtn.onclick = async () => { await updateColors(); setupColors(); setupUIButtonsFunctionality(); };
document.addEventListener("keydown", (e) => { if (e.key == " ") {
    reloadBtn.click();
} });
const checkConnection = () => {
    while (!window.navigator.onLine) {
        alert("No Internet Connection! Check your internet connection, close this page and try again...");
    }
};
const checkSavedData = () => {
    let data = Load("Palette");
    if (data.length != uiColors.length) {
        Delete("Palette");
    }
};
const setupUIButtonsFunctionality = async () => {
    let copyEls = document.getElementsByClassName("copy");
    let otherCopyEls = document.getElementsByClassName("color-hex-data");
    for (let el = 0; el < copyEls.length; el++) {
        let elM = copyEls[el];
        let elO = otherCopyEls[el];
        let elC = colors[el];
        elM.onclick = () => copy(elC.hex);
        elO.onclick = () => copy(elC.hex);
    }
    let blockEls = document.getElementsByClassName("block");
    for (let el = 0; el < blockEls.length; el++) {
        let elM = blockEls[el];
        let elC = colors[el];
        let elC_M = { ...elC };
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
        elM.onclick = () => { colors[colors.indexOf(elC)] = elC_M; Save("Palette", colors); setupUIButtonsFunctionality(); };
    }
    let shiftEls = document.getElementsByClassName("shift-buttons");
    for (let el = 0; el < shiftEls.length; el++) {
        let elM = shiftEls[el];
        let elMLeft = elM.getElementsByClassName("color-btn")[0];
        let elMRight = elM.getElementsByClassName("color-btn")[1];
        let elC = colors[el];
        console.log(elM.getElementsByClassName("color-btn"));
        elMLeft.onclick = () => {
            if (!elC.blocked) {
                let firstIndex = colors.indexOf(elC);
                let index = colors.indexOf(elC);
                index = Math.max(index - 1, 0);
                let shiftedColor = colors[index];
                let mustEscape = false;
                while (shiftedColor.blocked) {
                    index = Math.max(index - 1, 0);
                    shiftedColor = colors[index];
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
                setupUIButtonsFunctionality();
            }
            ;
        };
        elMRight.onclick = () => {
            if (!elC.blocked) {
                let firstIndex = colors.indexOf(elC);
                let index = colors.indexOf(elC);
                index = Math.min(index + 1, colors.length - 1);
                let shiftedColor = colors[index];
                let mustEscape = false;
                while (shiftedColor.blocked) {
                    index = Math.min(index + 1, colors.length - 1);
                    shiftedColor = colors[index];
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
                setupUIButtonsFunctionality();
            }
            ;
        };
    }
};
const setupColors = () => {
    for (let i = 0; i < uiColors.length; i++) {
        const element = uiColors[i];
        const colorElement = colors[i];
        element.style.backgroundColor = colorElement.hex;
        // UPDATE UI TEXT
        const dataElement = uiData[i];
        let colorText = dataElement.getElementsByClassName("color-hex-data")[0];
        let nameText = dataElement.getElementsByClassName("color-name-data")[0];
        colorText.innerText = colorElement.hex;
        nameText.innerText = colorElement.name;
    }
};
const updateColors = async () => {
    let count = uiColors.length; // change later
    colors = await loadColors(count, true);
    setupColors();
};
//# sourceMappingURL=main.js.map