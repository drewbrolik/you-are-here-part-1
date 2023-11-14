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
  //seed = 30573;
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
  
  // colorway
  var colorway = floor(random(1,8)); // 1 - 7
  if (colorway == 1) { // white
    backgroundColor = "rgba(248,248,248,1)";
    strokeColor = 0;
    hereColor = random(300,380);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 2) { // blue
    //backgroundColor = "HSB(230,50%,100%)";
    backgroundColor = "HSB(220,55%,84%)";
    strokeColor = 255;
    //hereColor = random(300,380);
    hereColor = random(0,43);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 3) { // orange
    //backgroundColor = "HSB(32,50%,100%)";
    backgroundColor = "HSB(32,62%,100%)";
    strokeColor = 255;
    hereColor = random(180,280);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 4) { // green
    backgroundColor = "HSB(140,30%,85%)";
    strokeColor = 255;
    hereColor = random(0,54);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 5) { // white with blue/purple
    backgroundColor = "rgba(248,248,248,1)";
    strokeColor = 0;
    hereColor = random(180,280);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 6) { // black
    backgroundColor = "HSB(0,0%,13%)";
    strokeColor = 255;
    hereColor = random(155,245);
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 7) { // yellow
    backgroundColor = "HSB(50,46%,100%)";
    strokeColor = 0;
    hereColor = random(194,342);
    if (hereColor > 360) { hereColor -= 360; }
  }
  console.log("backgroundColor - "+backgroundColor);
  console.log("strokeColor - "+strokeColor);
  console.log("hereColor target hue - "+hereColor);
  
  // here cell
  here = Math.floor(random(1,grid*grid+1));
  
  // signature
  if (random(0,1) > .7) { signed = true; }
  console.log("signed - "+signed);
  
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
  
  this.focus(); // focus so key listener works right away
  
  var hereColorBlockRandom = random(0,1);
  if (hereColorBlockRandom > .5) { hereColorBlock(hereColor); }
  
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
      
      if (gridArray[gridLoop] > .9) { // CIRCLE
        
        ellipse((width/(grid+1)*gridLoopX)+offsetX,(height/(grid+1)*gridLoopY)+offsetY,width/(grid+1)*.6,width/(grid+1)*.6);
        
      } else if (gridArray[gridLoop] > .25) { // LINE
      
        var
          centerCellX = (width/(grid+1)*gridLoopX)+offsetX,
          centerCellY = (height/(grid+1)*gridLoopY)+offsetY,
          cellSize = width/(grid+1);
  
        //var dir = random(0,2);
        if (hereCell) {
          if (gridArray[gridLoop] > .625) {
            line(centerCellX,centerCellY,centerCellX+(cellSize/2),centerCellY+(cellSize/2));
          } else {
            line(centerCellX,centerCellY,centerCellX-(cellSize/2),centerCellY+(cellSize/2));
          }
        } else {
          if (gridArray[gridLoop] > .625) {
            line(centerCellX-(cellSize/2),centerCellY-(cellSize/2),centerCellX+(cellSize/2),centerCellY+(cellSize/2));
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
    if (random(0,1) > .96) {
      for(var i=0;i<2000;i++) {
        noStroke();
        thisColor.setAlpha(noise(i)-.25);
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
  } else { // inverted <= .1
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
    var hcbs = random(0,width*.5);
    var hcbw = random(width*.25,width*.5);
    for (var hcbi = hcbs; hcbi<hcbw; hcbi++) {
      if (random(0,1) >.5) {
        //line(hcbi,0,hcbi,height);
        rect(hcbi,0,1,height);
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
  
  }
  
}

// signature
function signWork() {

  var whichSig = random(0,1);
  if (whichSig > .5) {
    
    // truedrew signature
    var signature = createGraphics(156,68);

    signature.scale(.45);
    signature.noFill();

    signature.stroke("hsb(50,96%,71%)");//("rgba(127,127,127,1)");
    signature.strokeWeight(1.8);
    signature.strokeCap(ROUND);
    signature.beginShape();
    signature.vertex(1.753,30.22);
    signature.bezierVertex(0.7609999999999999,29.557,3.891,29.159,4.973,28.657);
    signature.bezierVertex(10.327,26.174,15.646,23.613,20.977,21.081);
    signature.bezierVertex(35.73,14.075,50.841,7.601,66.192,2);
    signature.endShape();
    
    signature.strokeCap(ROUND);
    signature.beginShape();
    signature.vertex(34.329,14.074);
    signature.bezierVertex(34.329,-2.426,33.266,47.074,31.772000000000002,63.504);
    signature.vertex(36.033,34.528);
    signature.bezierVertex(36.008,34.525,38.453,60.053,36.033,64.168);
    signature.bezierVertex(30.630000000000003,73.35300000000001,39.636,40.89900000000001,48.249,34.62200000000001);
    signature.bezierVertex(53.397000000000006,30.870000000000008,50.335,39.123000000000005,48.817,40.967000000000006);
    signature.bezierVertex(46.592,43.668000000000006,43.217,58.751000000000005,49.29,53.89300000000001);
    signature.bezierVertex(52.918,50.99000000000001,54.178,45.78200000000001,55.161,41.48800000000001);
    signature.bezierVertex(57.086,33.09100000000001,56.071,42.151,59.185,41.401);
    signature.bezierVertex(60.392,40.254000000000005,67.548,42.254000000000005,68.087,43.622);
    signature.bezierVertex(68.685,47.52,60.787000000000006,48.546,59.47,44.992);
    signature.bezierVertex(57.708,48.349999999999994,59.321999999999996,50.199999999999996,59.089999999999996,46.089);
    signature.bezierVertex(58.95399999999999,54.554,55.080999999999996,52.434,53.31399999999999,43.311);
    signature.bezierVertex(50.998999999999995,36.362,60.36899999999999,36.256,62.120999999999995,43);
    signature.bezierVertex(67.253,49.2,65.698,52.138,65.246,NaN);
    signature.bezierVertex(159.611,NaN,NaN,NaN,68.31299999999999,NaN);
    signature.bezierVertex(82.88099999999999,NaN,86.21099999999998,NaN,79.97999999999999,NaN);
    signature.bezierVertex(102.957,NaN,114.54399999999998,NaN,NaN,NaN);
    signature.endShape();
    
    signature.strokeCap(ROUND);
    signature.beginShape();
    signature.vertex(82.907,25.153);
    signature.bezierVertex(78.11,22.34,72.71,20.18,79.64,16.11);
    signature.bezierVertex(89.952,10.053999999999998,105.218,7.199999999999999,115.86099999999999,13.979);
    signature.bezierVertex(139.862,29.264,98.74399999999999,61.619,83.19099999999999,64.83);
    signature.bezierVertex(77.41899999999998,66.02199999999999,90.57699999999998,49.16,91.19299999999998,48.306);
    signature.bezierVertex(92.64899999999999,46.288999999999994,107.64599999999999,22.086,111.31599999999999,26.951999999999998);
    signature.bezierVertex(115.99399999999999,33.156,111.29399999999998,47.786,109.84799999999998,54.462);
    signature.bezierVertex(108.05499999999998,62.738,112.82499999999999,51.565000000000005,114.96099999999998,49.063);
    signature.bezierVertex(117.54699999999998,46.036,124.05399999999999,42.809000000000005,125.33099999999999,38.978);
    signature.bezierVertex(126.48799999999999,35.507000000000005,120.17999999999999,44.773,119.69599999999998,48.401);
    signature.bezierVertex(119.27299999999998,51.577000000000005,120.86099999999999,55.291000000000004,124.00499999999998,51.668000000000006);
    signature.bezierVertex(124.85599999999998,50.68800000000001,129.38899999999998,42.507000000000005,129.78099999999998,44.566);
    signature.bezierVertex(130.676,49.262,133.96399999999997,60.902,137.40399999999997,50.294000000000004);
    signature.bezierVertex(138.55599999999995,46.74400000000001,137.80799999999996,45.961000000000006,141.42899999999997,45.418000000000006);
    signature.bezierVertex(145.79099999999997,44.763000000000005,150.20099999999996,43.910000000000004,154.49699999999999,43.050000000000004);
    signature.endShape();

    image(signature, width-(156*.5), height-(68*.6));
    
  } else {
    
    // drew thomas signature
    var signature = createGraphics(111,72);
    
    signature.scale(.5);
    signature.noFill();
    
    signature.stroke("hsb(50,96%,71%)");//("rgba(127,127,127,1)");
    signature.strokeWeight(2)
    signature.strokeCap(ROUND);
    signature.beginShape();
    signature.vertex(2.005,62.7);
    signature.bezierVertex(2.145,52.651,3.8869999999999996,42.260000000000005,6.227,32.533);
    signature.bezierVertex(8.451,23.293,11.102,13.187000000000001,16.505000000000003,5.200000000000003);
    signature.bezierVertex(21.070000000000004,-1.5479999999999974,22.321,3.7100000000000026,22.783,9.811000000000003);
    signature.bezierVertex(23.978,25.584000000000003,23.463,42.387,21.227,58.033);
    signature.bezierVertex(20.953,59.953,18.017,71.85300000000001,18.172,69.7);
    signature.bezierVertex(18.344,67.283,25.375,42.256,30.005000000000003,50.589);
    signature.bezierVertex(30.741000000000003,51.914,35.038000000000004,63.719,37.06,56.978);
    signature.bezierVertex(38.765,51.297000000000004,40.092,51.902,43.45,54.7);
    signature.bezierVertex(44.955000000000005,55.955000000000005,56.973,52.412000000000006,58.45,51.978);
    signature.bezierVertex(75.28200000000001,47.028,91.44,44.145,109.005,44.145);
    signature.endShape();
    
    image(signature, width-(111*.6), height-(72*.6));

  }

}