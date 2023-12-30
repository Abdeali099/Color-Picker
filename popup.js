const colorPickerBtn = document.querySelector("#color-picker");
const colorList = document.querySelector(".all-colors");
const clear_color = document.querySelector('.clear-all');
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");
const pickedColorElement = document.querySelector('.picked-colors');


const copyColor = (element) => {
    navigator.clipboard.writeText(element.dataset.color);

    element.innerText = "Copied";

    setTimeout(() => element.innerText = element.dataset.color, 1000);
}

const showColors = () => {

    // if no colors show default bg

    if (!pickedColors.length) {
        return;
    }

    // generating li for picked color and adding it to colorList

    colorList.innerHTML = pickedColors.map(color =>
        `<li class="color">
            <span class="rect" style="background:${color};border:1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
         </li>`
    ).join("");
    
    // removing default image
    document.querySelector('.default_bg_msg').style.display="none";

    // showing element (Visible DOM)
    pickedColorElement.classList.remove("hide");

    // add a click event listener to each color element to copy the color code

    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild))
    });

};

showColors();

const activateEyeDropper = async () => {

    try {
        // creating new object for eye dropper to get color
        const eyeDropper = new EyeDropper();

        // getting Hex code for color
        const { sRGBHex } = await eyeDropper.open();

        // copy color to clipbord
        navigator.clipboard.writeText(sRGBHex.toString().toUpperCase());

        // if color not exist then push

        if (!pickedColors.includes(sRGBHex)) {

            // storing in array
            pickedColors.push(sRGBHex);

            // storing it to local storage for persistance
            localStorage.setItem("picked-colors", JSON.stringify(pickedColors));

            // showing colors
            showColors();
        }

    } catch (error) {
        console.log("Error in eye droper : ", error);
    }

};

const clearAllColors = () => {

    // removing from array
    pickedColors.length = 0;

    // removing from local storage
    localStorage.removeItem("picked-colors");

    // removing from dom
    pickedColorElement.classList.add("hide");

        
    // removing default image
    document.querySelector('.default_bg_msg').style.display="flex";

}

colorPickerBtn.addEventListener("click", activateEyeDropper);
clear_color.addEventListener('click', clearAllColors);
