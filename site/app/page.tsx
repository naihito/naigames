import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-black">

      {/* Hero画像 */}
      <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <Image
          src="/hero/block-nakushi.png"
          alt="Block Nakushi"
          fill
          className="object-contain"
          priority
        />

        {/* CTAボタン */}
        <div className="absolute bottom-0">
          <Link
            href="/games"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-x1 bg-pink-500 hover:bg-pink-600 transition shadow-lg shadow-pink-500/50 text-white"
          >
            ゲームをプレイする
          </Link>
        </div>
      </div>

    </section>
  );
}
