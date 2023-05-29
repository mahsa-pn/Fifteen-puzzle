var windowWidth = screen.width;
var boardWidth = 500;

var cols,
  rows,
  gap,
  boardSize,
  tileHeight,
  tileWidth,
  coordinates,
  board,
  emptyIndex,
  tiles,
  boardHeight;

/////////create board/////////////
function initBoardSize() {
  if (boardWidth > windowWidth) {
    boardWidth = windowWidth;
    boardHeight = boardWidth;
    tileWidth = (boardWidth - gap * (cols + 1)) / cols;
    tileHeight = (boardHeight - gap * (rows + 1)) / rows;
    changeTilesStyle(tileWidth);
  }
  boardHeight = boardWidth;
  document.getElementById("puzzle-box").style.width = boardWidth + "px";
  document.getElementById("puzzle-box").style.height = boardHeight + "px";
}

initBoardSize();

/////////create tiles/////////////

function initialize() {
  cols = parseInt(document.getElementById("board-size").value);
  rows = parseInt(document.getElementById("board-size").value);
  gap = 5;
  boardSize = cols * rows;
  tileWidth = (boardWidth - gap * (cols + 1)) / cols;
  tileHeight = (boardHeight - gap * (rows + 1)) / rows;
  coordinates = [];

  board = document.getElementById("puzzle-box");
  board.innerHTML = null;

  for (var j = 0; j < boardSize; j++) {
    coordinates.push({
      x: (j % cols) + 1,
      y: Math.floor(j / rows) + 1,
    });
  }

  shuffle();

  emptyIndex = coordinates.length - 1;

  for (var k = 0; k < coordinates.length - 1; k++) {
    createTile(coordinates[k], k);
  }

  tiles = document.getElementsByClassName("tile-item");

  tilesEventHandler();
  isSolvable();
}

initialize();
///////////////////////////////////////

function shuffle() {
  var array = coordinates;
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function createTile(i, index) {
  var tileNode = document.createElement("div");
  tileNode.style.height = tileHeight + "px";
  tileNode.style.width = tileWidth + "px";
  tileNode.classList.add("tile-item");
  tileNode.innerHTML = index + 1;
  board.append(tileNode);
  var tileX = i.x - 1;
  var tileY = i.y - 1;
  tilePosition(tileNode, tileX, tileY);
}

function tilePosition(tileNode, tileX, tileY) {
  var x = tileX * (tileWidth + gap) + gap;
  var y = tileY * (tileHeight + gap) + gap;
  tileNode.style.left = x + "px";
  tileNode.style.top = y + "px";
  tileNode.style.fontSize = tileHeight * 0.4 + "px";
}

var tileClick = function (e) {
  var index = event.currentTarget.innerHTML;
  var cors = coordinates[index - 1];
  var node = event.currentTarget;
  var emptyNode = coordinates[emptyIndex];
  if (
    (emptyNode.x == cors.x &&
      (emptyNode.y == cors.y - 1 || emptyNode.y == cors.y + 1)) ||
    (emptyNode.y == cors.y &&
      (emptyNode.x == cors.x - 1 || emptyNode.x == cors.x + 1))
  ) {
    tilePosition(node, emptyNode.x - 1, emptyNode.y - 1);
    var temp = coordinates[emptyIndex];
    coordinates[emptyIndex] = coordinates[index - 1];
    coordinates[index - 1] = temp;

    checkSorted();
  }
};

function tilesEventHandler() {
  Array.from(tiles).forEach(function (element) {
    element.addEventListener("click", tileClick);
  });
}

tilesEventHandler();

function checkSorted() {
  var count = 0;
  var flag = true;
  for (var i = 1; i <= cols; i++) {
    for (var j = 1; j <= rows; j++) {
      if (!(coordinates[count].x == j && coordinates[count].y == i)) {
        flag = false;
      }
      count++;
    }
  }
  if (flag) {
    alert("Congragulations! ... Its Completed");
  }
}

function changeBoardSize() {
  var value = document.getElementById("board-size").value;
  if (value && value < 4) {
    document.getElementById("board-size").value = 4;
  }
}

function changeTileSize() {
  var value = document.getElementById("tile-size").value;
  if (value && value < 1) {
    document.getElementById("tile-size").value = 1;
  }
}

function changeTilesStyle(size) {
  Array.from(tiles).forEach(function (element) {
    element.style.height = size + "px";
    element.style.width = size + "px";
  });

  for (var k = 0; k < coordinates.length - 1; k++) {
    tilePosition(tiles[k], coordinates[k].x - 1, coordinates[k].y - 1);
  }
}

function changeTileSizeSubmit() {
  var size = parseInt(document.getElementById("tile-size").value);
  tileHeight = size;
  tileWidth = size;

  changeTilesStyle(size);

  boardWidth = (tileWidth + gap) * cols + gap;
  initBoardSize();
}

function isSolvable() {
  var n = cols;
  var orders = [];
  var parity =0;
  var blankRow  = (rows - coordinates[coordinates.length-1].y)+1;
  for (var i = 1; i <= rows; i++) {
    for (var j = 1; j <= rows; j++)
   {
    var index = (coordinates.findIndex(item => item.x == j && item.y == i ))+1;
    if (index == coordinates.length ){
      index = 0
    }
      orders.push(index)
   }
  }
  for (var i = 0; i < orders.length; i++){
    for (var j = i + 1; j < orders.length; j++){
      if (orders[i] > orders[j] && orders[j] != 0)
      {
          parity++;
      }
    }
  }
  if (n % 2 == 0 && blankRow % 2 == 0 && blankRow != 0 && parity % 2 != 0) {
       document.getElementById("message").innerHTML = "This puzzle is solvable !";
       setTimeout(function(){
        document.getElementById("message").innerHTML =""
       },5000)
  } else if(n % 2 != 0 && parity % 2 == 0) {
      document.getElementById("message").innerHTML = "This puzzle is solvable !";
      setTimeout(function(){
       document.getElementById("message").innerHTML =""
      },5000)
  }
  else{
    document.getElementById("message").innerHTML = "This puzzle is not solvable !";
    setTimeout(function(){
     document.getElementById("message").innerHTML ="";
    initialize()
    },2000)
  }
}
