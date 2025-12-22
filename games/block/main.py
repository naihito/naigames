import pygame
import sys

# ==================================================
# 初期化
# ==================================================
pygame.init()

WIDTH, HEIGHT = 600, 800    # 画面サイズ(幅/高さ)
screen = pygame.display.set_mode((WIDTH, HEIGHT))   # ウィンドウを作成
pygame.display.set_caption("ブロック無くし - NAIGAMES")    # ウィンドウのタイトル
clock = pygame.time.Clock() #FPS制御専用クロック

# ==================================================
# パドル設定
# ==================================================
PADDLE_WIDTH = 120  # 幅
PADDLE_HEIGHT = 20  # 高さ
PADDLE_COLOR = (50, 150, 255)   # カラー(青)
PADDLE_SPEED = 10   # 速度

paddle_x = WIDTH // 2 - PADDLE_WIDTH // 2   # 画面中央
paddle_y = HEIGHT - 60  # 画面下寄り

# ==================================================
# ボール設定
# ==================================================
BALL_RADIUS = 10    # 円の半径
BALL_COLOR = (255, 100, 255)    # カラー(ピンク)

ball_x = WIDTH // 2     # 中心座標(X)
ball_y = HEIGHT // 2    # 中心座標(Y)
ball_dx = 6     # 移動量(X)
ball_dy = -6    # 移動量(Y)

# ==================================================
# ブロック設定
# ==================================================
BLOCK_ROWS = 5
BLOCK_COLS = 7
BLOCK_WIDTH = 70
BLOCK_HEIGHT = 30
BLOCK_GAP = 10
BLOCK_COLOR = (255, 100, 100)

# ==================================================
# ブロック生成
# ==================================================
blocks = [] # ブロック管理用リスト

start_x = 25    # 左上の基準位置(X)
start_y = 60    # 左上の基準位置(Y)

for row in range(BLOCK_ROWS):
    for col in range(BLOCK_COLS):
        block_x = start_x + col * (BLOCK_WIDTH + BLOCK_GAP)
        block_y = start_y + row * (BLOCK_HEIGHT + BLOCK_GAP)
        
        block_rect = pygame.Rect(
            block_x,
            block_y,
            BLOCK_WIDTH,
            BLOCK_HEIGHT
        )
        blocks.append(block_rect)

# ==================================================
# イベント処理
# ==================================================
def handle_events() -> bool:
    """
    イベント処理
    
    :return: 終了の場合はFalse
    :rtype: bool
    """
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            return False
    return True

# ==================================================
# 更新処理(ロジック)
# ==================================================
def update():
    """
    ゲーム状態の更新
    """
    # 関数内でグローバル変数を書き換える
    global paddle_x, ball_x, ball_y, ball_dx, ball_dy
    
    # ------------------------------
    # パドル操作
    # ------------------------------    
    # 現在押されているキーの状態を配列で取得
    keys = pygame.key.get_pressed()

    # 左キーが押されている間、左に移動
    if keys[pygame.K_LEFT]:
        paddle_x -= PADDLE_SPEED
    # 右キーが押されている間、右に移動    
    if keys[pygame.K_RIGHT]:
        paddle_x += PADDLE_SPEED
    
    # 画面外制御
    if paddle_x < 0:
        paddle_x = 0
    if paddle_x > WIDTH - PADDLE_WIDTH:
        paddle_x = WIDTH - PADDLE_WIDTH

    # ------------------------------
    # ボール移動
    # ------------------------------    
    ball_x += ball_dx
    ball_y += ball_dy

    # ------------------------------
    # 壁反射
    # ------------------------------    
    # ボールの座標は「中心」のため、端まで行ったらではなく「端+半径」でぶつかる
    if ball_x <= BALL_RADIUS or ball_x >= WIDTH - BALL_RADIUS:
        ball_dx *= -1   # 進行方向(X)を反転
    if ball_y <= BALL_RADIUS:
        ball_dy *= -1   # 進行方向(Y)を反転

    # ------------------------------
    # 当たり判定用Rect
    # ------------------------------
    paddle_rect = pygame.Rect(
        paddle_x,
        paddle_y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    )
    ball_rect = pygame.Rect(
        ball_x - BALL_RADIUS,
        ball_y - BALL_RADIUS,
        BALL_RADIUS * 2,
        BALL_RADIUS * 2
    )
    
    # ------------------------------
    # パドルとの衝突
    # ------------------------------
    # Rect同士が重なっている & 下向きに動いている時だけ反射
    if ball_rect.colliderect(paddle_rect) and ball_dy > 0:
        ball_dy *= -1   # 進行方向(Y)を反転
        ball_y = paddle_y - BALL_RADIUS # めり込み防止

    # ------------------------------
    # ブロックとの衝突
    # ------------------------------
    # コピーを作ってループ(リスト変更エラー対策)
    for block in blocks[:]:
        if ball_rect.colliderect(block):
            blocks.remove(block)    # ブロックを消す
            ball_dy *= -1   # 進行方向(Y)を反転
            break   # 1フレームで複数ブロックに当たらないようにする
    
# ==================================================
# 描画処理
# ==================================================
def draw():
    """
    画面描画
    """
    screen.fill((10, 10, 30))
    
    # パドル描画
    pygame.draw.rect(
        screen,
        PADDLE_COLOR,
        (paddle_x, paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT)
    )
    
    # ボール描画
    pygame.draw.circle(
        screen,
        BALL_COLOR,
        (ball_x, ball_y),
        BALL_RADIUS
    )
    
    # ブロック描画
    for block in blocks:
        pygame.draw.rect(screen, BLOCK_COLOR, block)
    
    pygame.display.update()

# ==================================================
# メインループ
# ==================================================
def main():
    loop = True
    while loop:
        loop = handle_events()
        update()
        draw()
        clock.tick(60)
        
    pygame.quit()
    sys.exit()

# ==================================================
# エントリーポイント
# ==================================================
if __name__ == "__main__":
    main()