import pygame
import sys

# Pygameの初期化
pygame.init()

# ------------------------------
# ウィンドウ設定
# ------------------------------
WIDTH, HEIGHT = 600, 800    # 画面サイズ(幅/高さ)
screen = pygame.display.set_mode((WIDTH, HEIGHT))   # ウィンドウを作成
pygame.display.set_caption("ブロック無くし")    # ウィンドウのタイトル
clock = pygame.time.Clock() #FPS制御専用クロック

# ------------------------------
# パドル設定
# ------------------------------
PADDLE_WIDTH = 120  # 幅
PADDLE_HEIGHT = 20  # 高さ
PADDLE_COLOR = (50, 150, 255)   # カラー(青)
PADDLE_SPEED = 10   # 速度
paddle_x = WIDTH // 2 - PADDLE_WIDTH // 2   # 画面中央
paddle_y = HEIGHT - 60  # 画面下寄り

# ------------------------------
# ボール設定
# ------------------------------
BALL_RADIUS = 10    # 円の半径
BALL_COLOR = (255, 100, 255)    # カラー(ピンク)
ball_x = WIDTH // 2     # 中心座標(X)
ball_y = HEIGHT // 2    # 中心座標(Y)
ball_dx = 6     # 移動量(X)
ball_dy = -6    # 移動量(Y)

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


def update():
    """
    ゲーム状態の更新
    """
    # 関数内でグローバル変数を書き換える
    global paddle_x, ball_x, ball_y, ball_dx, ball_dy
    
    # ------------------------------
    # パドル操作
    # ------------------------------    
    # 現在推されているキーの状態を配列で取得
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

    # 壁反射(ボールの座標は「中心」のため、端まで行ったらではなく「端+半径」でぶつかる)
    if ball_x <= BALL_RADIUS or ball_x >= WIDTH - BALL_RADIUS:
        ball_dx *= -1   # 進行方向(X)を反転
    if ball_y <= BALL_RADIUS:
        ball_dy *= -1   # 進行方向(Y)を反転
    
def draw():
    """
    画面描画
    """
    screen.fill((10, 10, 30))
    
    # パドル
    pygame.draw.rect(
        screen,
        PADDLE_COLOR,
        (paddle_x, paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT)
    )
    
    # ボール
    pygame.draw.circle(
        screen,
        BALL_COLOR,
        (ball_x, ball_y),
        BALL_RADIUS
    )
    
    pygame.display.update()


def main():
    gameloop = True
    while gameloop:
        gameloop = handle_events()
        update()
        draw()
        clock.tick(60)
        
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()