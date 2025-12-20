"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Heroに表示する画像一覧
 * 今後はここに追加・差し替えするだけでOK
 */
const heroImages = [
    { src: "/hero/block.png", alt: "ブロック無くし" },
    { src: "/hero/invader.png", alt: "インベーダー無くし" },
    { src: "/hero/ochimono.png", alt: "落ちもの無くし" },
];

// 自動スライド間隔(ms)
const AUTO_SLIDE_INTERVAL = 5000;

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = heroImages.length;

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    /**
     * 自動スライド
     */
    useEffect(() => {
        const timer = setInterval(() => {
            // goNext();
            setCurrentIndex((prev) => (prev + 1) % total);
        }, AUTO_SLIDE_INTERVAL);

        // クリーンアップ
        return () => clearInterval(timer);
    }, [total]);

    return (
        <section className="bg-black">
            <div className="relative w-full">

                {/* Hero画像 */}
                <div className="relative w-full h-[55vh] md:h-[calc(100vh-80px)] overflow-hidden">
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

                </button>

                {/* ▶︎ ボタン */}
                <button
                    onClick={goNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2
                    bg-white/80 hover:bg-white text-black
                    w-12 h-12 rounded-full text-2xl font-bold
                    flex items-center justify-center shadow"
                >

                </button>

                {/* 黒背景エリア */}
                <div className="bg-black py-6 flex flex-col items-center gap-4">
                    {/* CTA ボタン */}
                    <Link
                        href="/games"
                        className="inline-block px-6 py-3 text-base font-semibold
                        rounded-xl bg-pink-500 hover:bg-pink-600 transition
                        shadow-lg shadow-pink-500/50 text-white whitespace-nowrap"
                    >
                        今すぐプレイ！
                    </Link>

                    {/* ⚫︎ ページネーション */}
                    <div className="flex gap-3">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
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
