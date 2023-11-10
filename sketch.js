var
  grid = 3,
  currentLayer = 1,
  totalLayers = 10,
  chaosFactor = 0,
  strokeWidth = 4,
  backgroundColor = 90,
  backgroundColorLighter,
  hereColor = 300,
  signed = false,
  strokeColor;

// array of random values for each grid cell
var gridArray = [];

// set grid cell for "here" color
var whereAreYou = true;
var here;

var jsonInstructions = {}
jsonInstructions.layers = []

function setup() {
  createCanvas(1000,1000);
  pixelDensity(2);
  colorMode(HSB, 360, 100, 100);
  
  // seed
  
  var date = new Date();
  var seed = round(date.getTime());
  seed = floor(random(100000));
  //seed = 1699650982011;
  randomSeed(seed);
  noiseSeed(seed);
  console.log("seed - "+seed);
  
  // set traits
  
  // number of grid cells
  grid = Math.floor(random(3,11));
  console.log("grid - "+grid);
  
  // layers
  totalLayers = Math.floor(random(1,21));
  console.log("totalLayers - "+totalLayers);
  
  // chaos number
  chaosFactor = Math.floor(random(-6,6));
  console.log("chaosFactor - "+chaosFactor);
  
  //styling
  strokeWidth = random(4,7.5);
  console.log("strokeWidth - "+strokeWidth);
  
  backgroundColor = "rgba(248,248,248,1)";
  var blueBackground = random(0,1);
  var orangeBackground = random(0,1);
  var greenBackground = random(0,1);
  if (blueBackground > .9) { backgroundColor = "HSB(230,50%,100%)"; }
  else if (orangeBackground > .9) { backgroundColor = "HSB(32,50%,100%)"; }
  else if (greenBackground > .9) { backgroundColor = "HSB(151,50%,100%)"; }
  
  backgroundColorLighter = "rgba(248,248,248,1)";
  if (blueBackground > .9) { backgroundColorLighter = "HSB(230,50%,100%)"; }
  else if (orangeBackground > .9) { backgroundColorLighter = "HSB(32,50%,100%)"; }
  else if (greenBackground > .9) { backgroundColorLighter = "HSB(151,50%,100%)"; }
  console.log("backgroundColor - "+backgroundColor);
  
  strokeColor = 0;
  if (blueBackground > .9) { strokeColor = 255; }
  else if (orangeBackground > .9) { strokeColor = 255; }
  else if (greenBackground > .9) { strokeColor = 255; }
  console.log("strokeColor - "+strokeColor);
  
  // signature
  if (random(0,1) > .9) { signed = true; }
  console.log("signed - "+signed);
  
  // "here" color and grid cell
  hereColor = random(300,380);
  if (hereColor > 360) { hereColor -= 360; }
  console.log("hereColor target hue - "+hereColor);
  
  here = Math.round(random(1,grid*grid+1));
  
  // set up grid
  for (var i = 0; i < grid*grid; i++) {
    gridArray[i] = random(0,1);
  }
  
  // create shape
  shapePoint1x = random(0,1),shapePoint1y = random(0,1),
  shapePoint2x = random(0,1),shapePoint2y = random(0,1),
  shapePoint3x = random(0,1),shapePoint3y = random(0,1),
  shapePoint4x = random(0,1),shapePoint4y = random(0,1),
  shapePoint5x = random(0,1),shapePoint5y = random(0,1);
  
  jsonInstructions.shape = [
    {"x":0,"y":0},
    {"x":shapePoint1x,"y":shapePoint1y},
    {"x":shapePoint2x,"y":shapePoint2y},
    {"x":shapePoint3x,"y":shapePoint3y},
    {"x":shapePoint4x,"y":shapePoint4y},
    {"x":shapePoint5x,"y":shapePoint5y},
    {"x":1,"y":1}
  ]
  
  // background
  background(backgroundColor);
  var bgCenter = createGraphics(1000,1000);
  bgCenter.fill(backgroundColorLighter);
  bgCenter.noStroke();
  bgCenter.ellipse(width*.5,height*.5,width-120,height-120);
  bgCenter.filter(BLUR, 100);
  bgCenter.filter(BLUR, 100);
  image(bgCenter, 0, 0);
  
  this.focus(); // focus so key listener works right away
  

}
function draw() {
  
  // loop or stop
  if (currentLayer > totalLayers) {
  
    // final
    var hereColorBlockRandom = random(0,1);
    if (hereColorBlockRandom > .5) { hereColorBlock(hereColor); }
    if (signed) { signWork(); }
    noLoop();
    //preview();
  
  } else {

    drawLayer();
    currentLayer += 1;
    
  }
}

function keyTyped() {

  // show original (revert)
  if (key === 'r') {
    drawLayer();
  }

  if (key === 't') {
    for(var i = 0; i < 10; i++) {
      drawLayer();
    }
  }
  
  if (key === 'j') {
    console.log('here cell - '+here);
    console.log(gridArray);
  }
  
  if (key === 'i') {
    saveJSON(jsonInstructions, 'instructions.json');
  }
  
  if (key === 's') {
    save('you-are-here.png');
  }
  
}

function drawLayer() {
  
  var layerInstructions = {}
  layerInstructions.layer = currentLayer;
  layerInstructions.rows = [];
  
  // univeral offset for this layer
  var
    offsetX = chaosFactor*random(1,2),
    offsetY = chaosFactor*random(1,2);
  
  // color for this layer
  var thisColor = color(0,0,strokeColor);
  var thisAlpha = random(.45,.9);
  thisColor.setAlpha(thisAlpha);
  stroke(thisColor);
  strokeCap(ROUND);
  strokeWeight(strokeWidth);
  noFill();  
  
  var gridLoopX = 1;
  var gridLoopY = 0;
  for (var gridLoop = 0; gridLoop < (grid*grid); gridLoop++) {

    if (gridLoop%grid < 1) {
      gridLoopY++;
      gridLoopX = 1;
    } else {
      gridLoopX++;
    }
    
    // instructions
    var rowInstructions = {}
    rowInstructions.row = gridLoopY;
    rowInstructions.column = gridLoopX;

    // you are here color
    var forcePrint = false;
    var hereCell = false;
    if (gridLoop+1 === here && currentLayer == totalLayers && whereAreYou) {
      var posNeg = random(-1,1);
      hereColor += (chaosFactor*posNeg); // this changes value from trait, based on chaos factor...

      // trait
      console.log("hereColor actual hue - "+hereColor);
      console.log("hereColor deviation - "+((chaosFactor*posNeg)/(360)*100));

      var hereColorColor = color(hereColor,100,100);
      hereColorColor.setAlpha(1);
      stroke(hereColorColor);
      strokeCap(SQUARE);
      strokeWeight(strokeWidth*2);
      whereAreYou = false;
      forcePrint = true;
      hereCell = true;
    }
    
    var printThisLayer = random(0,1);
    if (forcePrint || currentLayer < 2 || printThisLayer > .9) { // print or skip
      
      //console.log(currentLayer + " - "+gridLoop+" = "+gridArray[gridLoop]+" - x:"+gridLoopX+" - y:"+gridLoopY);
      if (gridArray[gridLoop] > .9) { // CIRCLE
        
        ellipse((width/(grid+1)*gridLoopX)+offsetX,(height/(grid+1)*gridLoopY)+offsetY,width/(grid+1)*.6,width/(grid+1)*.6);
        
      } else if (gridArray[gridLoop] > .25) { // LINE
      
        var
          centerCellX = (width/(grid+1)*gridLoopX)+offsetX,
          centerCellY = (height/(grid+1)*gridLoopY)+offsetY,
          cellSize = width/(grid+1);
  
        //var dir = random(0,2);
        if (hereCell) {
          //if (dir < 1) {
          if (gridArray[gridLoop] > .625) {
          //if (dir < .25) {
            line(centerCellX,centerCellY,centerCellX+(cellSize/2),centerCellY+(cellSize/2));
          } else {
            line(centerCellX,centerCellY,centerCellX-(cellSize/2),centerCellY+(cellSize/2));
          }
          /*fill(hereColorColor);
          noStroke();
          ellipse(centerCellX+10,centerCellY-10,20,20);*/
        } else {
          //if (dir < .5) {
          if (gridArray[gridLoop] > .625) {
          //if (dir < .25) {
            line(centerCellX-(cellSize/2),centerCellY-(cellSize/2),centerCellX+(cellSize/2),centerCellY+(cellSize/2));
            //line(centerCellX-(cellSize/2),centerCellY,centerCellX+(cellSize/2),centerCellY);
          } else {
            line(centerCellX+(cellSize/2),centerCellY-(cellSize/2),centerCellX-(cellSize/2),centerCellY+(cellSize/2));
          }
        }
        
      } else { // SHAPE

        var
          centerCellX = (width/(grid+1)*gridLoopX)+offsetX,
          centerCellY = (height/(grid+1)*gridLoopY)+offsetY,
          cellSize = width/(grid+1);
  
        var
          cellStartX = centerCellX-(cellSize*.5),
          cellEndX = centerCellX+(cellSize*.5),
          cellStartY = centerCellY-(cellSize*.5),
          cellEndY = centerCellY+(cellSize*.5);
                
        drawShape(cellStartX,cellEndX,cellStartY,cellEndY,hereCell,thisColor,hereColorColor);

      }
      strokeWeight(strokeWidth);
      
    }
    strokeCap(ROUND);
    
    // splatter
    /*if (random(0,1) > .96) {
      var offsetWidth = random(-width,width);
      var offsetHeight = random(-height,height);      
      for(var i=0;i<1000;i++) {
        noStroke();
        thisColor.setAlpha(random(.25,.75));
        fill(thisColor);
        if (hereCell) { fill(color(hereColor,100,100)); }
        ellipse(random(0,width+offsetWidth),random(0,height+offsetHeight),1,1);
        //ellipse(random(offsetWidth,width+offsetWidth),random(offsetHeight,height+offsetHeight),1,1)
      }
    }*/
    if (random(0,1) > .96) {
      for(var i=0;i<2000;i++) {
        noStroke();
        thisColor.setAlpha(noise(i)-.5);
        fill(thisColor);
        ellipse(random(0,width),random(0,height),1,1);
      }
    }
    // reset fill and stroke
    stroke(thisColor);
    thisColor.setAlpha(thisAlpha);
    noFill();
    
    layerInstructions.rows.push(rowInstructions);
    
  }
  
  
  // instructions
  jsonInstructions.layers.push(layerInstructions);
  
  
  
}

// drawShape function - draw a random shape with 5 lines
var
  shapePoint1x,
  shapePoint2x,
  shapePoint3x,
  shapePoint4x,
  shapePoint5x;
function drawShape(startX,endX,startY,endY,hereCell=false,thisColor,hereColor) {

  var
    shapePoint1xx = startX+shapePoint1x*(endX-startX),
    shapePoint1yy = startY+shapePoint1y*(endY-startY),
    shapePoint2xx = startX+shapePoint2x*(endX-startX),
    shapePoint2yy = startY+shapePoint2y*(endY-startY),
    shapePoint3xx = startX+shapePoint3x*(endX-startX),
    shapePoint3yy = startY+shapePoint3y*(endY-startY),
    shapePoint4xx = startX+shapePoint4x*(endX-startX),
    shapePoint4yy = startY+shapePoint4y*(endY-startY),
    shapePoint5xx = startX+shapePoint5x*(endX-startX),
    shapePoint5yy = startY+shapePoint5y*(endY-startY);
  
  var
    shapePoint1xx_inverted = startX+shapePoint1y*(endX-startX),
    shapePoint1yy_inverted = startY+shapePoint1x*(endY-startY),
    shapePoint2xx_inverted = startX+shapePoint2y*(endX-startX),
    shapePoint2yy_inverted = startY+shapePoint2x*(endY-startY),
    shapePoint3xx_inverted = startX+shapePoint3y*(endX-startX),
    shapePoint3yy_inverted = startY+shapePoint3x*(endY-startY),
    shapePoint4xx_inverted = startX+shapePoint4y*(endX-startX),
    shapePoint4yy_inverted = startY+shapePoint4x*(endY-startY),
    shapePoint5xx_inverted = startX+shapePoint5y*(endX-startX),
    shapePoint5yy_inverted = startY+shapePoint5x*(endY-startY);

  if (hereCell) { var colorLine = Math.floor(random(1,7)); }
  var inverted = random(0,1);
  if (inverted > .1) {
    if (hereCell && colorLine === 1) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(startX,startY,shapePoint1xx,shapePoint1yy);
    if (hereCell && colorLine === 2) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint1xx,shapePoint1yy,shapePoint2xx,shapePoint2yy);
    if (hereCell && colorLine === 3) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint2xx,shapePoint2yy,shapePoint3xx,shapePoint3yy);
    if (hereCell && colorLine === 4) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint3xx,shapePoint3yy,shapePoint4xx,shapePoint4yy);
    if (hereCell && colorLine === 5) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint4xx,shapePoint4yy,shapePoint5xx,shapePoint5yy);
    if (hereCell && colorLine === 6) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint5xx,shapePoint5yy,endX,endY);
  }/* else {
    thisColor1 = "blue";
    if (hereCell && colorLine === 1) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor1);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(startY,startX,shapePoint1yy,shapePoint1xx);
    if (hereCell && colorLine === 2) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor1);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint1yy,shapePoint1xx,shapePoint2yy,shapePoint2xx);
    if (hereCell && colorLine === 3) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor1);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint2yy,shapePoint2xx,shapePoint3yy,shapePoint3xx);
    if (hereCell && colorLine === 4) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint3yy,shapePoint3xx,shapePoint4yy,shapePoint4xx);
    if (hereCell && colorLine === 5) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint4yy,shapePoint4xx,shapePoint5yy,shapePoint5xx);
    if (hereCell && colorLine === 6) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint5yy,shapePoint5xx,endY,endX);
  }*/
  else {
    if (hereCell && colorLine === 1) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(startX,startY,shapePoint1xx_inverted,shapePoint1yy_inverted);
    if (hereCell && colorLine === 2) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint1xx_inverted,shapePoint1yy_inverted,shapePoint2xx_inverted,shapePoint2yy_inverted);
    if (hereCell && colorLine === 3) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint2xx_inverted,shapePoint2yy_inverted,shapePoint3xx_inverted,shapePoint3yy_inverted);
    if (hereCell && colorLine === 4) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint3xx_inverted,shapePoint3yy_inverted,shapePoint4xx_inverted,shapePoint4yy_inverted);
    if (hereCell && colorLine === 5) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint4xx_inverted,shapePoint4yy_inverted,shapePoint5xx_inverted,shapePoint5yy_inverted);
    if (hereCell && colorLine === 6) { stroke(hereColor);strokeWeight(strokeWidth*2);strokeCap(SQUARE); } else { stroke(thisColor);strokeWeight(strokeWidth);strokeCap(ROUND); }
    line(shapePoint5xx_inverted,shapePoint5yy_inverted,endX,endY);
  }
  
}

// here color block
function hereColorBlock(hereColor) {
  noStroke();
  var hereColor = color(hereColor,100,100);
  hereColor.setAlpha(.0625);
  fill(hereColor);
  
  var hereColorBlockType = random(0,1);
  if (hereColorBlockType > .8) { // right side full height
    
    rect(0,0,random(10,width*.5),height);
  
  } else if (hereColorBlockType > .5) { // lines
    
    //rect(random(0,width),0,random(width*.25,width*.5),height);
    for (var hcbi = 0; hcbi<random(width*.25,width*.5); hcbi++) {
      if (random(0,1) >.5) {
        line(hcbi,0,hcbi,height);
      }
    }
  
  } else if (hereColorBlockType > .25) { // circle
    
    var ellipseSize = random(120,420);
    ellipse(width*.5,height*.5,width-ellipseSize,height-ellipseSize);
  
  } else { // grid of circles
    
    var gridLoopX = 1;
    var gridLoopY = 0;
    for (var gridLoop = 0; gridLoop < (grid*grid); gridLoop++) {

      if (gridLoop%grid < 1) {
        gridLoopY++;
        gridLoopX = 1;
      } else {
        gridLoopX++;
      }
      
      var
          centerCellX = (width/(grid+1)*gridLoopX),
          centerCellY = (height/(grid+1)*gridLoopY),
          cellSize = width/(grid+1);
      
      ellipse(centerCellX,centerCellY,40,40);
    }
    //var ellipseSize = random(120,420);
    //ellipse(width*.5,height*.5,width-ellipseSize,height-ellipseSize);
  
  }
  
}

// signature
function signWork() {
  line(width-150,height-40,width-50,height-40);
}