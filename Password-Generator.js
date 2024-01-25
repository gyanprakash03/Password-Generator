const inputSlider = document.querySelector("#slider");
const lengthCounter = document.querySelector("#counter");

const passwordHolder = document.querySelector("#password-holder");
const copyBtn = document.querySelector("#copy-btn");
const copyMsg = document.querySelector(".copy-text");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const indicator = document.querySelector("#strength-indicator");
const generateBtn = document.querySelector("#generate-btn");

const symbols = '!@#$%^&*()_+-={}[]:;"<>,.?/|`';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();

//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthCounter.innerText = passwordLength;

    inputSlider.style.backgroundSize = (inputSlider.value * 5) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 5px 5px ${color}4D`;
    
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {

      setIndicator("#00d000");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {

      setIndicator("#ffff00");
    } 
    else {

      setIndicator("#ff0000");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordHolder.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordHolder.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {

    if(checkCount <= 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("started generating");
    
    //remove old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordHolder.value = password;

    //calculate strength
    calcStrength();
});