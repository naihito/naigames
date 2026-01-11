/* ==============================
    Canvas / 基本設定
============================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");    // キャンバスに描画する「ペン」

// canvasの実際の描画サイズ(CSSの見た目サイズとは別)
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

/* ==============================
    ゲーム定数
============================== */
const GAME_TITLE = "OCHIMONO NAKUSHI";
const GAME_VERSION = "v1.0";

/* ==============================
    フィールド設定
============================== */
const COLS = 10;    // フィールド(盤面)の列数
const ROWS = 20;    // フィールド(盤面)の段数
const CELL_SIZE = 24;   // 1セルのサイズ

// フィールドの「プレイ領域」を明確化するためのサイズ
const FIELD_WIDTH = COLS * CELL_SIZE;
const FIELD_HEIGHT = ROWS * CELL_SIZE;

/* ==============================
    フィールドデータ
============================== */
// field[y][x]で盤面を管理(2次元配列)
const field = Array.from({ length: ROWS }, () =>
    // 0は空、色文字列が入っていたら「そこに固定ブロックがある」
    Array(COLS).fill(0)
);

/* ==============================
    落ちもの定義
============================== */
const PIECES = [
    // shapeで落ちものの形状を決める(1=ブロックがある / 0=空)
    // colorは落ちものの色
    { shape: [[1, 1],[1, 1]], color: "#ff6a00" },
    { shape: [[1, 1, 1, 1]], color: "#ffee00" },
    { shape: [[0, 1, 0],[1, 1, 1]], color: "#7fff7d" },
    { shape: [[1, 0],[1, 0],[1, 1]], color: "#1cf4ff" },
    { shape: [[0, 1],[0, 1],[1, 1]], color: "#1c55ff" },
    { shape: [[1, 0],[1, 1],[0, 1]], color: "#ff1cff" },
    { shape: [[0, 1],[1, 1],[1, 0]], color: "#ff1c3a" },
];

/* ==============================
    状態管理
============================== */
let currentPiece = null;
let score = 0;  // スコア

// START        gameStarted=false && gameOver=false
// PLAY         gameStarted=true && gameOver=false
// GAME OVER    gameOver=true(gameStartedはtrueのままでOK)    
let gameStarted = false;
let gameOver = false;

/* ==============================
    落下制御
============================== */
// 毎フレーム増加し、30になったら1マス落とす(約0.5秒ごとに落下)
let dropCounter = 0;
const DROP_INTERVAL = 30;

/* ==============================
    入力フラグ(押しっぱなし)
============================== */
// keydownでtrue、keyupでfalse、update内で見て移動する
let keyLeft = false;
let keyRight = false;
let keyDown = false;

/* ==============================
    横移動制御
============================== */
// 押しっぱなしで毎フレーム動くと速すぎるため、MOVE_INTERVALフレームごとに1マス動かす
let moveCounter = 0;
const MOVE_INTERVAL = 6;

/* ==============================
    Canvas フォーカス
============================== */
// canvasは通常フォーカスできない要素
// tabIndexを付けるとフォーカス可能になり、keydownを受け取れる
canvas.tabIndex = 1;
canvas.focus();

// iframe内では特にフォーカスが外れやすいため、クリックで毎回フォーカスを戻す
canvas.addEventListener("click", () => {
    canvas.focus();

    if (!gameStarted && !gameOver) {
        startGame();
        return;
    }

    if (gameOver) restartGame();
});

/* ==============================
    入力イベント
============================== */
// ↓やSpaceがページスクロールを起こすのを止める
canvas.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
    }

    // START中：Enterでゲームスタート
    if (!gameStarted && !gameOver && e.key === "Enter") {
        startGame();
        return;
    }
    // GAME OVER中：Enterでリスタート
    if (gameOver && e.key === "Enter") {
        restartGame();
        return;
    }
    // PLAY中：左右下の操作での回転処理を受け付ける
    if (!gameStarted || gameOver) return;   // PLAY中以外は移動、回転を受け付けない

    if (e.key === "ArrowLeft") keyLeft = true;
    if (e.key === "ArrowRight") keyRight = true;
    if (e.key === "ArrowDown") keyDown = true;

    if (e.key === "ArrowUp" || e.key === " ") {
        rotateCurrentPiece();
    }
});

canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keyLeft = false;
    if (e.key === "ArrowRight") keyRight = false;
    if (e.key === "ArrowDown") keyDown = false;
});

/* ==============================
    ゲーム開始
============================== */
function startGame() {
    gameStarted = true;
    gameOver = false;

    // 初期化(フィールド / スコア / カウンター)
    clearField();
    score = 0;
    dropCounter = 0;
    moveCounter = 0;

    // 最初の落ちものが出現
    spawnPiece();
}

function restartGame() {
    gameStarted = true;
    gameOver = false;

    // 初期化(フィールド / スコア / カウンター)
    clearField();
    score = 0;
    dropCounter = 0;
    moveCounter = 0;

    // 最初の落ちものが出現
    spawnPiece();
}

function clearField() {
    field.forEach((row) => row.fill(0));
}

/* ==============================
    落ちもの生成
============================== */
function spawnPiece() {
    const base = PIECES[Math.floor(Math.random() * PIECES.length)];
    const piece = {
        shape: base.shape.map((r) => [...r]),
        color: base.color,
        x: Math.floor(COLS / 2) - Math.floor(base.shape[0].length / 2),
        y: 0,
    };

    // 出現位置に置けない = 天井まで埋まった → GAME OVER
    if (!canMove(piece.x, piece.y, piece.shape)) {
        gameOver = true;
        return;
    }

    currentPiece = piece;
}

spawnPiece();

/* ==============================
    ゲームループ
============================== */
function loop() {
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (!gameStarted && !gameOver) {
        drawStartScreen();
        requestAnimationFrame(loop);
        return;
    }

    if (gameOver) {
        drawGameOverScreen();
        requestAnimationFrame(loop);
        return;
    }

    update();
    drawField();
    drawFixedBlocks();
    drawCurrentPiece();
    drawFieldBorder();
    drawPlayUI();

    requestAnimationFrame(loop);
}

/* ==============================
    更新処理
============================== */
function update() {
    dropCounter++;

    // 横移動(速度制御)
    if (keyLeft || keyRight) moveCounter++;
    else moveCounter = 0;

    if (moveCounter >= MOVE_INTERVAL) {
        if (keyLeft && canMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
            currentPiece.x--;
        }
        if (keyRight && canMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
            currentPiece.x++;
        }
        moveCounter = 0;
    }

    // 高速落下
    if (keyDown && canMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
        dropCounter = 0;
    }

    // 自然落下
    if (dropCounter >= DROP_INTERVAL) {
        if (canMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        } else {
            fixPiece();
            clearLines();
            spawnPiece();
        }
        dropCounter = 0;
    }
}

/* ==============================
    回転
============================== */
function rotateCurrentPiece() {
    const rotated = rotateMatrix(currentPiece.shape);

    // その場で回転できる
    if (canMove(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
        return;
    }

    // 壁キック(左右にずらして試す)
    for (const dx of [-1, 1, -2, 2]) {
        if (canMove(currentPiece.x + dx, currentPiece.y, rotated)) {
            currentPiece.x += dx;
            currentPiece.shape = rotated;
            return;
        }
    }
    // 無理なら回転キャンセル
}

function rotateMatrix(mat) {
    const h = mat.length;
    const w = mat[0].length;
    const res = Array.from({ length: w }, () => Array(h).fill(0));

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            res[x][h - 1 - y] = mat[y][x];
        }
    }
    return res;
}

/* ==============================
    移動可能判定
============================== */
function canMove(px, py, shape) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (!shape[y][x]) continue;

            const nx = px + x;
            const ny = py + y;

            // 左右・下の範囲外
            if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
            
            // 既にブロックがある
            if (field[ny][nx]) return false;
        }
    }
    return true;
}

/* ==============================
    固定・ライン消去
============================== */
function fixPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                field[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        });
    });
}

function clearLines() {
    let lines = 0;

    // 下から上へチェック
    for (let y = ROWS - 1; y >= 0; y--) {
        if (field[y].every(cell => cell)) {
            field.splice(y, 1);                 // 揃った行を削除
            field.unshift(Array(COLS).fill(0)); // 上に空行を追加
            lines++;
            y++;    // 同じ行番号をもう一度チェック(連続消し対応)
        }
    }

    // スコア加算
    if (lines > 0) {
        score += lines * 100;
    }
}

/* ==============================
    描画
============================== */
// フィールド(グリッド)
function drawField() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

// 固定ブロック
function drawFixedBlocks() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (field[y][x]) {
                ctx.fillStyle = field[y][x];
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

// 落下中落ちもの
function drawCurrentPiece() {
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillRect(
                    (currentPiece.x + x) * CELL_SIZE,
                    (currentPiece.y + y) * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        });
    });
}

function drawFieldBorder() {
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
}

function drawPlayUI() {
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 10, 17);

    drawTitleVersionFooter();
}

/* ==============================
    画面(START / GAME OVER)
============================== */
function drawStartScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("START", WIDTH / 2, HEIGHT / 2);

    ctx.font = "12px sans-serif";
    ctx.fillText("Press Enter or Click to Start", WIDTH / 2, HEIGHT / 2 + 40);

    drawTitleVersionFooter();
}

function drawGameOverScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);

    ctx.font = "12px sans-serif";
    ctx.fillText("Press Enter or Click to Restart", WIDTH / 2, HEIGHT / 2 + 40);

    drawTitleVersionFooter();
}

/* ==============================
    共通フッター(タイトル＋バージョン)
============================== */
function drawTitleVersionFooter() {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${GAME_TITLE}   ${GAME_VERSION}`, WIDTH / 2, FIELD_HEIGHT + 15);    
}

/* ==============================
    起動
============================== */
loop();
