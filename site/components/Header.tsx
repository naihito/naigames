"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">

                {/* ロゴ */}
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="NAIGAMES Logo"
                        width={200}
                        height={200}
                    />
                </Link>

                {/* メニュー */}
                <nav className="flex gap-8 text-lg font-midium text-gray-700">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <Link href="/games" className="hover:text-black">Games</Link>
                    <Link href="/about" className="hover:text-black">About</Link>
                    <Link href="/contact" className="hover:text-black">Contact</Link>
                </nav>

            </div>
        </header>
    );
}