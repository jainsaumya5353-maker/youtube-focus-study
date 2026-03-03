const FOCUS_PLAYER_URL = 'https://youtube-focus-study-private.vercel.app';

// Check current focus status
async function updateStatus() {
    const data = await chrome.storage.local.get(['isFocusActive', 'focusMediaData']);
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    const mediaInfo = document.getElementById('media-info');

    if (data.isFocusActive && data.focusMediaData) {
        dot.className = 'status-dot active';
        text.textContent = 'Focus Session Active';

        // Show what they're studying
        const media = data.focusMediaData;
        if (media.type === 'playlist') {
            mediaInfo.textContent = '📋 Playlist locked';
        } else if (media.type === 'video_playlist') {
            mediaInfo.textContent = '🎬 Video + Playlist locked';
        } else {
            mediaInfo.textContent = '🎬 Single video locked';
        }
        mediaInfo.style.display = 'block';
    } else {
        dot.className = 'status-dot inactive';
        text.textContent = 'No active session';
        mediaInfo.style.display = 'none';
    }
}

// Open Focus Player in a new tab or focus existing one
document.getElementById('open-btn').addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ url: FOCUS_PLAYER_URL + '/*' });

    if (tabs.length > 0) {
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
        await chrome.tabs.create({ url: FOCUS_PLAYER_URL });
    }

    window.close();
});

updateStatus();
