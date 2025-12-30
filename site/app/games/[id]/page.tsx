// Next.jsのApp Routerの「動的ルート用」専用の名前
// Next.jsが「どのパラメータのパターンでページを事前ビルドすればいいか」知ることができる
export function generateStaticParams() {
    // 「この配列に含まれるパラメータのパターンでページを性的生成して」という指示
    // URLの[id]パラメータに入るパターン
    return [
        { id: "block" },
        { id: "invader" },
        { id: "ochimono" },
    ];
}

// コンポーネントに渡ってくる引数(プロパティ)の型を定義
type Props = {
    // paramsは「idという文字列を持つオブジェクト」がPromise(非同期で返ってくるもの)として渡されるという型
    params: Promise<{
        id: string;
    }>;
};

// ページコンポーネント(非同期関数)
export default async function GamePage({ params }: Props) {
    // paramsはPromiseなので、実際の中身が返ってくる(アクセスされる)まで待つ
    const { id } = await params;

    // idが無い場合は、「ゲームが見つかりませんでした」と表示(エラーハンドリング)
    if (!id) {
        return (
            <main className="bg-black min-h-screen flex items-center justify-center text-white">
                Game not found
            </main>
        );
    }

    // ゲームが表示される本体
    return (
        <main className="bg-black min-h-screen py-3 px-4 text-white">

            {/* ページの中に別ページを埋め込む */}
            <iframe
                src={`/games/${id}/index.html`}
                className="w-full h-[80vh] border-0"       
            />

        </main>
    );
}
