
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');
var colors = ['red', 'blue', 'orange', 'yellow', 'brown', 'green'];

var startPoint = {};
var shapePoints = [{x:400, y:100}, {x:200,y:450}, {x:600,y:400}];

function drawPixel(x, y, color) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);
    context.fillStyle = color || '#000';
    context.fillRect(roundedX, roundedY, 1, 1);
}

function main(){
    context.fillStyle = "white";
    context.fillRect(0,0,800,600);

    drawTriangle();
    setdisplayShapePoints();
    canvas.addEventListener("click", setStartPoint);
    canvas.addEventListener("click", setdisplayShapePoints);
}


function drawTriangle(){

    shapePoints.forEach(p => {
        drawPixel(p.x, p.y);
        shapePoints.forEach(otherP => {
            if(p == otherP) return;
            drawConnection(p, otherP);
        });
    });

}

function drawConnection(p1, p2){
    let linearF = linearFunctionForTwoPoints(p1, p2);
    let minX = p1.x < p2.x ? p1.x : p2.x;
    let maxX = minX == p1.x ? p2.x : p1.x;

    for(let x = minX; x < maxX; x++){
        drawPixel(x, linearF(x))
    }
}

var magic_counter = 0;
var MAGIC_LIMIT = 1000;

function doMagic(){
    if(!startPoint.x){
        alert("set start point")
        return;
    }

    magic_counter = 0;
    let inputLimit = document.getElementById("magic-limit");
    if(inputLimit.value) MAGIC_LIMIT = inputLimit.value;

    while(magic_counter < MAGIC_LIMIT){

        let nextPoint = chooseRandomPointOfShape();
        let linearF = linearFunctionForTwoPoints(startPoint, nextPoint);

        let x = nextPoint.x + ((startPoint.x - nextPoint.x) / 2)
        let y = linearF(x);

        let calculation = ((x + y) % 2);
        console.log(calculation)
        let condition = calculation < 1;
        if(condition){
            drawPixel(x, y)
            startPoint.x = x;
            startPoint.y = y;

        }
        magic_counter++;

    }
}

function chooseRandomPointOfShape(){
    let i = getRandomInt(shapePoints.length);
    return shapePoints[i];
}

function linearFunctionForTwoPoints(p1, p2){
    let k = (p2.y - p1.y) / (p2.x - p1.x);
    let d = p1.y - (p1.x * k);
    return (x) => {
        return k * x + d;
    }
}

function setStartPoint(e){
    startPoint.x = e.clientX;
    startPoint.y = e.clientY;
    let pEle = document.getElementById("displayStart");
    pEle.innerHTML = "Starting from point: " + startPoint.x + "|" + startPoint.y;
}

function setdisplayShapePoints(){
    let element = document.getElementById("displayShapePoints");
    element.innerHTML = "";
    shapePoints.forEach(point => {
        let p = document.createElement("p");
        p.innerHTML = strPoint(point);
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.onclick = () => {
            editBtn.style.backgroundColor = "coral";
            let i = shapePoints.indexOf(point);
            let myListener = (function(i){
                let handler = function (e){
                    setPoint(shapePoints[i], e);
                    canvas.removeEventListener("click", myListener);
                    main();                
                }
                return handler;
            })(i);
            canvas.addEventListener("click", myListener);
        }
        element.appendChild(p);
        element.appendChild(editBtn);
    });
}
function strPoint(p){
    return p.x + "|" + p.y
}
function setPoint(point,e){
    point.x = e.clientX;
    point.y = e.clientY;
}

function addShapePoint(){
    shapePoints.push({x:0,y:0});
    main();
}
function removeShapePoint(){
    shapePoints.length = shapePoints.length-1;
    main();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}