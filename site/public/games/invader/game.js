/* ==============================
    Canvas / 定数
============================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");    // 2D描画用のペン取得

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const GAME_TITLE = "INVADER NAKUSHI";
const GAME_VERSION = "v1.0";

/* ==============================
    状態管理
============================== */
let gameStarted = false;    // START
let gameOver = false;   // GAME OVER
let gameClear = false;  // CLEAR
let score = 0;  // SCORE

/* ==============================
    プレイヤー(自機)
============================== */
const player = {
    w: 50,  // プレイヤーの横幅
    h: 20,  // プレイヤーの高さ
    x: WIDTH / 2 - 25,  // プレイヤーの初期位置を中央に配置
    y: HEIGHT - 60, // プレイヤー縦軸は画面下から60px上に固定
    speed: 7,   // 1フレームで動く量
};

/* ==============================
    ショット(弾)
============================== */
const bullets = []; // 画面上に存在する弾を配列で管理
const BULLET_SPEED = 10;    // ショットスピード
const BULLET_WIDTH = 4; // 細長いレーザー表現(幅)
const BULLET_HEIGHT = 10;   // 細長いレーザー表現(高さ)

let canShoot = true;    // ショット可否
const SHOOT_COOLDOWN = 300; // ms

/* ==============================
    インベーダー
============================== */
const invaders = [];    // インベーダー集団
const INVADER_ROWS = 4; // インベーダー集団の段数
const INVADER_COLS = 8; // インベーダー集団の列数
const INVADER_WIDTH = 36;   // インベーダーの横幅
const INVADER_HEIGHT = 24;  // インベーダーの高さ
const INVADER_GAP = 12; // インベーダー間の隙間

// 集団移動用
let invaderDir = 1; // 1: 右, -1: 左
const INVADER_SPEED = 1;    // 横移動速度
const INVADER_DROP = 20;    // 端に当たった時の下降量

/* ==============================
    インベーダー形状(ドット絵)
============================== */
// 1 = 描画する, 0 = 透明
const INVADER_SHAPE = [
    [0,1,0,0,0,0,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,0,0,0,0,1,0],
];

/* ==============================
    初期配置
============================== */
const invaderTotalWidth = INVADER_COLS * INVADER_WIDTH + (INVADER_COLS - 1) * INVADER_GAP;
const invaderStartX = Math.floor((WIDTH - invaderTotalWidth) / 2);  // 画面中央寄せ
const invaderStartY = 80;   // 上から80px下げて配置

function initInvaders() {
    invaders.length = 0;
    for (let r = 0; r < INVADER_ROWS; r++) {
        for (let c = 0; c < INVADER_COLS; c++) {
            invaders.push({
                x: invaderStartX + c * (INVADER_WIDTH + INVADER_GAP),
                y: invaderStartY + r * (INVADER_HEIGHT + INVADER_GAP),
                w: INVADER_WIDTH,
                h: INVADER_HEIGHT,
                alive: true,
            });
        }
    }
}

initInvaders();

/* ==============================
    入力管理
============================== */
// 押している状態を保持するフラグ(押しっぱなし移動を実現)
let left = false;
let right = false;

canvas.tabIndex = 1;
canvas.focus();

canvas.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") left = true;
    if (e.key === "ArrowRight") right = true;
    if (e.key === " ") shoot();
});

canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
});

canvas.addEventListener("click", () => {
    canvas.focus();
    if (!gameStarted) gameStarted = true;
    if (gameOver || gameClear) resetGame();
});

window.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    canvas.focus();

    // CLEAR / GAME OVER → リスタート
    if (gameOver || gameClear) {
        resetGame();
        return;
    }

    // START → ゲーム開始
    if (!gameStarted) {
        gameStarted = true;
    }
});

/* ==============================
    ゲームループ
============================== */
function loop() {
    // 背景
    ctx.fillStyle = "#050510";
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
    // プレイヤー移動
    if (left && player.x > 0) player.x -= player.speed;
    if (right && player.x + player.w < WIDTH) player.x += player.speed;

    // 弾移動
    bullets.forEach((b) => (b.y -= BULLET_SPEED));
    // 画面外に出た弾を削除
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + BULLET_HEIGHT < 0) {
            bullets.splice(i, 1);
        }
    }

    // インベーダー移動(全体を一つの集団として扱う)
    let hitEdge = false;
    invaders.forEach((inv) => {
        if (!inv.alive) return;
        inv.x += INVADER_SPEED * invaderDir;

        // 端に当たったかチェック(1体でも端に当たったら全員下降)
        if (inv.x <= 0 || inv.x + inv.w >= WIDTH) hitEdge = true;
    });

    // 端に当たっていたら、向きを反転して下降
    if (hitEdge) {
        invaderDir *= -1;
        invaders.forEach((inv) => {
            if (inv.alive) inv.y += INVADER_DROP;
        });
    }

    // 当たり判定(弾 vs インベーダー)
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];

        for (const inv of invaders) {
            if (!inv.alive) continue;
            // 矩形判定
            if (
                b.x < inv.x + inv.w &&
                b.x + BULLET_WIDTH > inv.x &&
                b.y < inv.y + inv.h &&
                b.y + BULLET_HEIGHT > inv.y
            ) {
                // 命中
                inv.alive = false;
                bullets.splice(i, 1);
                score += 10;
                break;
            }
        }
    }

    // GAME OVER判定
    invaders.forEach((inv) => {
        if (inv.alive && inv.y + inv.h >= player.y) gameOver = true;
    });

    // CLEAR
    if (!invaders.some((inv) => inv.alive)) gameClear = true;
}

/* ==============================
    描画処理
============================== */
function draw() {
    drawPlayer();
    drawBullets();
    drawInvaders();

    // スコア表示
    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 30, 30);
}

/* ==============================
    各種描画
============================== */
// プレイヤー描画
function drawPlayer() {
    const p = player;
    ctx.fillStyle = "#00eaff";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.h);
    ctx.lineTo(p.x, p.y + p.h * 0.4);
    ctx.lineTo(p.x + p.w * 0.35, p.y + p.h * 0.4);
    ctx.lineTo(p.x + p.w * 0.5, p.y);
    ctx.lineTo(p.x + p.w * 0.65, p.y + p.h * 0.4);
    ctx.lineTo(p.x + p.w, p.y + p.h * 0.4);
    ctx.lineTo(p.x + p.w, p.y + p.h);
    ctx.closePath();
    ctx.fill();
}

// 弾描画
function drawBullets() {
    ctx.fillStyle = "#ff3c00";
    bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
}

// インベーダー描画
function drawInvaders() {
    const pixel = 4;    // ドット1個のサイズ
    ctx.fillStyle = "#7cFF00";  // インベーダーカラー

    invaders.forEach((inv) => {
        if (!inv.alive) return;
        INVADER_SHAPE.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillRect(
                        inv.x + x * pixel,
                        inv.y + y * pixel,
                        pixel,
                        pixel,
                    );
                }
            });
        });
    });
}

/* ==============================
    画面
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
    弾発射 / リセット
============================== */
function shoot() {
    if (!gameStarted || !canShoot) return;
    bullets.push({
        x: player.x + player.w / 2 - BULLET_WIDTH / 2,
        y: player.y - BULLET_HEIGHT,
    });
    canShoot = false;
    setTimeout(() => (canShoot = true), SHOOT_COOLDOWN);
}

function resetGame() {
    gameStarted = true;
    gameOver = false;
    gameClear = false;
    score = 0;
    bullets.length = 0;
    player.x = WIDTH / 2 - player.w / 2;
    invaderDir = 1;
    initInvaders();
}

/* ==============================
    起動
============================== */
loop();
