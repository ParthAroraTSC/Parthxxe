import { searchMedia } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q: query } = await searchParams;
  const results = await searchMedia(query || "");

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen bg-black">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-white">
        Search Results for &quot;{query}&quot;
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
          {results.map((item: any) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg">No results found.</p>
      )}
    </div>
  );
}
