import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FocusPlayer from './components/FocusPlayer';

function App() {
  const [focusMedia, setFocusMedia] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const savedMediaData = localStorage.getItem('focusMedia');
    const savedIsFocusActive = localStorage.getItem('isFocusActive') === 'true';
    if (savedMediaData && savedIsFocusActive) {
      try {
        setFocusMedia(JSON.parse(savedMediaData));
        setIsFocusMode(true);
      } catch (e) {
        console.error("Failed to parse saved media data");
      }
    }
  }, []);

  const handleStartFocus = (mediaData) => {
    setFocusMedia(mediaData);
    setIsFocusMode(true);
    localStorage.setItem('focusMedia', JSON.stringify(mediaData));
    localStorage.setItem('isFocusActive', 'true');
    window.dispatchEvent(new CustomEvent('focus-session-start', { detail: { mediaData } }));
  };

  const handleEndFocus = () => {
    setFocusMedia(null);
    setIsFocusMode(false);
    localStorage.removeItem('focusMedia');
    // keep legacy key cleared too just in case
    localStorage.removeItem('focusVideoId');
    localStorage.setItem('isFocusActive', 'false');
    window.dispatchEvent(new CustomEvent('focus-session-end'));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased selection:bg-purple-500/30">
      {!isFocusMode ? (
        <Dashboard onStartFocus={handleStartFocus} />
      ) : (
        <FocusPlayer mediaData={focusMedia} onEndFocus={handleEndFocus} />
      )}
    </div>
  );
}

export default App;
