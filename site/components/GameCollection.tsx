import Image from "next/image";
import Link from "next/link";

/**
 * ゲーム一覧データ
 */
const games = [
    {
        id: "block",
        title: "ブロック無くし",
        description: "ブロックを崩して無くすゲーム",
        image: "/games/block.png",
    },
    {
        id: "invader",
        title: "インベーダー無くし",
        description: "インベーダーを撃って無くすゲーム",
        image: "/games/invader.png",
    },
    {
        id: "ochimono",
        title: "落ちもの無くし",
        description: "落ちものを横に揃えて無くすゲーム",
        image: "/games/ochimono.png",
    },
];

export default function GameCollection() {
    return (
        <section className="bg-black py-16">
            <div className="mx-auto max-w-6xl px-4">

                {/* セクションタイトル */}
                <h2 className="mb-10 text-center text-3xl font-bold text-white">
                    Game Collection
                </h2>

                {/* ゲーム一覧 */}
                <div
                    className="
                        grid gap-8
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="rounded-xl bg-gray-900 overflow-hidden
                            shadow-lg hover:shadow-pink-500/30 transition"
                        >
                            {/* サムネ画像 */}
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={game.image}
                                    alt={game.title}
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>

                            {/* テキスト */}
                            <div className="p-5 text-white">
                                <h3 className="text-lg font-bold mb-2">
                                    {game.title}
                                </h3>

                                <p className="text-sm text-gray-300 mb-4">
                                    {game.description}
                                </p>

                                <Link
                                    href={`/games/$game.id`}
                                    className="inline-block w-full text-center
                                    rounded-lg bg-pink-500 hover:bg-pink-600
                                    py-2 text-sm font-semibold transition"
                                >
                                    今すぐプレイ！
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>
                
            </div>
        </section>
    );
}