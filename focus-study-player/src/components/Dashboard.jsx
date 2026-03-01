import { useState, useEffect } from 'react';
import { Play, Focus, Clock, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ onStartFocus }) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const parseYouTubeUrl = (inputUrl) => {
        try {
            const urlObj = new URL(inputUrl);
            const list = urlObj.searchParams.get('list');
            const v = urlObj.searchParams.get('v');

            if (urlObj.hostname.includes('youtube.com')) {
                if (urlObj.pathname === '/playlist' && list) return { type: 'playlist', listId: list };
                if (v && list) return { type: 'video_playlist', videoId: v, listId: list };
                if (v) return { type: 'video', videoId: v };
            } else if (urlObj.hostname === 'youtu.be') {
                const videoId = urlObj.pathname.slice(1);
                if (videoId && list) return { type: 'video_playlist', videoId, listId: list };
                if (videoId) return { type: 'video', videoId };
            }
        } catch (e) {
            // Fallback for simple ID or watch link regex
        }

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = inputUrl.match(regExp);
        if (match && match[2].length === 11) {
            return { type: 'video', videoId: match[2] };
        }

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) {
            setError('Please paste a YouTube URL');
            return;
        }
        const mediaData = parseYouTubeUrl(url);
        if (mediaData) {
            setError('');
            onStartFocus(mediaData);
        } else {
            setError('Invalid YouTube Video or Playlist URL');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-purple-500/20 rounded-full">
                        <Focus className="w-12 h-12 text-purple-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Focus Study Player</h1>
                <p className="text-gray-400 text-center mb-8 text-sm">Watch one video. Block the rest. Get things done.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste YouTube Video or Playlist Link here..."
                                className="w-full bg-gray-900/50 border border-gray-700 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2 ml-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Start Focus Session
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-700/50 space-y-3">
                    <Feature icon={<Clock className="w-4 h-4 text-purple-400" />} text="Integrated Pomodoro Timer" />
                    <Feature icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />} text="Watch full playlists uninterrupted" />
                    <Feature icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />} text="Forces single-video/playlist focus mode" />
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, text }) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-300">
            {icon}
            <span>{text}</span>
        </div>
    );
}
