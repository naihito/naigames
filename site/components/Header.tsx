"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="mx-auto max-w-6xl px-6 py-4">

                {/* ロゴ */}
                <Link
                    href="/"
                    className="flex items-center justify-center gap-3 md:justify-start"
                >
                    <Image
                        src="/logo.png"
                        alt="NAIGAMES Logo"
                        width={200}
                        height={200}
                    />
                </Link>

                {/* メニュー */}
                <nav className="mt-2 flex justify-center gap-6 text-lg font-midium text-gray-700 md:mt-0 md:justify-end">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <Link href="#games" className="hover:text-black">Games</Link>
                    <Link href="#news" className="hover:text-black">News</Link>
                </nav>

            </div>
        </header>
    );
}