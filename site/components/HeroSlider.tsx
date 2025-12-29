"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


const heroImages = [
    {
        src: "/hero/block.png",
        alt: "ブロック無くし",
    },
    {
        src: "/hero/invader.png",
        alt: "インベーダー無くし",
    },
    {
        src: "/hero/ochimono.png",
        alt: "落ちもの無くし",
    },
];

const AUTO_SLIDE_INTERVAL = 5000;   // 自動スライド間隔(ms)
const RESUME_DELAY = 5000;  // 操作後に再開するまでの時間

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);    // 自動スライドのON/OFFを制御
    const [resumeTimer, setResumeTimer] = useState<NodeJS.Timeout | null>(null);
    
    const total = heroImages.length;

    /** 操作時の一時停止 */
    const pauseTemporarily = (delay = RESUME_DELAY) => {
        setIsPaused(true);  // まず停止状態へ

        // すでに再開予約があればキャンセル(連打してもタイマーが増殖しない)
        if (resumeTimer) {
            clearTimeout(resumeTimer);
        }

        // delay(ms)後にisPausedをfalseにして自動再開
        const timer = setTimeout(() => {
            setIsPaused(false);
        }, delay);

        // タイマーIDをstateに保存して、次の操作でキャンセルできるようにする
        setResumeTimer(timer);
    };
    
    /** 次へ */
    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
        pauseTemporarily();
    };

    /** 前へ */
    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
        pauseTemporarily();
    };

    /**
     * 自動スライド(ホバー&操作対応)
     */
    useEffect(() => {
        // 停止状態なら自動スライド用タイマーを作らない
        if (isPaused) return;

        // 関数型更新を使って一定間隔で次へ
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, AUTO_SLIDE_INTERVAL);

        // コンポーネント再描画や停止切り替えのたびに、古いintervalを必ず破棄する
        return () => clearInterval(timer);
    }, [isPaused, total]);  // 依存配列：isPausedが変わるたびに(停止/再開)、totalが変わるたびに(画像枚数が変わったら)

    return (
        <section className="bg-black">
            <div
                className="relative w-full"
                // PCでマウスが入るとホバー停止
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                {/* Hero画像 */}
                <div className="relative w-full h-[55vh] md:h-[calc(80vh-80px)] overflow-hidden">
                    <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-full h-full flex-shrink-0"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ◀︎ ボタン */}
                <button
                    onClick={goPrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2
                    bg-white/80 hover:bg-white text-black
                    w-12 h-12 rounded-full text-2xl font-bold
                    flex items-center justify-center shadow"
                >
                    ＜
                </button>

                {/* ▶︎ ボタン */}
                <button
                    onClick={goNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2
                    bg-white/80 hover:bg-white text-black
                    w-12 h-12 rounded-full text-2xl font-bold
                    flex items-center justify-center shadow"
                >
                    ＞
                </button>

                {/* 黒背景エリア */}
                <div className="bg-black py-6 flex flex-col items-center gap-4">
                    {/* CTA ボタン */}
                    <Link
                        href="#games"
                        className="inline-block px-6 py-3 text-base font-semibold
                        rounded-xl bg-pink-500 hover:bg-pink-600 transition
                        shadow-lg shadow-pink-500/50 text-white whitespace-nowrap"
                    >
                        NAIGAMESのゲームで遊ぶ！
                    </Link>

                    {/* ⚫︎ ページネーション */}
                    <div className="flex gap-3">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index)
                                    pauseTemporarily();
                                }}
                                className={`w-3 h-3 rounded-full transition ${
                                    index === currentIndex
                                        ? "bg-pink-500"
                                        : "bg-white/50 hover:bg-white"
                                }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
