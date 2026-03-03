import { useState } from 'react';
import { Play, Focus, Clock, CheckCircle2, Download, MousePointerClick, Link, Shield, Heart, Sparkles, BookOpen, Brain, ChevronDown } from 'lucide-react';

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

    const scrollToGuide = () => {
        document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* ===== HERO SECTION ===== */}
            <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-purple-500/20 rounded-full animate-pulse">
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
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Start Focus Session
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-700/50 space-y-3">
                        <Feature icon={<Clock className="w-4 h-4 text-purple-400" />} text="Integrated Pomodoro Timer" />
                        <Feature icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />} text="Watch full playlists uninterrupted" />
                        <Feature icon={<Shield className="w-4 h-4 text-purple-400" />} text="Blocks all other YouTube distractions" />
                    </div>
                </div>

                {/* Scroll indicator */}
                <button
                    onClick={scrollToGuide}
                    className="absolute bottom-8 flex flex-col items-center gap-1 text-gray-500 hover:text-purple-400 transition-colors cursor-pointer animate-bounce"
                >
                    <span className="text-xs font-medium tracking-wider uppercase">How to use</span>
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>

            {/* ===== WHO IS THIS FOR ===== */}
            <section className="px-4 py-20 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Built for focus</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Who is this for?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        This is for every student who opens YouTube to study but ends up watching random videos for hours.
                        You have the potential to learn — you just need the right environment. We remove the distractions so you can focus on what matters.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <PersonaCard
                        icon={<BookOpen className="w-6 h-6" />}
                        title="Students"
                        description="Who want to watch lectures and tutorials without falling into the recommendation rabbit hole."
                    />
                    <PersonaCard
                        icon={<Brain className="w-6 h-6" />}
                        title="Self-learners"
                        description="Who use YouTube as their classroom but struggle to stay on a single topic for long."
                    />
                    <PersonaCard
                        icon={<Focus className="w-6 h-6" />}
                        title="Focused Minds"
                        description="Who know their potential but need a little help staying locked in during study sessions."
                    />
                </div>
            </section>

            {/* ===== HOW TO USE ===== */}
            <section id="how-to-use" className="px-4 py-20 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">How to Get Started</h2>
                    <p className="text-gray-400">Set up in under 2 minutes. Study distraction-free for hours.</p>
                </div>

                <div className="space-y-6">
                    <Step
                        number="1"
                        icon={<Download className="w-5 h-5" />}
                        title="Install the Chrome Extension"
                        description='Search for "YouTube Focus Study Player" on the Chrome Web Store and click "Add to Chrome". This extension blocks distracting YouTube content during your study sessions.'
                    />
                    <Step
                        number="2"
                        icon={<Link className="w-5 h-5" />}
                        title="Paste your YouTube link"
                        description="Come back to this website and paste the YouTube video or playlist URL you want to study from into the input box above."
                    />
                    <Step
                        number="3"
                        icon={<Play className="w-5 h-5" />}
                        title='Click "Start Focus Session"'
                        description="Hit the button and you'll enter a distraction-free player with your video. A Pomodoro timer will appear to help you manage study and break cycles."
                    />
                    <Step
                        number="4"
                        icon={<Shield className="w-5 h-5" />}
                        title="YouTube is now locked"
                        description="While your session is active, the extension blocks all other YouTube videos. If you try to open a different video, you'll be redirected back to the player. Stay focused!"
                    />
                    <Step
                        number="5"
                        icon={<MousePointerClick className="w-5 h-5" />}
                        title='Click "End Focus Session" when done'
                        description="Once you're done studying, click the End Focus Session button. YouTube will be unlocked and you're free to browse again."
                    />
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-gray-800 py-8 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>by</span>
                        <span className="font-semibold text-white">Saumya Jain</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                        © {new Date().getFullYear()} Focus Study Player. Stay focused, stay ahead.
                    </p>
                </div>
            </footer>
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

function Step({ number, icon, title, description }) {
    return (
        <div className="flex gap-4 items-start bg-gray-800/30 border border-gray-700/30 rounded-xl p-5 hover:border-purple-500/30 transition-all group">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 font-bold text-lg group-hover:bg-purple-600/30 transition-colors">
                {number}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-purple-400">{icon}</span>
                    <h3 className="font-semibold text-white text-base">{title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function PersonaCard({ icon, title, description }) {
    return (
        <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-6 text-center hover:border-purple-500/20 transition-all group">
            <div className="inline-flex p-3 bg-purple-500/10 rounded-xl text-purple-400 mb-4 group-hover:bg-purple-500/20 transition-colors">
                {icon}
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
