class DataToStore {
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
};

const startStopBtn = document.querySelector(".start")
const editDataWindow = document.querySelector(".edit-data");
const modifyDataWindow = document.querySelector(".modify-data");
const closeEditWindowBtn = document.querySelector(".close-edit");
const closeModifyWindowBtn = document.querySelector(".close-modify");
const potvrdBtn = document.querySelector(".potvrd");
const upravBtn = document.querySelector(".modify");
const openModifyBtn = document.querySelector(".open-modify");
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
const modifyHtmlTotal = document.querySelector("#html-modify");
const modifyHtmlTheory = document.querySelector("#html-modify-teoria");
const modifyCssTotal = document.querySelector("#css-modify");
const modifyCssTheory = document.querySelector("#css-modify-teoria");
const modifyJsTotal = document.querySelector("#js-modify");
const modifyJsTheory = document.querySelector("#js-modify-teoria");
const modifyReactTotal = document.querySelector("#react-modify");
const modifyReactTheory = document.querySelector("#react-modify-teoria");
const modifyNodejsTotal = document.querySelector("#node-js-modify");
const modifyNodejsTheory = document.querySelector("#node-js-modify-teoria");
const modifyExpressTotal = document.querySelector("#express-modify");
const modifyExpressTheory = document.querySelector("#express-modify-teoria");
const modifyDatabasesTotal = document.querySelector("#databases-modify");
const modifyDatabasesTheory = document.querySelector("#databases-modify-teoria");
const inputsTotal = document.querySelectorAll(".input-celkom");
const inputsTotalModify = document.querySelectorAll(".input-celkom2");
const inputsTheory = document.querySelectorAll(".input-teoria");
const confirmWindow = document.querySelector(".confirm");
const confirmAnoBtn = document.querySelector(".ano");
const confirmNieBtn = document.querySelector(".nie");

let intervalStopky = null;
let stopWatchIsRunning = false;
let straveneMinuty = 0;
let minutyNaZobrazenie = straveneMinuty;
let theoryIsGreater = true;
let storedMinutes = {
    last7Days : [],
    last30Days : [],
    last7Total : new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),
    last30Total : new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),
    total : new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
};

const date = new Date;
const day = date.getDate();
const month = date.getMonth();
const daysInMoths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dateID = `${day}${month}`;
const last30daysID = [];



window.addEventListener("load", () => {
    fetchLocalStorage()
    createTodaysData(dateID, "last7Days", 7);
    createTodaysData(dateID, "last30Days", 30);
    updateGraphValues("Total", "celkom", "total");
    updateGraphValues("Last 7 days", "7dni", "last7Total");
    updateGraphValues("Last 30 days", "30dni", "last30Total");
})

startStopBtn.addEventListener("click", () => {
    changeBtnText();
    runStopWatch();
})

closeEditWindowBtn.addEventListener("click", ()=> closeEditWindow(editDataWindow));

closeModifyWindowBtn.addEventListener("click", ()=> closeEditWindow(modifyDataWindow));

inputsTotal.forEach(input => {
    input.addEventListener("keyup", () => updateMinutesForDistribution())
})

potvrdBtn.addEventListener("click", () => {
    chcekIfTheoryIsGreater();
    if(minutyNaZobrazenie > 0){
        createErrorMsg("Prerozdel vsetky minuty co mas k dispozicii");
    }else if(minutyNaZobrazenie < 0){
        createErrorMsg("Nemozes priradit viac minut ako mas k dispozicii");
    }else if(theoryIsGreater){
        createErrorMsg("Teoria nemoze byt vacsia ako prislusne minuty celkom");
    }else{
        document.querySelector(".casovac").textContent = '00:00:00';
        redistributeStoredMinutes();
        pushDataFromArrayToTotal("last7Total", "last7Days", 7);
        pushDataFromArrayToTotal("last30Total", "last30Days", 30);
        updateGraphValues("Total", "celkom", "total");
        updateGraphValues("Last 7 days", "7dni", "last7Total");
        updateGraphValues("Last 30 days", "30dni", "last30Total");
        localStorage.setItem("timeTracker", JSON.stringify(storedMinutes));
    }
})

openModifyBtn.addEventListener("click", () => {
    openModifyWindow();
    fillModifyInputsWithValues();
})

upravBtn.addEventListener("click", () => {
    confirmWindow.style.display = "flex";
    closeModifyWindowBtn.style.pointerEvents = "none";

});

confirmNieBtn.addEventListener("click", () => {
    confirmWindow.style.display = "none";
    closeModifyWindowBtn.style.pointerEvents = "auto";
});

confirmAnoBtn.addEventListener("click", () => {
    modifyTotalMinutes();
    pushModifiedMinutes();
    localStorage.setItem("timeTracker", JSON.stringify(storedMinutes));
    updateGraphValues("Total", "celkom", "total");
    closeModifyWindowBtn.style.pointerEvents = "auto";
    confirmWindow.style.display = "none";
    modifyDataWindow.style.display="none"
})

function pushModifiedMinutes() {
    storedMinutes.total.htmlTotal = parseInt(modifyHtmlTotal.value);
    storedMinutes.total.htmlTheory = parseInt(modifyHtmlTheory.value);
    storedMinutes.total.cssTotal = parseInt(modifyCssTotal.value);
    storedMinutes.total.cssTheory = parseInt(modifyCssTheory.value);
    storedMinutes.total.jsTotal = parseInt(modifyJsTotal.value);
    storedMinutes.total.jsTheory = parseInt(modifyJsTheory.value);
    storedMinutes.total.reactTotal = parseInt(modifyReactTotal.value);
    storedMinutes.total.reactTheory = parseInt(modifyReactTheory.value);
    storedMinutes.total.nodejsTotal = parseInt(modifyNodejsTotal.value);
    storedMinutes.total.nodejsTheory = parseInt(modifyNodejsTheory.value);
    storedMinutes.total.expressTotal = parseInt(modifyExpressTotal.value);
    storedMinutes.total.expressTheory = parseInt(modifyExpressTheory.value);
    storedMinutes.total.databasesTotal = parseInt(modifyDatabasesTotal.value);
    storedMinutes.total.databasesTheory = parseInt(modifyDatabasesTheory.value);
}

function modifyTotalMinutes() {
    let sum = 0;

    inputsTotalModify.forEach(input => sum += parseInt(input.value));
    storedMinutes.total.totalMinutes = sum;
}

function openModifyWindow(){
    modifyDataWindow.style.display = "block";
}

function fillModifyInputsWithValues(){
    modifyHtmlTotal.value = storedMinutes.total.htmlTotal;
    modifyHtmlTheory.value = storedMinutes.total.htmlTheory;
    modifyCssTotal.value = storedMinutes.total.cssTotal;
    modifyCssTheory.value = storedMinutes.total.cssTheory;
    modifyJsTotal.value = storedMinutes.total.jsTotal;
    modifyJsTheory.value = storedMinutes.total.jsTheory;
    modifyReactTotal.value = storedMinutes.total.reactTotal;
    modifyReactTheory.value = storedMinutes.total.reactTheory;
    modifyNodejsTotal.value = storedMinutes.total.nodejsTotal;
    modifyNodejsTheory.value = storedMinutes.total.nodejsTheory;
    modifyExpressTotal.value = storedMinutes.total.expressTotal;
    modifyExpressTheory.value = storedMinutes.total.expressTheory;
    modifyDatabasesTotal.value = storedMinutes.total.databasesTotal;
    modifyDatabasesTheory.value = storedMinutes.total.databasesTheory;
}


function fetchLocalStorage() {
    if(localStorage.getItem("timeTracker")){
        storedMinutes = JSON.parse(localStorage.getItem("timeTracker"));
    }else{
        return
    }
}


function pushDataFromArrayToTotal(lastXTotal, lastXDays, numberOfDays) {
    storedMinutes[lastXTotal] = new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    for(let i=0; i<numberOfDays; i++){
        storedMinutes[lastXTotal].totalMinutes += storedMinutes[lastXDays][i].totalMinutes;
        storedMinutes[lastXTotal].htmlTotal += storedMinutes[lastXDays][i].htmlTotal;
        storedMinutes[lastXTotal].htmlTheory += storedMinutes[lastXDays][i].htmlTheory;
        storedMinutes[lastXTotal].cssTotal += storedMinutes[lastXDays][i].cssTotal;
        storedMinutes[lastXTotal].cssTheory += storedMinutes[lastXDays][i].cssTheory;
        storedMinutes[lastXTotal].jsTotal += storedMinutes[lastXDays][i].jsTotal;
        storedMinutes[lastXTotal].jsTheory += storedMinutes[lastXDays][i].jsTheory;
        storedMinutes[lastXTotal].reactTotal += storedMinutes[lastXDays][i].reactTotal;
        storedMinutes[lastXTotal].reactTheory += storedMinutes[lastXDays][i].reactTheory;
        storedMinutes[lastXTotal].nodejsTotal += storedMinutes[lastXDays][i].nodejsTotal;
        storedMinutes[lastXTotal].nodejsTheory += storedMinutes[lastXDays][i].nodejsTheory;
        storedMinutes[lastXTotal].expressTotal += storedMinutes[lastXDays][i].expressTotal;
        storedMinutes[lastXTotal].expressTheory += storedMinutes[lastXDays][i].expressTheory;
        storedMinutes[lastXTotal].databasesTotal += storedMinutes[lastXDays][i].databasesTotal;
        storedMinutes[lastXTotal].databasesTheory += storedMinutes[lastXDays][i].databasesTheory;
    }
}


function createTodaysData(todaysID, lastXDays, numberOfDays) {
    const daysData = new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, todaysID, 0, 0);
    if (storedMinutes[lastXDays].length === numberOfDays){
        if(storedMinutes[lastXDays][0].dateID !== dateID){
            storedMinutes[lastXDays].unshift(daysData);
            storedMinutes[lastXDays].pop();
            checkForSkippedDays(lastXDays, numberOfDays);
        }
    }else{
        storedMinutes[lastXDays].unshift(daysData);
        populateEmptyDays(lastXDays, numberOfDays);
        checkForSkippedDays(lastXDays, numberOfDays);
    } 
}



function checkForSkippedDays(lastXDays, numberOfDays) {
    createLast30DaysOfIDs();
        
    for(let i = 0; i<numberOfDays; i++){
        if(storedMinutes[lastXDays][i].dateID !== last30daysID[i]){
            storedMinutes[lastXDays].splice(i, 0, createDayWithDateID(last30daysID[i]));
            storedMinutes[lastXDays].pop();
        }
    }
}


function createLast30DaysOfIDs(){
    for(let i=0; i<30; i++){
        const localDate = new Date(new Date().setDate(new Date().getDate()-i));
        const localDay = localDate.getDate();
        const localMonth = localDate.getMonth();
        const localID = `${localDay}${localMonth}`;

        last30daysID.push(localID);
    }
}


function createDayWithDateID(dateID) {
    let emptyDay = new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,dateID,0,0);
    return emptyDay;
}



function populateEmptyDays(lastXDays, numberOfDays){
    const emptySpaces = numberOfDays - (storedMinutes[lastXDays].length);
    for(let i = storedMinutes[lastXDays].length; i<=emptySpaces; i++){
        let emptyDay = new DataToStore(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        storedMinutes[lastXDays].push(emptyDay);
    }
}


function modifyArrayFor(timeScope) {
    storedMinutes[timeScope][0].totalMinutes += straveneMinuty;
    storedMinutes[timeScope][0].htmlTotal += parseInt(inputHtmlTotal.value);
    storedMinutes[timeScope][0].htmlTheory += parseInt(inputHtmlTheory.value);
    storedMinutes[timeScope][0].cssTotal += parseInt(inputCssTotal.value);
    storedMinutes[timeScope][0].cssTheory += parseInt(inputCssTheory.value);
    storedMinutes[timeScope][0].jsTotal += parseInt(inputJsTotal.value);
    storedMinutes[timeScope][0].jsTheory += parseInt(inputJsTheory.value);
    storedMinutes[timeScope][0].reactTotal += parseInt(inputReactTotal.value);
    storedMinutes[timeScope][0].reactTheory  += parseInt(inputReactTheory.value);
    storedMinutes[timeScope][0].nodejsTotal += parseInt(inputNodejsTotal.value);
    storedMinutes[timeScope][0].nodejsTheory += parseInt(inputNodejsTheory.value);
    storedMinutes[timeScope][0].expressTotal += parseInt(inputExpressTotal.value);
    storedMinutes[timeScope][0].expressTheory += parseInt(inputExpressTheory.value);
    storedMinutes[timeScope][0].databasesTotal += parseInt(inputDatabasesTotal.value);
    storedMinutes[timeScope][0].databasesTheory += parseInt(inputDatabasesTheory.value);
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


function updateGraphValues(graphDscription, htmlSelector, numberOfLastDays){
    const graphDescription = document.querySelector(`#popis-${htmlSelector}`);
    const graphHtml = document.querySelector(`.html-${htmlSelector}`);
    const graphCss = document.querySelector(`.css-${htmlSelector}`);
    const graphJs = document.querySelector(`.js-${htmlSelector}`);
    const graphReact = document.querySelector(`.react-${htmlSelector}`);
    const graphNodejs = document.querySelector(`.node-js-${htmlSelector}`);
    const graphExpress = document.querySelector(`.express-${htmlSelector}`);
    const graphDatabases = document.querySelector(`.databases-${htmlSelector}`);

    graphDescription.innerText = `${graphDscription} - ${Math.floor(storedMinutes[numberOfLastDays].totalMinutes/60)} h a ${storedMinutes[numberOfLastDays].totalMinutes%60} m`;

    graphHtml.style.width = `${Math.floor((storedMinutes[numberOfLastDays].htmlTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphCss.style.width = `${Math.floor((storedMinutes[numberOfLastDays].cssTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphJs.style.width = `${Math.floor((storedMinutes[numberOfLastDays].jsTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphReact.style.width = `${Math.floor((storedMinutes[numberOfLastDays].reactTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphNodejs.style.width = `${Math.floor((storedMinutes[numberOfLastDays].nodejsTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphExpress.style.width = `${Math.floor((storedMinutes[numberOfLastDays].expressTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;
    graphDatabases.style.width = `${Math.floor((storedMinutes[numberOfLastDays].databasesTotal/storedMinutes[numberOfLastDays].totalMinutes)*100*0.92)}%`;

    graphHtml.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].htmlTotal/60)} h`;
    graphCss.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].cssTotal/60)} h`;
    graphJs.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].jsTotal/60)} h`;
    graphReact.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].reactTotal/60)} h`;
    graphNodejs.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].nodejsTotal/60)} h`;
    graphExpress.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].expressTotal/60)} h`;
    graphDatabases.children[1].innerText = `${Math.floor(storedMinutes[numberOfLastDays].databasesTotal/60)} h`;

    graphHtml.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].htmlTheory/storedMinutes[numberOfLastDays].htmlTotal)*100)}%`;
    graphCss.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].cssTheory/storedMinutes[numberOfLastDays].cssTotal)*100)}%`;
    graphJs.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].jsTheory/storedMinutes[numberOfLastDays].jsTotal)*100)}%`;
    graphReact.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].reactTheory/storedMinutes[numberOfLastDays].reactTotal)*100)}%`;
    graphNodejs.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].nodejsTheory/storedMinutes[numberOfLastDays].nodejsTotal)*100)}%`;
    graphExpress.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].expressTheory/storedMinutes[numberOfLastDays].expressTotal)*100)}%`;
    graphDatabases.children[0].style.width = `${Math.floor((storedMinutes[numberOfLastDays].databasesTheory/storedMinutes[numberOfLastDays].databasesTotal)*100)}%`;

    graphHtml.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].htmlTheory/60)} h`;
    graphCss.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].cssTheory/60)} h`;
    graphJs.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].jsTheory/60)} h`;
    graphReact.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].reactTheory/60)} h`;
    graphNodejs.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].nodejsTheory/60)} h`;
    graphExpress.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].expressTheory/60)} h`;
    graphDatabases.children[0].children[0].innerText = `${Math.floor(storedMinutes[numberOfLastDays].databasesTheory/60)} h`;
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

    modifyArrayFor("last7Days");
    modifyArrayFor("last30Days");
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
            theoryIsGreater = false;
        }else{
            theoryIsGreater = true;
            return
        }
    }
}


function setEmptyInputValueToZero(inputField) {
    inputField.forEach(input => {
        if (input.value.length === 0){
            input.value = 0
        }
    })
}


function closeEditWindow(window) {
    window.style.display="none"
}


function changeBtnText(){
    startStopBtn.textContent === 'Štart' ? startStopBtn.textContent = 'Stop' : startStopBtn.textContent = 'Štart';
}


function runStopWatch(){
    const stopky = document.querySelector(".casovac");
    const spentMinutes = document.querySelector(".zvysne-minuty");


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
        spentMinutes.innerText = `${straveneMinuty} minut`;
        editDataWindow.style.display = "block";
        minutyNaZobrazenie = straveneMinuty;
        editSpentMinutes();
    }   
}


function editSpentMinutes(){
    const spentMinutes = document.querySelector(".zvysne-minuty");

    spentMinutes.innerText = `${minutyNaZobrazenie} minut`;
}


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