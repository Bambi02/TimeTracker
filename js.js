const startStopBtn = document.querySelector(".start")
const editDataWindow = document.querySelector(".edit-data");
const closeEditWindowBtn = document.querySelector(".fa-times");
const potvrdBtn = document.querySelector(".potvrd");

const inputHtmlTotal = document.querySelector("#html-celkom");
const inputHtmlTheory = document.querySelector("#html-teoria");
const inputCssTotal = document.querySelector("#css-celkom");
const inputCssTheory = document.querySelector("#css-teoria");
const inputJsTotal = document.querySelector("#js-celkom");
const inputJsTheory = document.querySelector("#js-teoria");
const inputReactTotal = document.querySelector("#react-celkom");
const inputReactTheory = document.querySelector("#react-teoria");
const inputNodejsTotal = document.querySelector("#node-js-celkom");
const inputNodejsTheory = document.querySelector("#node-js-teoria");
const inputExpressTotal = document.querySelector("#express-celkom");
const inputExpressTheory = document.querySelector("#express-teoria");
const inputDatabasesTotal = document.querySelector("#databases-celkom");
const inputDatabasesTheory = document.querySelector("#databases-teoria");


let intervalStopky = null;
let stopWatchIsRunning = false;
let straveneMinuty = 900;
let minutyNaZobrazenie = straveneMinuty;
let teoriaNiejeVacsia = true;
const inputsTotal = document.querySelectorAll(".input-celkom");
const inputsTheory = document.querySelectorAll(".input-teoria");

const date = new Date;
const day = date.getDate();
const month = date.getMonth();
const today = day.toString() + month.toString();
const last7Days = [];

class NewDay {
    constructor(totalMinutes, htmlTotal, htmlTheory, cssTotal, cssTheory, jsTotal, jsTheory, reactTotal, reactTheory,
        nodejsTotal, nodejsTheory, expressTotal, expressTheory, databasesTotal, databasesTheory, date, day, month){
            this.totalMinutes = totalMinutes;
            this.htmlTotal = htmlTotal;
            this.htmlTheory = htmlTheory;
            this.cssTotal = cssTotal;
            this.cssTheory = cssTheory;
            this.jsTotal = jsTotal;
            this.jsTheory = jsTheory;
            this.reactTotal = reactTotal;
            this.reactTheory  = reactTheory;
            this.nodejsTotal = nodejsTotal;
            this.nodejsTheory = nodejsTheory;
            this.expressTotal = expressTotal;
            this.expressTheory = expressTheory;
            this.databasesTotal = databasesTotal;
            this.databasesTheory = databasesTheory;
            this.date = date;
            this.day = day;
            this.month = month;
        }
}

console.log(today)

const storedMinutes = {

    days7 : new NewDay(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),

    days30 : {

    },

    total : new NewDay(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
    
}


startStopBtn.addEventListener("click", () => {
    changeBtnText();
    runStopWatch();
})

closeEditWindowBtn.addEventListener("click", ()=> closeEditWindow());

inputsTotal.forEach(input => {
    input.addEventListener("keyup", () => updateMinutesForDistribution())
})

potvrdBtn.addEventListener("click", () => {
    chcekIfTheoryIsGreater();
    if(minutyNaZobrazenie > 0){
        createErrorMsg("Prerozdel vsetky minuty co mas k dispozicii");
    }else if(minutyNaZobrazenie < 0){
        createErrorMsg("Nemozes priradit viac minut ako mas k dispozicii");
    }else if(!teoriaNiejeVacsia){
        createErrorMsg("Teoria nemoze byt vacsia ako prislusne minuty celkom");
    }else{

        redistributeStoredMinutes();
        updateGraphTotal();

    }
})


function createTodaysData(todaysDate) {
    daysData = new NewDay(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, todaysDate);
    if (last7Days.length = 7){
        last7Days.unshift(daysData);
        last7Days.pop();
    }else{
        last7Days.unshift(daysData);
    } 

    console.log(last7Days);
}
createTodaysData(today);

function modifyTodaysData(indexOf) {
    last7Days[indexOf].totalMinutes += straveneMinuty;
    last7Days[indexOf].htmlTotal += parseInt(inputHtmlTotal.value);
    last7Days[indexOf].htmlTheory += parseInt(inputHtmlTheory.value);
    last7Days[indexOf].cssTotal += parseInt(inputCssTotal.value);
    last7Days[indexOf].cssTheory += parseInt(inputCssTheory.value);
    last7Days[indexOf].jsTotal += parseInt(inputJsTotal.value);
    last7Days[indexOf].jsTheory += parseInt(inputJsTheory.value);
    last7Days[indexOf].reactTotal += parseInt(inputReactTotal.value);
    last7Days[indexOf].reactTheory  += parseInt(inputReactTheory.value);
    last7Days[indexOf].nodejsTotal += parseInt(inputNodejsTotal.value);
    last7Days[indexOf].nodejsTheory += parseInt(inputNodejsTheory.value);
    last7Days[indexOf].expressTotal += parseInt(inputExpressTotal.value);
    last7Days[indexOf].expressTheory += parseInt(inputExpressTheory.value);
    last7Days[indexOf].databasesTotal += parseInt(inputDatabasesTotal.value);
    last7Days[indexOf].databasesTheory += parseInt(inputDatabasesTheory.value);
}


function chcekForTodaysData(){
    setEmptyInputValue(inputsTotal);
    setEmptyInputValue(inputsTheory);
    if (last7Days.length>0){
        last7Days.forEach(day => {
            if (day.date === today){
                modifyTodaysData(last7Days.indexOf(day));
            }else{
                createTodaysData(today);
            }
        })
    }else{
        createTodaysData(today);
    }
    console.log(last7Days);
}



function updateGraphTotal(){
    const graphDescription = document.querySelector("#popis-celkom");
    const graphHtml = document.querySelector(".html-celkom");
    const graphCss = document.querySelector(".css-celkom");
    const graphJs = document.querySelector(".js-celkom");
    const graphReact = document.querySelector(".react-celkom");
    const graphNodejs = document.querySelector(".node-js-celkom");
    const graphExpress = document.querySelector(".express-celkom");
    const graphDatabases = document.querySelector(".databases-celkom");

    graphDescription.innerText = `celkom - ${Math.floor(storedMinutes.total.totalMinutes/60)} h a ${storedMinutes.total.totalMinutes%60} m`;

    graphHtml.style.width = `${Math.floor((storedMinutes.total.htmlTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphCss.style.width = `${Math.floor((storedMinutes.total.cssTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphJs.style.width = `${Math.floor((storedMinutes.total.jsTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphReact.style.width = `${Math.floor((storedMinutes.total.reactTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphNodejs.style.width = `${Math.floor((storedMinutes.total.nodejsTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphExpress.style.width = `${Math.floor((storedMinutes.total.expressTotal/storedMinutes.total.totalMinutes)*100)}%`;
    graphDatabases.style.width = `${Math.floor((storedMinutes.total.databasesTotal/storedMinutes.total.totalMinutes)*100)}%`;

    graphHtml.children[1].innerText = `${Math.floor(storedMinutes.total.htmlTotal/60)} h`;
    graphCss.children[1].innerText = `${Math.floor(storedMinutes.total.cssTotal/60)} h`;
    graphJs.children[1].innerText = `${Math.floor(storedMinutes.total.jsTotal/60)} h`;
    graphReact.children[1].innerText = `${Math.floor(storedMinutes.total.reactTotal/60)} h`;
    graphNodejs.children[1].innerText = `${Math.floor(storedMinutes.total.nodejsTotal/60)} h`;
    graphExpress.children[1].innerText = `${Math.floor(storedMinutes.total.expressTotal/60)} h`;
    graphDatabases.children[1].innerText = `${Math.floor(storedMinutes.total.databasesTotal/60)} h`;
}


function createErrorMsg(errorMsg){
    const div = document.createElement("div");
    const vrchnaSekcia = document.querySelector(".vrchna-sekcia");
    const zvysneMinuty = document.querySelector(".zvysne-minuty")

    div.className = "error-message";
    div.innerText = errorMsg;
    vrchnaSekcia.insertBefore(div, zvysneMinuty);
    setTimeout(() => div.remove(), 2000);
}

function redistributeStoredMinutes() {
    setEmptyInputValue(inputsTotal);
    setEmptyInputValue(inputsTheory);

    chcekForTodaysData();

    storedMinutes.total.totalMinutes += straveneMinuty;
    storedMinutes.total.htmlTotal += parseInt(inputHtmlTotal.value);
    storedMinutes.total.htmlTheory += parseInt(inputHtmlTheory.value);
    storedMinutes.total.cssTotal += parseInt(inputCssTotal.value);
    storedMinutes.total.cssTheory += parseInt(inputCssTheory.value);
    storedMinutes.total.jsTotal += parseInt(inputJsTotal.value);
    storedMinutes.total.jsTheory += parseInt(inputJsTheory.value);
    storedMinutes.total.reactTotal += parseInt(inputReactTotal.value);
    storedMinutes.total.reactTheory += parseInt(inputReactTheory.value);
    storedMinutes.total.nodejsTotal += parseInt(inputNodejsTotal.value);
    storedMinutes.total.nodejsTheory += parseInt(inputNodejsTheory.value);
    storedMinutes.total.expressTotal += parseInt(inputExpressTotal.value);
    storedMinutes.total.expressTheory += parseInt(inputExpressTheory.value);
    storedMinutes.total.databasesTotal += parseInt(inputDatabasesTotal.value);
    storedMinutes.total.databasesTheory += parseInt(inputDatabasesTheory.value);

    inputsTotal.forEach(input => input.value = "");
    inputsTheory.forEach(input => input.value = "");
    straveneMinuty = 0;
    updateMinutesForDistribution();

    //console.log(storedMinutes.total)
}

function chcekIfTheoryIsGreater() {
    setEmptyInputValue(inputsTotal);
    setEmptyInputValue(inputsTheory);
    for(let i = 0; i<inputsTotal.length; i++){
        if (parseInt(inputsTotal[i].value) >= parseInt(inputsTheory[i].value)){
            teoriaNiejeVacsia = true;
        }else{
            teoriaNiejeVacsia = false;
            break;
        }
        console.log(parseInt(inputsTotal[i].value))
        console.log(parseInt(inputsTheory[i].value))
    }
}


function setEmptyInputValue(inputField) {
    inputField.forEach(input => {
        if (input.value.length === 0){
            input.value = 0
        }
    })
}


function closeEditWindow() {
    editDataWindow.style.display="none"
}


function changeBtnText(){
    startStopBtn.textContent === 'Štart' ? startStopBtn.textContent = 'Stop' : startStopBtn.textContent = 'Štart';
}


function runStopWatch(){
    const stopky = document.querySelector(".casovac");

    let hodiny = 0;
    let minuty = 0;
    let sekundy = 0;

    if(!stopWatchIsRunning){
        stopWatchIsRunning = true;

        intervalStopky = setInterval(() => {
            sekundy++;
            if(sekundy === 60){
                if(minuty === 60){
                    sekundy = 0;
                    minuty = 0;
                    hodiny++;
                    straveneMinuty++;
                }else{
                    sekundy=0;
                    minuty++;
                    straveneMinuty++;
                }
            }

            if(hodiny<10 && minuty<10 && sekundy<10){
                stopky.textContent = `0${hodiny}:0${minuty}:0${sekundy}`
            }else if(hodiny<10 && minuty<10){
                stopky.textContent = `0${hodiny}:0${minuty}:${sekundy}`
            }else if(hodiny<10 && sekundy <10){
                stopky.textContent = `0${hodiny}:${minuty}:0${sekundy}`
            }else if(hodiny<10){
                stopky.textContent = `0${hodiny}:${minuty}:${sekundy}`
            }else if(minuty<10 && selundy<10){
                stopky.textContent = `${hodiny}:0${minuty}:0${sekundy}`
            }else if(minuty<10){
                stopky.textContent = `${hodiny}:0${minuty}:${sekundy}`
            }else if(sekundy<10){
                stopky.textContent = `${hodiny}:${minuty}:0${sekundy}`
            }else{
                stopky.textContent = `${hodiny}:${minuty}:${sekundy}`
            }
        }, 990);
    }else{
        clearInterval(intervalStopky);
        stopWatchIsRunning = false;
        editDataWindow.style.display = "block";
        editSpentMinutes();
    }   
}


function editSpentMinutes(){
    const spentMinutes = document.querySelector(".zvysne-minuty");
    spentMinutes.innerText = `${minutyNaZobrazenie} minut`;
}

//update minutes in dom, delete after...
const spentMinutes = document.querySelector(".zvysne-minuty");

spentMinutes.innerText = `${straveneMinuty} minut`;
//this block

function updateMinutesForDistribution(){
    let rozdeleneMinuty = 0;

    inputsTotal.forEach(input => {
        if(input.value.length !== 0){
            rozdeleneMinuty += parseInt(input.value)
        }
    })

    minutyNaZobrazenie = straveneMinuty - rozdeleneMinuty;
    editSpentMinutes();
}