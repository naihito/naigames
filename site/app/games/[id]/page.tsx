export function generateStaticParams() {
    return [
        { id: "block" },
        { id: "invader" },
        { id: "ochimono" },
    ];
}

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function GamePage({ params }: Props) {
    const { id } = await params;

    if (!id) {
        return (
            <main className="bg-black min-h-screen flex items-center justify-center text-white">
                Game not found
            </main>
        );
    }

    return (
        <main className="bg-black min-h-screen py-10 px-4 text-white">
            <h1 className="mb-6 text-center text-2xl font-bold">
                {id.toUpperCase()}
            </h1>

            <iframe
                src={`/games/${id}/index.html`}
                className="w-full h-[80vh] border-0"       
            />
        </main>
    );
}
