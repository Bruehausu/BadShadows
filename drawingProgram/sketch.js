// All the paths
var paths = [];
// Are we painting?
var painting = false;
var saved = false;
var getNew = false;

// How long until the next circle
var next = 0;
// Where are we now and where were we?
var current;
var previous;

var popup = "draw a line";
var table;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable("assets/paths.csv", "csv", "header"); 
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNewPath(last){
  //console.log(last);


  var lastXDiff = last[last.length - 1].x - last[0].x;
  var lastYDiff = last[last.length - 1].y - last[0].y;
  var prev = last[0];
  var len = 0;

  for(var i = 0; i < last.length; i += 1){
     len = len + sqrt(pow(last[i].x - prev.x,2) + pow(last[i].y - prev.y,2));
     prev = last[i];
  }

  console.log(table.getRowCount());
  var best = getRandomInt(0, table.getRowCount());

  var file = table.getString(best,1);
  console.log(best);
  var fileRanLo = best;
  var fileRanHi = best;
  while(fileRanHi < table.getColumnCount() - 1 && 
        table.getString(fileRanHi + 1, 1) === file){ 
    fileRanHi += 1;
    //console.log("new high: "  + fileRanHi);

  }
  while(fileRanLo >= 0 && table.getString(fileRanLo - 1, 1) === file){ 
    fileRanLo -= 1;
    //console.log("new low: "  + fileRanLo);
  }
  var add = getRandomInt(fileRanLo, fileRanHi + 1);
  var add2 = getRandomInt(fileRanLo, fileRanHi + 1);
  var bestArr = table.getString(best,5).split(" ");
  var stringArr = table.getString(add, 5).split(" ");
  var stringArr1 = table.getString(add, 5).split(" ");
  //console.log(stringArr);
  var newPathPoints = [];
  var newPathPoints1 = [];

  var scaleX = lastXDiff / table.getNum(best, 3);
  var scaleY = lastXDiff / table.getNum(best, 4);

  var bestStartX = parseFloat(bestArr[0]) * scaleX;
  var bestStartY = parseFloat(bestArr[1]) * scaleY;

  //var offSetX =  floor(last[0].x - bestStartX);
  //var offSetY =  floor(last[0].y - bestStartY);
  var offSetX = floor(last[last.length - 1].x - parseFloat(stringArr[0]));
  var offSetY = floor(last[last.length - 1].y - parseFloat(stringArr[1]));

  console.log('last path start: ' + last[0].x + ", " + last[0].y);
  //console.log('last path end: ' + last[].x + ", " + last[0].y);
  console.log('best match start: ' + parseFloat(bestArr[0]) + ", " + parseFloat(bestArr[1]));
  console.log('best match start scaled: ' + bestStartX + ", " + bestStartY);
  console.log('image scale: ' + scaleX, ", " + scaleY);
  console.log('scaled offset: ' + offSetX + ", " + offSetY);



  for(var i = 0; i < stringArr.length; i++){
    if(i % 2 == 0) {
      //newPathPoints.push(floor(parseFloat(stringArr[i]) * scaleX) + offSetX);
      newPathPoints.push(floor(parseFloat(stringArr[i])) + offSetX);
    } else {
      //newPathPoints.push(floor(parseFloat(stringArr[i]) * scaleY) + offSetY);
      newPathPoints.push(floor(parseFloat(stringArr[i])) + offSetY);
    }
  }

  for(var i = 0; i < stringArr.length; i++){
    if(i % 2 == 0) {
      //newPathPoints.push(floor(parseFloat(stringArr[i]) * scaleX) + offSetX);
      newPathPoints1.push(floor(parseFloat(stringArr1[i])) + offSetX);
    } else {
      //newPathPoints.push(floor(parseFloat(stringArr[i]) * scaleY) + offSetY);
      newPathPoints1.push(floor(parseFloat(stringArr1[i])) + offSetY);
    }
  }

  console.log(stringArr);
  console.log(newPathPoints);

  popup = "I see you were drawing a " + file.split('/')[0];

  var newPath = new Path();
  newPath.fromArray(newPathPoints);

  var newPath1 = new Path();
  newPath1.fromArray(newPathPoints1);

  console.log([newPath, newPath1]);

  return [newPath, newPath1];

  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  current = createVector(0,0);
  previous = createVector(0,0);

  /*console.log(table.getString(0,0));
  console.log(table.getString(1,0));
  console.log(table.getString(2,0));
  console.log(table.getString(3,0));
  console.log(table.getString(4,0));
  console.log(table.getString(5,0));
  console.log(table.getString(0,1));
  console.log(table.getString(1,1));
  console.log(table.getString(2,1));
  console.log(table.getString(3,1));
  console.log(table.getString(4,1));
  console.log(table.getString(5,1));*/
};

function draw() {
  background(240);
  
  if (getNew){
    popup = "let me think..."
  } 

  text(popup, 20, 20);

  if (saved && getNew){
    var newPaths = getNewPath(paths[paths.length - 1].particles);
    paths = paths.concat(newPaths);
    getNew = false;
  }

  print(painting + " " + saved);
  // If it's time for a new point
  if (millis() > next && painting && !(saved)) {

    // Grab mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement

    // Add new particle
    paths[paths.length - 1].add(current);
    
    // Schedule next circle
    next = millis() + 15;

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( var i = 0; i < paths.length; i++) {
    //paths[i].update();
    paths[i].display();
  }
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  if(!saved){
    paths.splice(paths.length - 1, 1);
  } else {
    saved = false;
  }

  paths.push(new Path());
  
}

// Stop
function mouseReleased() {
  painting = false;
}

function keyPressed(){
  if (keyCode === ENTER) {
    saved = true;
    getNew = true;
  } else if (keyPressed === SHIFT){
    paths = [];
  }
}

function windowResized(){
   resizeCanvas(windowWidth, windowHeight);
}

// A Path is a list of particles
function Path() {
  this.particles = [];
  this.hue = 50;
}



Path.prototype.add = function(position) {
  // Add a new particle with a position, force, and hue
  this.particles.push(createVector(position.x, position.y));
}

Path.prototype.fromArray = function (arr) {
  for(var i = 0; i < arr.length; i+= 2){
    this.particles.push(createVector(arr[i], arr[i + 1]))
  }
}

// Display plath
/*Path.prototype.update = function() {  
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}*/  

// Display plath
Path.prototype.display = function() {
  
  // Loop through backwards
  for (var i = this.particles.length - 1; i > 0; i--) {
    line(this.particles[i].x, this.particles[i].y,
         this.particles[i-1].x, this.particles[i-1].y)
  }
}  

// Particles along the path