import PomodoroTimer from './PomodoroTimer';
import { LogOut } from 'lucide-react';

export default function FocusPlayer({ mediaData, onEndFocus }) {
    let iframeSrc = '';

    // Check if mediaData object exists just to be safe
    if (mediaData) {
        if (mediaData.type === 'playlist') {
            iframeSrc = `https://www.youtube.com/embed/videoseries?list=${mediaData.listId}&autoplay=1&rel=0&modestbranding=1&controls=1`;
        } else if (mediaData.type === 'video_playlist') {
            iframeSrc = `https://www.youtube.com/embed/${mediaData.videoId}?listType=playlist&list=${mediaData.listId}&autoplay=1&rel=0&modestbranding=1&controls=1`;
        } else {
            // Standalone video
            iframeSrc = `https://www.youtube.com/embed/${mediaData.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`;
        }
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full h-full pointer-events-auto">
                <iframe
                    src={iframeSrc}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                ></iframe>
            </div>

            <PomodoroTimer />

            <button
                onClick={onEndFocus}
                className="absolute bottom-6 left-6 flex items-center gap-2 bg-red-600/80 hover:bg-red-500/90 text-white px-5 py-3 rounded-xl backdrop-blur-md shadow-2xl transition-all font-medium border border-red-500/30 z-50 group hover:scale-105"
            >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                End Focus Session
            </button>
        </div>
    );
}
