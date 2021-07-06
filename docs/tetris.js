var fieldColor = "#202020"; var fieldWidth = 200; var fieldHeight = 400; var blockNumWidth = 10; var blockNumHeight = 20; var blockSize = fieldWidth / blockNumWidth; var level = 1; var score = 0; var speed = 300 - (level * 50); var linesRemoved = 0; var blocksDropped = 0; var spacePressed = false; var lKeyPressed = false; var rKeyPressed = false; var sensitivity = 80; var gameEnd = false; var gamePaused = false; var fieldScore = document.getElementById('t-points'); var fieldLines = document.getElementById('t-lines'); var fieldLevel = document.getElementById('t-level'); var tfield = document.getElementById('t-field'); var cfield = tfield.getContext('2d'); var tnext = document.getElementById('t-next'); var cnext = tnext.getContext('2d'); tfield.width = fieldWidth; tfield.height = fieldHeight; tnext.width = (blockSize * 4); tnext.height = (blockSize * 4); var resetGame = function () {
  spacePressed = false; linesRemoved = 0; blocksDropped = 0; score = 0; level = 1; speed = 7
  300 - (level * 50); gameEnd = false; blockDropped = 0; gamePaused = false;
}
var shapes = [[[[0, -1], [1, -1], [-1, 0], [0, 0]], [[0, -1], [0, 0], [1, 0], [1, 1]], [[0, 0], [1, 0], [-1, 1], [0, 1]], [[-1, -1], [-1, 0], [0, 0], [0, 1]], "#3cb300", "S"], [[[-1, -1], [0, -1], [0, 0], [1, 0]], [[1, -1], [0, 0], [1, 0], [0, 1]], [[-1, 0], [0, 0], [0, 1], [1, 1]], [[0, -1], [0, 0], [-1, 0], [-1, 1]], "#e55050", "Z"], [[[-1, 0], [0, 0], [1, 0], [2, 0]], [[1, -1], [1, 0], [1, 1], [1, 2]], [[-1, 1], [0, 1], [1, 1], [2, 1]], [[0, -1], [0, 0], [0, 1], [0, 2]], "#88b0e0", "I"], [[[0, -1], [1, -1], [0, 0], [1, 0]], [[0, -1], [1, -1], [0, 0], [1, 0]], [[0, -1], [1, -1], [0, 0], [1, 0]], [[0, -1], [1, -1], [0, 0], [1, 0]], "#fcca00", "O"], [[[-1, -1], [-1, 0], [0, 0], [1, 0]], [[1, -1], [0, -1], [0, 0], [0, 1]], [[-1, 0], [0, 0], [1, 0], [1, 1]], [[0, -1], [0, 0], [0, 1], [-1, 1]], "#1066de", "J"], [[[1, -1], [-1, 0], [0, 0], [1, 0]], [[0, -1], [0, 0], [0, 1], [1, 1]], [[-1, 0], [0, 0], [1, 0], [-1, 1]], [[-1, -1], [0, -1], [0, 0], [0, 1]], "#e07835", "L"], [[[0, -1], [-1, 0], [0, 0], [1, 0]], [[0, -1], [0, 0], [1, 0], [0, 1]], [[-1, 0], [0, 0], [1, 0], [0, 1]], [[0, -1], [-1, 0], [0, 0], [0, 1]], "#705090", "T"]]; var activeShapes = [2, 3, 5, 6]; var allShapes = [0, 1, 2, 3, 4, 5, 6]; var fseed = ~~(Math.random() * activeShapes.length); var fval = activeShapes[fseed]; var nextShape = shapes[activeShapes[fseed]].slice(); activeShapes = allShapes.slice(); for (var i = 0; i < activeShapes.length; i++) { if (activeShapes[i] === fval) { activeShapes.splice(i, 1); } }
var fields = []; var emptyLine = []; for (var i = 0; i < blockNumWidth; i++) { emptyLine.push(fieldColor); }
for (var i = 0; i < blockNumHeight; i++) { fields.push(emptyLine.slice(0)); }
fields[blockNumHeight] = ["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"]; var getRandomShape = function () {
  var seed; if (activeShapes.length > 0) { seed = ~~(Math.random() * activeShapes.length); } else { activeShapes = allShapes.slice(); seed = ~~(Math.random() * activeShapes.length); }
  var shape = shapes[activeShapes[seed]].slice(); activeShapes.splice(seed, 1); return shape;
}
var genBlock = function (posX, posY, color) { cfield.fillStyle = color; cfield.beginPath(); cfield.rect(posX, posY, blockSize, blockSize); cfield.closePath(); cfield.fill(); if (color != fieldColor) { cfield.lineWidth = 1; cfield.strokeStyle = fieldColor; cfield.stroke(); } }; var genStrokedBlock = function (posX, posY, color, strokeColor) { cfield.fillStyle = color; cfield.beginPath(); cfield.rect(posX, posY, blockSize, blockSize); cfield.closePath(); cfield.fill(); cfield.lineWidth = 1; cfield.strokeStyle = strokeColor; cfield.stroke(); }
var clearNext = function () { cnext.fillStyle = fieldColor; cnext.beginPath(); cnext.rect(0, 0, (blockSize * 4), (blockSize * 4)); cnext.closePath(); cnext.fill(); }
var genNextBlock = function (posX, posY, color) { cnext.fillStyle = color; cnext.beginPath(); cnext.rect(posX, posY, blockSize, blockSize); cnext.closePath(); cnext.fill(); cnext.lineWidth = 1; cnext.strokeStyle = fieldColor; cnext.stroke(); }; var drawNext = function () {
  clearNext(); var offset = blockSize / 2; if (nextShape[5] == shapes[2][5] || nextShape[5] == shapes[4][5]) { offset = 0; }
  for (var i = 0; i < 4; i++) { genNextBlock((offset + blockSize + (nextShape[0][i][0] * blockSize)), ((blockSize * 2) + (nextShape[0][i][1] * blockSize)), nextShape[4]); }
}
var controlBlock = new (function () {
  this.reset = function () { this.shape = nextShape.slice(); this.color = this.shape[4]; this.pos = 0; this.X = (fieldWidth / 2) - blockSize; this.Y = -20; nextShape = getRandomShape(); drawNext(); }
  this.rotate = function () {
    new_pos = 0; if (this.pos != 3) { new_pos = this.pos + 1; }
    var sh = this.shape[new_pos]; if (!this.collision(this.X, this.Y, sh)) { this.pos = new_pos; drawGameField(); } else { if (!this.collision(this.X + blockSize, this.Y, sh)) { this.X += blockSize; this.pos = new_pos; drawGameField(); } else if (!this.collision(this.X - blockSize, this.Y, sh)) { this.X -= blockSize; this.pos = new_pos; drawGameField(); } else if (!this.collision(this.X + (blockSize * 2), this.Y, sh)) { this.X += blockSize * 2; this.pos = new_pos; drawGameField(); } else if (!this.collision(this.X - (blockSize * 2), this.Y, sh)) { this.X -= blockSize * 2; this.pos = new_pos; drawGameField(); } }
  }
  this.position = function (x, y) {
    var arr = []; for (var i = 0; i < 4; i++) { var cx = Math.floor(((x + (this.shape[this.pos][i][0] * blockSize)) / blockSize)); var cy = Math.floor(((y + (this.shape[this.pos][i][1] * blockSize)) / blockSize)); arr.push([cx, cy]); }
    return arr;
  }
  this.new_position = function (shape, x, y) {
    var arr = []; for (var i = 0; i < 4; i++) { var cx = Math.floor(((x + (shape[i][0] * blockSize)) / blockSize)); var cy = Math.floor(((y + (shape[i][1] * blockSize)) / blockSize)); arr.push([cx, cy]); }
    return arr;
  }
  this.getShadowPos = function () {
    var pos = this.position(this.X, this.Y); var highestBlock = blockNumHeight - 1; var lowestBlock = -2; for (var i = 0; i < 4; i++) {
      for (var y = 0; y < fields.length; y++) { if (fields[y][pos[i][0]] != fieldColor && y > pos[i][1]) { if (y < highestBlock) { highestBlock = y; } } }
      if (this.shape[this.pos][i][1] > lowestBlock) { lowestBlock = this.shape[this.pos][i][1]; }
    }
    highestBlock -= lowestBlock; highestBlock += 1; if (this.collision(this.X, (highestBlock * blockSize)) || this.collision(this.X, ((highestBlock - 1) * blockSize))) { highestBlock -= 1; }
    if (this.collision(this.X, (highestBlock * blockSize))) { highestBlock -= 1; }
    ghostY = highestBlock * blockSize; if (ghostY < this.Y) { ghostY = this.Y; }
    return [this.X, ghostY];
  }
  this.moveDown = function (speed) {
    this.Y += speed; for (var i = 0; i < 4; i++) { var cx = Math.floor(((this.X + (this.shape[this.pos][i][0] * blockSize)) / blockSize)); var cy = Math.floor(((this.Y + (this.shape[this.pos][i][1] * blockSize)) / blockSize)); if (cx > -1 && cy > -1) { if (fields[cy][cx] != fieldColor || cy == blockNumHeight) { blocksDropped += 1; this.kill(speed); } } }
    drawGameField();
  }
  this.collision = function (x, y, s) {
    if (s != undefined) { var pos = this.new_position(s, x, y); } else { var pos = this.position(x, y); }
    var collided = false; for (var i = 0; i < pos.length; i++) { if (pos[i][0] < 0 || pos[i][0] >= blockNumWidth) { collided = true; break; } else if (pos[i][1] != undefined && pos[i][1] >= 0 && fields[pos[i][1]][pos[i][0]] != fieldColor) { collided = true; break; } }
    return collided;
  }
  this.chkMoveLeft = function () { if (!this.collision(this.X - blockSize, this.Y)) { this.moveLeft(); } }
  this.moveLeft = function () { this.X = this.X - blockSize; drawGameField(); }
  this.chkMoveRight = function () { if (!this.collision(this.X + blockSize, this.Y)) { this.moveRight(); } }
  this.moveRight = function () { if (this.X < (fieldWidth - blockSize)) { this.X += blockSize; drawGameField(); } }
  this.dropDown = function () {
    ghostPos = this.getShadowPos(); var pos = this.position(ghostPos[0], ghostPos[1]); for (var i = 0; i < 4; i++) {
      if (fields[pos[i][1]] != undefined)
        fields[pos[i][1]][pos[i][0]] = this.color;
    }
    blocksDropped += 1; this.reset(); removeLines(); drawGameField();
  }
  this.kill = function (speed) {
    var curX = this.X; var curY = this.Y - speed; var pos = this.position(curX, curY); if (pos[0][1] < 0) { gameEnd = true; }
    for (var i = 0; i < 4; i++) { var kx = pos[i][0]; var ky = pos[i][1]; if (kx > -1 && ky > -1) { fields[ky][kx] = this.color; } }
    this.reset();
  }
  this.draw = function () { for (var i = 0; i < 4; i++) { genStrokedBlock((this.X + (this.shape[this.pos][i][0] * blockSize)), (this.Y + (this.shape[this.pos][i][1] * blockSize)), this.color, fieldColor); } }
  this.drawShadow = function () { ghostPos = this.getShadowPos(); for (var i = 0; i < 4; i++) { genStrokedBlock((ghostPos[0] + (this.shape[this.pos][i][0] * blockSize)), (ghostPos[1] + (this.shape[this.pos][i][1] * blockSize)), "rgba(250,250,250,0.1)", "rgba(250,250,250,0.2)"); } }
  this.reset();
})(); var block = controlBlock; var copyArray = function (arr) {
  var carr = arr.slice(); for (var i = 0; i < arr.length; i++) { carr[i] = arr[i].slice(); }
  return carr;
}
var removeLines = function () {
  var f = copyArray(fields); var linesRemovedCount = 0; f.reverse(); for (var check = 0; check < 4; check++) {
    for (var i = 1; i < f.length; i++) {
      var foundLine = false; var wblock = 0; for (var j = 0; j < f[i].length; j++) {
        if (f[i][j] != fieldColor) { wblock = wblock + 1; }
        if (wblock === 10) { f.splice(i, 1); foundLine = true; break; }
      }
      if (foundLine) { f.push(emptyLine.slice()); linesRemovedCount += 1; break; }
    }
  }
  f.reverse(); fields = copyArray(f); if (linesRemovedCount > 0) {
    linesRemoved += linesRemovedCount; level = Math.floor((linesRemoved / 10)) + 1; speed = 700 - (level * 50); var multiplier = 25; if (linesRemovedCount == 2) { multiplier = 100; } else if (linesRemovedCount == 3) { multiplier = 400; } else if (linesRemovedCount == 4) { multiplier = 1600; }
    score += (multiplier * (level + 1)); fieldLevel.innerHTML = level; fieldScore.innerHTML = score; fieldLines.innerHTML = linesRemoved;
  }
}
var drawGameField = function () {
  for (var y = 0; y < blockNumHeight; y++) { for (var x = 0; x < blockNumWidth; x++) { genBlock((x * blockSize), (y * blockSize), fields[y][x], ""); } }
  block.drawShadow(); block.draw();
}
var moveLeft = function () { if (lKeyPressed) { block.chkMoveLeft(); setTimeout(moveLeft, sensitivity); } }
var moveRight = function () { if (rKeyPressed) { block.chkMoveRight(); setTimeout(moveRight, sensitivity); } }
var getKeyCode = function (e) {
  var code; if (window.event) { code = e.keyCode; } else if (e.which) { code = e.which; }
  return code;
}
document.onkeyup = function (e) { var keycode = getKeyCode(e); if (keycode == 32) { spacePressed = false; } else if (keycode == 37) { lKeyPressed = false; } else if (keycode == 39) { rKeyPressed = false; } }
document.onkeydown = function (e) {
  var keycode = getKeyCode(e); if (!gameEnd && !gamePaused) { if (keycode == 38) { e.preventDefault(); block.rotate(); } else if (keycode == 37) { e.preventDefault(); lKeyPressed = true; block.chkMoveLeft(); } else if (keycode == 39) { e.preventDefault(); rKeyPressed = true; block.chkMoveRight(); } else if (keycode == 40) { e.preventDefault(); block.moveDown(20); } else if (keycode == 32 && !spacePressed) { spacePressed = true; e.preventDefault(); block.dropDown(); } }
  if (keycode == 80 && !gameEnd) { if (gamePaused) { gamePaused = false; } else { gamePaused = true; gamePause(); } }
}

/*
 * スワイプイベント設定
 */
function setSwipe(elem) {
    let t = document.querySelector(elem);
    let startX;        // タッチ開始 x座標
    let startY;        // タッチ開始 y座標
    let moveX;    // スワイプ中の x座標
    let moveY;    // スワイプ中の y座標
    let dist = 30;    // スワイプを感知する最低距離（ピクセル単位）
     
    // タッチ開始時： xy座標を取得
    t.addEventListener("touchstart", function(e) {
        e.preventDefault();
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });
     
    // スワイプ中： xy座標を取得
    t.addEventListener("touchmove", function(e) {
        e.preventDefault();
        moveX = e.changedTouches[0].pageX;
        moveY = e.changedTouches[0].pageY;
    });
     
    // タッチ終了時： スワイプした距離から左右どちらにスワイプしたかを判定する/距離が短い場合何もしない
    t.addEventListener("touchend", function(e) {
        if (startX > moveX && startX > moveX + dist) {        // 右から左にスワイプ
            // 右から左にスワイプした時の処理
            e.preventDefault(); 
            lKeyPressed = true; 
            block.chkMoveLeft(); 
        }else if (startX < moveX && startX + dist < moveX) {    // 左から右にスワイプ
            // 左から右にスワイプした時の処理
            e.preventDefault(); 
            rKeyPressed = true; 
            block.chkMoveRight(); 
        }else if (startY < moveY && startY + dist < moveY) {    // 上から下にスワイプ
            // 上から下にスワイプした時の処理
            spacePressed = true; 
            e.preventDefault(); 
            block.dropDown();
        }else if (startY > moveY && startY + dist > moveY) {    // 下から上にスワイプ
            // 下から上にスワイプした時の処理
            e.preventDefault(); 
            block.rotate();
        }
    });
}
setSwipe( '#t-field' );
//. スクロール禁止
var movefun = function( event ){
  event.preventDefault();
}
window.addEventListener( 'touchmove', movefun, { passive: false } );

var gameOver = function () { cfield.font = "bold 16px Arial"; cfield.textAlign = "center"; cfield.fillStyle = "rgba(0,0,0, 0.85)"; cfield.beginPath(); cfield.rect(0, 0, fieldWidth, fieldHeight); cfield.closePath(); cfield.fill(); cfield.fillStyle = "#b30000"; cfield.fillText("Game over", (fieldWidth / 2), (fieldHeight / 2) - 70); cfield.font = "17px Arial"; cfield.fillStyle = "#f8f5c5"; cfield.fillText(" Score:" + score, (fieldWidth / 2), (fieldHeight / 2) + 40); }
var gamePause = function () { cfield.font = "bold 16px Arial"; cfield.textAlign = "center"; cfield.fillStyle = "rgba(0,0,0, 0.85)"; cfield.beginPath(); cfield.rect(0, 0, fieldWidth, fieldHeight); cfield.closePath(); cfield.fill(); cfield.fillStyle = "#fa5300"; cfield.fillText("PAUSE", (fieldWidth / 2), (fieldHeight / 2)); }
var loopGame = function () {
  if (!gameEnd) {
    if (!gamePaused) { block.moveDown(blockSize); removeLines(); drawGameField(); }
    setTimeout(loopGame, speed);
  } else { gameOver(); }
}
drawNext(); loopGame();