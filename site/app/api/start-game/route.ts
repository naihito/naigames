import { NextResponse } from "next/server";
import { spawn } from "child_process";  // Node.jsから別プロセスを起動
import path from "path";

export async function POST(req: Request) {
    // 「今すぐプレイ！」を押して送られた{ gameId }を受け取る
    const { gameId } = await req.json();

    // OS依存をなくす
    const gameMap: Record<string, string> = {
        block: path.resolve(process.cwd(), "..", "games", "block", "main.py"),
    };

    const gamePath = gameMap[gameId];
    console.log("[API] lanching:", { gameId, gamePath });

    const pythonPath = path.resolve(
        process.cwd(),
        "..",
        "games",
        "block",
        "venv",
        "bin",
        "python"
    );

    // Node.jsからPythonを起動 → main.pyがそのまま実行 → Pygame側がTITLE状態で起動
    spawn(pythonPath, [gamePath], {
        detached: true, // Next.jsとPythonを完全に分離(Webサーバーが止まってもゲームは生きる)
        stdio: "ignore",
    }).unref(); // Node.js側がPythonを待たない

    return NextResponse.json({ ok: true, started: gameId });
}
