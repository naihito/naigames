/* ==============================
    Canvas / 定数
============================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");    // 2D描画用のペン取得

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const GAME_TITLE = "BLOCK NAKUSHI";
const GAME_VERSION = "v1.0";

/* ==============================
    状態管理
============================== */
let gameStarted = false;    // START
let gameOver = false;   // GAME OVER
let gameClear = false;  //CLEAR

let lives = 3;  // LIFE
let score = 0;  // SCORE

/* ==============================
    オブジェクト定義
============================== */
// パドル
const paddle = {
    w: 120, // パドルの幅
    h: 20,  // パドルの高さ
    x: WIDTH / 2 - 60,  // パドル横軸の初期位置を中央に配置
    y: HEIGHT - 60, // パドル縦軸は下から60px上に配置
    speed: 10,  // 1フレームで動く量
};

// ボール
const ball = {
    x: WIDTH / 2,   // ボールの初期位置(X)
    y: HEIGHT / 2,  // ボールの初期位置(Y)
    r: 10,  // ボールの半径
    dx: 5,  // 1フレームごとの移動量(X)
    dy: -5, // 1フレームごとの移動量(Y)
};

/* ==============================
    ブロック生成
============================== */
const blocks = [];
const rows = 4; // ブロックの段数
const cols = 7; // ブロックの列数
const bw = 70;  // ブロック1個の幅
const bh = 26;  // ブロック1個の高さ
const gap = 10; // ブロック間の隙間
const topMargin = 50;   // 画面上部からブロック1段目までの余白

// 横幅の合計を計算して、左右センター寄せにする
const totalW = cols * bw + (cols - 1) * gap;
const startX = Math.floor((WIDTH - totalW) / 2);
const startY = topMargin;

// 1個ずつのブロック座標を規則的に並べる
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        blocks.push({
            x: startX + c * (bw + gap),
            y: startY + r * (bh + gap),
            w: bw,
            h: bh,
            alive: true,
        });
    }
}

/* ==============================
    入力管理
============================== */
// 押している状態を保持するフラグ(押しっぱなし移動を実現)
let left = false;
let right = false;

// canvasをフォーカス可能にする(これがないとkeydownが届かない)
canvas.tabIndex = 1;
// 初期フォーカスを当てる(ブラウザにより無効化される可能性あり)
canvas.focus();

canvas.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") left = true;
    if (e.key === "ArrowRight") right = true;
});

canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
});

canvas.addEventListener("click", handleStart);
window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleStart();
});

/* ==============================
    ゲームループ
============================== */
function loop() {
    // 背景
    ctx.fillStyle = "#0a0a1e";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // CLEAR画面
    if (gameClear) {
        drawClearScreen();
        requestAnimationFrame(loop);
        return;
    }

    // GAME OVER画面
    if (gameOver) {
        drawGameOverScreen();
        requestAnimationFrame(loop);
        return;
    }

    // START画面
    if (!gameStarted) {
        drawStartScreen();
        requestAnimationFrame(loop);
        return;
    }

    update();
    draw();

    requestAnimationFrame(loop);
}

/* ==============================
    更新処理
============================== */
function update() {
    // パドル移動
    if (left && paddle.x > 0) paddle.x -= paddle.speed;
    if (right && paddle.x + paddle.w < WIDTH) paddle.x += paddle.speed;

    // ボール移動
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 壁反射
    if (ball.x < ball.r || ball.x > WIDTH - ball.r) ball.dx *= -1;
    if (ball.y < ball.r) ball.dy *= -1;

    // パドル反射
    if (
        ball.y + ball.r > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w
    ) {
        ball.dy *= -1;
    }

    // ライフを減らす
    if (ball.y - ball.r > HEIGHT) {
        lives--;
    
        // ライフ0でGAME OVER
        if (lives <= 0) {
            gameOver = true;
        } else {
            resetBall();
        }
    }

    if (ball.y - ball.r > HEIGHT) {
        gameOver = true;
    }

    // ブロック判定
    blocks.forEach((b) => {
        if (!b.alive) return;

        if (
            ball.x > b.x &&
            ball.x < b.x + b.w &&
            ball.y > b.y &&
            ball.y < b.y + b.h
        ) {
            b.alive = false;
            ball.dy *= -1
            score += 100;
        }
    });

    // CLEAR判定
    // ブロックに一つでもaliveがあればtrue
    const remainingBlocks = blocks.some((b) => b.alive);
    // ブロックが全部無くなったらCLEAR
    if (!remainingBlocks) {
        gameClear = true;
        gameStarted = false;
    }
}

/* ==============================
    描画処理
============================== */
function draw() {
    // パドル描画
    ctx.fillStyle = "#55aaff";
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // ボール描画
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ff55ff";
    ctx.fill();

    // ブロック描画
    blocks.forEach((b) => {
        if (!b.alive) return;   // aliveがfalseなら描画しない
        ctx.fillStyle = "#ff7b7b";
        ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // ライフ表示
    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`LIFE: ${lives}`, 510, 30);

    // スコア表示
    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 30, 30)

    // バージョン表示
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
        `${GAME_TITLE}   ${GAME_VERSION}`,
        WIDTH - 10,
        HEIGHT - 10
    );
}

/* ==============================
    UI描画
============================== */
function drawStartScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("START", WIDTH / 2, HEIGHT / 2);

    ctx.font = "16px sans-serif";
    ctx.fillText("Click or Press Enter", WIDTH / 2, HEIGHT / 2 + 40);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(
        `${GAME_TITLE}   ${GAME_VERSION}`,
        WIDTH / 2,
        HEIGHT - 20
    );
}

function drawGameOverScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);

    ctx.font = "16px sans-serif";
    ctx.fillText("Click or Press Enter to Restart", WIDTH / 2, HEIGHT / 2 + 40);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(
        `${GAME_TITLE}   ${GAME_VERSION}`,
        WIDTH / 2,
        HEIGHT - 20
    );
}

function drawClearScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLEAR!", WIDTH / 2, HEIGHT / 2);

    ctx.font = "16px sans-serif";
    ctx.fillText(`SCORE: ${score}`, WIDTH / 2, HEIGHT / 2 + 40);
    ctx.fillText("Click or Press Enter to Play Again", WIDTH / 2, HEIGHT / 2 + 80);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(
        `${GAME_TITLE}   ${GAME_VERSION}`,
        WIDTH / 2,
        HEIGHT - 20
    );
}

/* ==============================
    共通処理
============================== */
function handleStart() {
    canvas.focus();

    // CLEAR → 次のプレイ
    if (gameClear) {
        resetGame();
        gameClear = false;
        return;
    }

    // GAME OVER → リスタート
    if (gameOver) {
        resetGame();
        return;
    }

    // START → プレイ開始
    if (!gameStarted) {
        gameStarted = true;
    }
}

function resetGame() {
    // 状態リセット
    gameOver = false;
    gameClear = false;
    gameStarted = true;

    lives = 3;
    score = 0;

    // パドル位置
    paddle.x = WIDTH / 2 - paddle.w / 2;
    resetBall();
    // ブロック復活
    blocks.forEach((b) => (b.alive = true));
}

function resetBall() {
    // ボール位置と速度
    ball.x = WIDTH / 2;
    ball.y = HEIGHT /2;
    ball.dx = 5;
    ball.dy = -5;
}

/* ==============================
    起動
============================== */
loop();
