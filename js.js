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


let pridavac = 0;


//const date = new Date;
let date  = new Date(new Date().setDate(new Date().getDate()+pridavac));
const day = date.getDate();
const month = date.getMonth();
const daysInMoths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dateID = `${day}${month}`;
const last7dateID = [];

class StoredData {
    constructor(totalMinutes, htmlTotal, htmlTheory, cssTotal, cssTheory, jsTotal, jsTheory, reactTotal, reactTheory,
        nodejsTotal, nodejsTheory, expressTotal, expressTheory, databasesTotal, databasesTheory, dateID, day, month){
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
            this.dateID = dateID;
            this.day = day;
            this.month = month;
        }
}



const storedMinutes = {
    last7Days : [
        new StoredData(1000,100,0,300,0,200,0,300,0,100,0,0,0,0,0, "225"),
        new StoredData(1000,200,0,100,0,300,0,200,0,200,0,0,0,0,0,"215"),
        new StoredData(1100,300,300,300,200,200,100,200,200,100,0,0,0,0,0, "195"),
        new StoredData(0,0,0,100,0,0,0,0,0,0,0,0,0,0,0),
        new StoredData(0,0,0,0,200,0,0,0,0,0,0,0,0,0,0),
        new StoredData(0,0,0,0,0,300,0,0,0,0,0,0,0,0,0),
        new StoredData(0,0,0,0,0,0,500,0,0,0,0,0,0,0,0),
    ],
    last30Days : [],

    last7Total : new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),

    last30Total : new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),

    total : new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
}




window.addEventListener("load", () => createTodaysData(dateID, day, month))

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
        pushDataFromArrayToTotal();
        updateGraph7Days();

    }
})


// helper code
const minuty = document.querySelector("#pridajminuty");
const datum = document.querySelector("#zvysdatum");
const reload = document.querySelector("#nacitajstranku");


minuty.addEventListener("click", ()=> {
    straveneMinuty = 900
})
datum.addEventListener("click", ()=> {
    pridavac++
    date  = new Date(new Date().setDate(new Date().getDate()+pridavac));
})
reload.addEventListener("click", ()=> {
    createTodaysData(dateID, day, month);
    console.log(storedMinutes.total);
    console.log(storedMinutes.last7Days)
})
//potialto asi

function pushDataFromArrayToTotal() {
    for(let i=0; i<7; i++){
        storedMinutes.last7Total.totalMinutes += storedMinutes.last7Days[i].totalMinutes;
        storedMinutes.last7Total.htmlTotal += storedMinutes.last7Days[i].htmlTotal;
        storedMinutes.last7Total.htmlTheory += storedMinutes.last7Days[i].htmlTheory;
        storedMinutes.last7Total.cssTotal += storedMinutes.last7Days[i].cssTotal;
        storedMinutes.last7Total.cssTheory += storedMinutes.last7Days[i].cssTheory;
        storedMinutes.last7Total.jsTotal += storedMinutes.last7Days[i].jsTotal;
        storedMinutes.last7Total.jsTheory += storedMinutes.last7Days[i].jsTheory;
        storedMinutes.last7Total.reactTotal += storedMinutes.last7Days[i].reactTotal;
        storedMinutes.last7Total.reactTheory += storedMinutes.last7Days[i].reactTheory;
        storedMinutes.last7Total.nodejsTotal += storedMinutes.last7Days[i].nodejsTotal;
        storedMinutes.last7Total.nodejsTheory += storedMinutes.last7Days[i].nodejsTheory;
        storedMinutes.last7Total.expressTotal += storedMinutes.last7Days[i].expressTotal;
        storedMinutes.last7Total.expressTheory += storedMinutes.last7Days[i].expressTheory;
        storedMinutes.last7Total.databasesTotal += storedMinutes.last7Days[i].databasesTotal;
        storedMinutes.last7Total.databasesTheory += storedMinutes.last7Days[i].databasesTheory;
    }
}


function createTodaysData(todaysID, todaysDay, todaysMonth) {
    daysData = new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, todaysID, todaysDay, todaysMonth);
    if (storedMinutes.last7Days.length === 7){
        if(storedMinutes.last7Days[0].dateID !== dateID){
            storedMinutes.last7Days.unshift(daysData);
            storedMinutes.last7Days.pop();
            checkForSkippedDays();
        }else{
            return;
        }
    }else{
        storedMinutes.last7Days.unshift(daysData);
        populateEmptyDays()
    } 
    console.log(storedMinutes.last7Days);
}


function populateEmptyDays(){
    const emptySpaces = 7 - (storedMinutes.last7Days.length);
    for(let i = storedMinutes.last7Days.length; i<=emptySpaces; i++){
        let emptyDay = new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        storedMinutes.last7Days.push(emptyDay);
    }
}


function checkForSkippedDays() {
    createLast7DaysOfIDs();
        
    for(let i = 0; i<last7dateID.length; i++){
        if(storedMinutes.last7Days[i].dateID !== last7dateID[i]){
            storedMinutes.last7Days.splice(i, 0, createDayWithDateID(last7dateID[i]));
            storedMinutes.last7Days.pop();
        }
    }
}


function createLast7DaysOfIDs(){
    for(let i=0; i<7; i++){
        const localDate = new Date(new Date().setDate(new Date().getDate()-i+pridavac));
        const localDay = localDate.getDate();
        const localMonth = localDate.getMonth();
        const localID = `${localDay}${localMonth}`;

        last7dateID.push(localID);
    }
}


function createDayWithDateID(dateID) {
    let emptyDay = new StoredData(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,dateID,0,0);
    return emptyDay;
}







function modifyTodaysData() {
    storedMinutes.last7Days[0].totalMinutes += straveneMinuty;
    storedMinutes.last7Days[0].htmlTotal += parseInt(inputHtmlTotal.value);
    storedMinutes.last7Days[0].htmlTheory += parseInt(inputHtmlTheory.value);
    storedMinutes.last7Days[0].cssTotal += parseInt(inputCssTotal.value);
    storedMinutes.last7Days[0].cssTheory += parseInt(inputCssTheory.value);
    storedMinutes.last7Days[0].jsTotal += parseInt(inputJsTotal.value);
    storedMinutes.last7Days[0].jsTheory += parseInt(inputJsTheory.value);
    storedMinutes.last7Days[0].reactTotal += parseInt(inputReactTotal.value);
    storedMinutes.last7Days[0].reactTheory  += parseInt(inputReactTheory.value);
    storedMinutes.last7Days[0].nodejsTotal += parseInt(inputNodejsTotal.value);
    storedMinutes.last7Days[0].nodejsTheory += parseInt(inputNodejsTheory.value);
    storedMinutes.last7Days[0].expressTotal += parseInt(inputExpressTotal.value);
    storedMinutes.last7Days[0].expressTheory += parseInt(inputExpressTheory.value);
    storedMinutes.last7Days[0].databasesTotal += parseInt(inputDatabasesTotal.value);
    storedMinutes.last7Days[0].databasesTheory += parseInt(inputDatabasesTheory.value);
}

function modifyTotalData() {
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
}



function updateGraphTotal(){
    const graphDescription = document.querySelector(`#popis-celkom`);
    const graphHtml = document.querySelector(`.html-celkom`);
    const graphCss = document.querySelector(`.css-celkom`);
    const graphJs = document.querySelector(`.js-celkom`);
    const graphReact = document.querySelector(`.react-celkom`);
    const graphNodejs = document.querySelector(`.node-js-celkom`);
    const graphExpress = document.querySelector(`.express-celkom`);
    const graphDatabases = document.querySelector(`.databases-celkom`);

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

function updateGraph7Days(){
    const graphDescription = document.querySelector(`#popis-7dni`);
    const graphHtml = document.querySelector(`.html-7dni`);
    const graphCss = document.querySelector(`.css-7dni`);
    const graphJs = document.querySelector(`.js-7dni`);
    const graphReact = document.querySelector(`.react-7dni`);
    const graphNodejs = document.querySelector(`.node-js-7dni`);
    const graphExpress = document.querySelector(`.express-7dni`);
    const graphDatabases = document.querySelector(`.databases-7dni`);

    graphDescription.innerText = `celkom - ${Math.floor(storedMinutes.last7Total.totalMinutes/60)} h a ${storedMinutes.last7Total.totalMinutes%60} m`;

    graphHtml.style.width = `${Math.floor((storedMinutes.last7Total.htmlTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphCss.style.width = `${Math.floor((storedMinutes.last7Total.cssTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphJs.style.width = `${Math.floor((storedMinutes.last7Total.jsTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphReact.style.width = `${Math.floor((storedMinutes.last7Total.reactTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphNodejs.style.width = `${Math.floor((storedMinutes.last7Total.nodejsTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphExpress.style.width = `${Math.floor((storedMinutes.last7Total.expressTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;
    graphDatabases.style.width = `${Math.floor((storedMinutes.last7Total.databasesTotal/storedMinutes.last7Total.totalMinutes)*100)}%`;

    graphHtml.children[1].innerText = `${Math.floor(storedMinutes.last7Total.htmlTotal/60)} h`;
    graphCss.children[1].innerText = `${Math.floor(storedMinutes.last7Total.cssTotal/60)} h`;
    graphJs.children[1].innerText = `${Math.floor(storedMinutes.last7Total.jsTotal/60)} h`;
    graphReact.children[1].innerText = `${Math.floor(storedMinutes.last7Total.reactTotal/60)} h`;
    graphNodejs.children[1].innerText = `${Math.floor(storedMinutes.last7Total.nodejsTotal/60)} h`;
    graphExpress.children[1].innerText = `${Math.floor(storedMinutes.last7Total.expressTotal/60)} h`;
    graphDatabases.children[1].innerText = `${Math.floor(storedMinutes.last7Total.databasesTotal/60)} h`;
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
    setEmptyInputValueToZero(inputsTotal);
    setEmptyInputValueToZero(inputsTheory);

    modifyTodaysData();
    modifyTotalData();

    inputsTotal.forEach(input => input.value = "");
    inputsTheory.forEach(input => input.value = "");
    straveneMinuty = 0;
    updateMinutesForDistribution();
}


function chcekIfTheoryIsGreater() {
    setEmptyInputValueToZero(inputsTotal);
    setEmptyInputValueToZero(inputsTheory);
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


function setEmptyInputValueToZero(inputField) {
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