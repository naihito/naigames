import pygame
import sys
from enum import Enum, auto

# ==================================================
# 初期化
# ==================================================
pygame.init()

WIDTH, HEIGHT = 600, 800    # 画面サイズ(幅/高さ)
screen = pygame.display.set_mode((WIDTH, HEIGHT))   # ウィンドウを作成
pygame.display.set_caption("ブロック無くし - NAIGAMES")    # ウィンドウのタイトル
clock = pygame.time.Clock() #FPS制御専用クロック

# ==================================================
# フォント
# ==================================================

font = pygame.font.SysFont(None, 32)    # 標準フォント
title_font = pygame.font.SysFont(None, 72)  # タイトル表示用フォント
sub_font = pygame.font.SysFont(None, 28)    # サブフォント

# ==================================================
# ゲーム状態(Enum)
# ==================================================
class GameState(Enum):
    TITLE = auto()
    PLAYING = auto()
    PAUSE = auto()
    CLEAR = auto()
    GAME_OVER = auto()

game_state = GameState.TITLE

# ==================================================
# パドル設定
# ==================================================
PADDLE_WIDTH = 120  # パドル幅
PADDLE_HEIGHT = 20  # パドル高さ
PADDLE_COLOR = (50, 150, 255)   # パドルカラー
PADDLE_SPEED = 10   # パドル移動速度

paddle_x = WIDTH // 2 - PADDLE_WIDTH // 2   # 画面中央
paddle_y = HEIGHT - 60  # 画面下寄り

# ==================================================
# ボール設定
# ==================================================
BALL_RADIUS = 10    # ボール半径
BALL_COLOR = (255, 100, 255)    # ボールカラー

ball_x = WIDTH // 2     # ボール位置中心座標(X)
ball_y = HEIGHT // 2    # ボール位置中心座標(Y)
ball_dx = 6     # ボール移動量(X)
ball_dy = -6    # ボール移動量(Y)

# ==================================================
# ブロック設定
# ==================================================
BLOCK_ROWS = 5  # ブロック行数
BLOCK_COLS = 7  # ブロック列数
BLOCK_WIDTH = 70    # ブロック幅
BLOCK_HEIGHT = 30   # ブロック高さ
BLOCK_GAP = 10  # ブロック間の余白
BLOCK_COLOR = (255, 100, 100)   # ブロックカラー

blocks = [] # ブロック管理用リスト

def create_blocks():
    blocks.clear()
    
    start_x = 25    # 左上の基準位置(X)
    start_y = 60    # 左上の基準位置(Y)

    # ブロック行×列でグリッド状に配置
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

create_blocks()

# ==================================================
# ステータス
# ==================================================
MAX_LIFE = 3    # 最大残機
life = MAX_LIFE # 現在の残機


# ==================================================
# リセット処理
# ==================================================
def reset_ball_and_paddle():
    global ball_x, ball_y, ball_dx, ball_dy, paddle_x
    ball_x = WIDTH // 2
    ball_y = HEIGHT // 2
    ball_dx = 6
    ball_dy = -6
    
    paddle_x = WIDTH // 2 - PADDLE_WIDTH // 2

# ==================================================
# ミス処理
# ==================================================
def handle_miss():
    global life, game_state
    
    life -= 1   # 残機を減らす
    
    # lifeが0 = GAME_OVER
    if life <= 0:
        game_state = GameState.GAME_OVER
    else:
        reset_ball_and_paddle()
        
    reset_ball_and_paddle() # 初期状態に戻す

# ==================================================
# イベント処理
# ==================================================
def handle_events() -> bool:
    """
    イベント処理
    
    :return: 終了の場合はFalse
    :rtype: bool
    """
    global game_state, life
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            return False
        
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if game_state in (
                    GameState.TITLE,
                    GameState.CLEAR,
                    GameState.GAME_OVER,
                ):
                    life = MAX_LIFE # 再スタート時に残機リセット
                    reset_ball_and_paddle() # プレイ開始位置へ戻す
                    create_blocks() # ブロック生成
                    game_state = GameState.PLAYING  # ゲームスタート

    return True

# ==================================================
# 更新処理
# ==================================================
def update():
    # 関数内でグローバル変数を書き換える
    global paddle_x, ball_x, ball_y, ball_dx, ball_dy
    global life, game_state
    
    # Playingの状態以外は更新しない
    if game_state != GameState.PLAYING:
        return
    
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
    # ボールの座標は「中心」のため、端まで行ったらではなく「端 + 半径」でぶつかる
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

    # ------------------------------
    # クリア判定
    # ------------------------------
    # 現存するブロックが0個 = 全破壊
    if len(blocks) == 0:
        game_state = GameState.CLEAR

    # ------------------------------
    # ミス判定(ボール落下)
    # ------------------------------
    if ball_y > HEIGHT:
        handle_miss()
    
# ==================================================
# 描画処理
# ==================================================
def draw():
    screen.fill((10, 10, 30))
    
    # ------------------------------
    # パドル描画
    # ------------------------------
    pygame.draw.rect(
        screen,
        PADDLE_COLOR,
        (paddle_x, paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT)
    )
    
    # ------------------------------
    # ボール描画
    # ------------------------------
    pygame.draw.circle(
        screen,
        BALL_COLOR,
        (ball_x, ball_y),
        BALL_RADIUS
    )
    
    # ------------------------------
    # ブロック描画
    # ------------------------------
    for block in blocks:
        pygame.draw.rect(screen, BLOCK_COLOR, block)

    # ------------------------------
    # LIFE表示
    # ------------------------------
    #文字は直接描けないため画像に変換する
    life_text = font.render(f"LIFE: {life}", True, (255, 255, 255))

    # 画像をscreenに貼り付ける
    screen.blit(life_text, (20, 20))    # 左上に表示

    # ------------------------------
    # TITLE
    # ------------------------------
    if game_state == GameState.TITLE:
        title_text = title_font.render(
            "BLOCK NAKUSHI", True, (255, 255, 255)
        )
        sub_text = sub_font.render(
            "PRESS SPACE TO START", True, (180, 180, 180)
        )
        
        title_rect = title_text.get_rect(
            center=(WIDTH // 2, HEIGHT // 2 - 40)
        )
        sub_rect = sub_text.get_rect(
            center=(WIDTH // 2, HEIGHT // 2 + 30)
        )
        
        screen.blit(title_text, title_rect)
        screen.blit(sub_text, sub_rect)

    # ------------------------------
    # CLEAR
    # ------------------------------
    if game_state == GameState.CLEAR:
        clear_text = font.render("CLEAR!", True, (255, 255, 0))
        text_rect = clear_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))   # 文字を画面中央に配置
        screen.blit(clear_text, text_rect)

    # ------------------------------
    # GAME OVER
    # ------------------------------
    if game_state == GameState.GAME_OVER:
        game_over_text = font.render("GAME OVER", True, (255, 60, 60))
        text_rect = game_over_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))   # 文字を画面中央に配置
        screen.blit(game_over_text, text_rect)
    
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
    