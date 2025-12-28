

export default function Footer() {
    return (
        <footer className="bg-black text-gray-400 py-10">
            <div className="mx-auto max-w-6xl px-4">

                {/* 上段 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* ロゴ・サイト名 */}
                    <div className="text-center md:text-left">
                        <p className="text-lg font-bold text-white">
                            NAIGAMES
                        </p>
                        <p className="mt-1 text-sm">
                            オリジナルゲーム配信サイト※開発中
                        </p>
                    </div>

                    {/* リンク */}
                    <nav className="flex justify-center md:justify-end gap-6 text-sm">
                        <a href="#games" className="hover:text-white transition">
                            Games
                        </a>
                        <a href="#about" className="hover:text-white transition">
                            About
                        </a>
                        <a href="#contact" className="hover:text-white transition">
                            Contact
                        </a>
                    </nav>
                </div>

                {/* 下段 */}
                <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs">
                    © {new Date().getFullYear()} NAIGAMES. All rights reserved
                </div>

            </div>
        </footer>
    );
}