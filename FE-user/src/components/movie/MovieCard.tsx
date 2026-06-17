import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import type { Movie } from "../../types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="group relative block overflow-hidden rounded-2xl bg-zinc-900 transition-all hover:-translate-y-2">
      {/* Ảnh Poster */}
      <div className="aspect-2/3 w-full overflow-hidden">
        <img 
          src={movie.poster_url} 
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay khi hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
              <Play className="fill-white ml-1" size={20} />
           </div>
        </div>
      </div>

      {/* Thông tin phim */}
      <div className="p-4">
        <h3 className="truncate font-black uppercase italic tracking-tighter text-white group-hover:text-primary">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <span>{movie.release_date}</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" /> {movie.avg_score?.toFixed(1) || "N/A"}
          </div>
        </div>
      </div>
      
      {/* Nhãn loại phim (ví dụ 2D/IMAX) */}
      <div className="absolute top-3 right-3 rounded bg-black/60 px-2 py-1 text-[9px] font-bold backdrop-blur-md">
        IMAX
      </div>
    </Link>
  );
}