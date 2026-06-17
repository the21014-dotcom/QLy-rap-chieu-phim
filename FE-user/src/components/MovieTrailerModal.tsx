
interface TrailerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieTrailerModal({ videoUrl, isOpen, onClose }: TrailerProps) {
  if (!isOpen) return null;

  // Hàm tách ID từ link youtube
  const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeID(videoUrl);

  return (
    <div 
      // 1. Thêm onClick vào lớp nền đen
      onClick={onClose} 
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <div 
        // 2. Quan trọng: Dùng e.stopPropagation() để khi bấm vào video KHÔNG bị thoát
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* 3. Đưa nút đóng vào bên trong góc phải để không bị Header che mất */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary transition-colors font-bold"
        >
          ✕
        </button>

        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            Link trailer không hợp lệ
          </div>
        )}
      </div>
    </div>
  );
}