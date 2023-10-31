//p5 code for the app for Connection homework where a photo puzzle can be assembled by users. 
//after much headache discovered there's a slide puzzle on the coding train: https://www.youtube.com/watch?v=uQZLzhrzEs4 
//I coded along with Shiffman as he was trying to figure out how to code it.
//creating an array for the pieces

//image is the source for the puzzle
let source;
// Tiles configuration
let tiles = [];
let cols = 4;
let rows = 4;
let w, h;
// Order of tiles
let board = [];

// Loading the image
function preload() {
  source = loadImage('puzzle1.JPG');
}
//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  w = width / cols;
h = height / rows; 
  //the challenge is splittling up tiles so that each piece knows its spot. 
board = []; //initialized board array 
for (let i=0; i<cols; i++){
  for (let j=0; i<rows; j++){
    let x = i*w;
    let y = j*h; 
    let img = createImage(w,h);
    //since you need to know where each piece is supposed to be -- a specific syntax
    img.copy(source, x, y, w, h, 0, 0, w, h);
    let index = i + j * cols; 
    board.push(index);
    let tile = new Tile(index, img);
    tiles.push(tile);

  //Listen for messages named 'data' from the server
  socket.on('data'), function(obj) {
    console.log(obj);
    mousePos(obj);
  };
}

tiles.pop();
  board.pop();
  //empty spot ==-2 (original code is -1 but since we have multipe people)
  board.push(-2);
  
  simpleShuffle(board);
}
  
  function swap(i, j, arr){ //swapping 2 elements 
    let temp=arr[i];
    arr[i]=arr[j];
    arr[j]=temp;
  }
//   old code: 
//function simpleShuffle(arr){
//     for (let i=0; i<100; i++){
//       let r1 = floor(random(0,arr.length));
//       let r2 = floor(random(0,arr.length));
// swap(r1, r2 ,arr);
function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  move(r1, r2, arr);
    }
  function simpleShuffle(arr) {
  for (let i = 0; i < 20; i++) {
    randomMove(arr);
  }
}

// Mouse-activated clicks
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i,j,board);
  //grab mouse position
  let mousePos ={x:mouseX, y:mouseY };
  socket.emit('data, mousePos');
}

function draw(){
  background(0);
for (let i=0; i<cols; i++){
  for (let j=o; i<cols; j++){  
    let index = i + j * cols;
    let boardIndex = j+i*rows;
let x = i*w; 
  let y = j*h; 
    let tileIndex=board[index];
    if (tileIndex >-1) {
  let img = tiles[tileIndex].img;
    image(img, x, y,w,h);
    for (let a=0; a<board.length-1; a++){

    }
    }
    }
  }
}
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
  strokeWeight(2);
  stroke(200,25)
      rect(x, y, w, h);

    }
}
  
  function isSolved() {
  for (let i = 0; i < board.length-1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true;
}

// Swap two pieces
function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);
  
  // Double check valid move
  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}
// Check if neighbor
function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}


// Probably could just use a variable
// to track blank spot
function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i;
  } 
}
