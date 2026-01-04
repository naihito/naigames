/* ==============================
    Canvas / 定数
============================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");    // 2D描画用のペン取得

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

/* ==============================
    状態管理
============================== */
let gameStarted = false;    // START

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

    if (e.key === " ") {    // " "はスペースキー
        shoot();
    }
});

canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") left = false;
    if (e.key === "ArrowRight") right = false;
});

canvas.addEventListener("click", () => {
    canvas.focus();
    gameStarted = true;
});

/* ==============================
    ゲームループ
============================== */
function loop() {
    // 背景
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // START画面
    if (!gameStarted) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("START", WIDTH / 2, HEIGHT / 2);

        ctx.font = "16px sans-serif";
        ctx.fillText("Click or Press Enter", WIDTH / 2, HEIGHT / 2 + 40);

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
    bullets.forEach((b) => {
        b.y -= BULLET_SPEED;
    });
    
    // 画面外に出た弾を削除
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + BULLET_HEIGHT < 0) {
            bullets.splice(i, 1);
        }
    }
}    

/* ==============================
    描画処理
============================== */
function draw() {
    drawPlayer(player);
    drawBullets();
}

/* ==============================
    自機描画(凸型)
============================== */
function drawPlayer(p) {
    ctx.fillStyle = "#00eaff";
    ctx.beginPath();

    // 左下
    ctx.moveTo(p.x, p.y + p.h);

    // 左上(胴体)
    ctx.lineTo(p.x, p.y + p.h * 0.4);

    // 中央上(砲身)
    ctx.lineTo(p.x + p.w * 0.35, p.y + p.h * 0.4);
    ctx.lineTo(p.x + p.w * 0.5, p.y);
    ctx.lineTo(p.x + p.w * 0.65, p.y + p.h * 0.4);

    // 右上(胴体)
    ctx.lineTo(p.x + p.w, p.y + p.h * 0.4);

    // 右下
    ctx.lineTo(p.x + p.w, p.y + p.h);

    ctx.closePath();
    ctx.fill();
}

/* ==============================
    弾描画
============================== */
function drawBullets() {
    ctx.fillStyle = "#ff3c00";
    bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
}

/* ==============================
    弾発射
============================== */
function shoot() {
    if (!gameStarted) return;
    if (!canShoot) return;

    // 弾の初期位置(砲身の先)
    bullets.push({
        x: player.x + player.w / 2 - BULLET_WIDTH / 2,
        y: player.y - BULLET_HEIGHT,
    });

    // 連射制限
    canShoot = false;
    setTimeout(() => {
        canShoot = true;
    }, SHOOT_COOLDOWN);
}

/* ==============================
    起動
============================== */
loop();
