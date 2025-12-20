import pygame
import sys

pygame.init()

# ------------------------------
# ウィンドウ設定
# ------------------------------
WIDTH, HEIGHT = 600, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("ブロック無くし")
clock = pygame.time.Clock() #FPS制御専用クロック

# ------------------------------
# パドル設定
# ------------------------------
PADDLE_WIDTH = 120
PADDLE_HEIGHT = 20
PADDLE_COLOR = (50, 150, 255)
PADDLE_SPEED = 10
paddle_x = WIDTH // 2 - PADDLE_WIDTH // 2
paddle_y = HEIGHT - 60


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
    global paddle_x
    
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