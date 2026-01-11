export default function NewsPage() {
    return (
        <main id="news" className="bg-black min-h-screen py-10 px-4 text-white">
            <h1 className="mb-10 text-center text-3xl font-bold text-white">News</h1>

            <div className="mx-auto max-w-3xl space-y-4">
                <article className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/60">2026-01-11</p>
                    <h2 className="mt-1 text-lg font-semibold">NAIGAMESローンチタイトル3作品完成</h2>
                    <p className="mt-2 text-white/80">「ブロック無くし」、「インベーダー無くし」、「落ちもの無くし」の3作品が完成しました。</p>
                </article>
            </div>
        </main>
    );
}