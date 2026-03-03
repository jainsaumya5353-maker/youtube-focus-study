// Listen for messages from the content script (fallback)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FOCUS_START') {
        chrome.storage.local.set({
            isFocusActive: true,
            focusMediaData: request.mediaData
        });
        console.log('[Focus BG] Focus session started via message');
    } else if (request.type === 'FOCUS_END') {
        chrome.storage.local.set({
            isFocusActive: false,
            focusMediaData: null
        });
        console.log('[Focus BG] Focus session ended via message');
    }
});

// Log storage changes for debugging
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.isFocusActive) {
        console.log('[Focus BG] Focus active changed:', changes.isFocusActive.newValue);
    }
});

// Intercept YouTube navigation
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // Only handle main frame navigation
    if (details.frameId !== 0) return;

    const url = new URL(details.url);

    // If it's a youtube URL
    if (url.hostname.includes('youtube.com')) {
        const data = await chrome.storage.local.get(['isFocusActive', 'focusMediaData']);

        console.log('[Focus BG] YouTube navigation detected. Focus active:', data.isFocusActive, 'Media:', data.focusMediaData);

        if (data.isFocusActive && data.focusMediaData) {
            const vParam = url.searchParams.get('v');
            const listParam = url.searchParams.get('list');
            const isEmbed = url.pathname.startsWith('/embed/');

            let isAllowedVideo = false;

            if (data.focusMediaData.type === 'playlist') {
                isAllowedVideo = (listParam === data.focusMediaData.listId) || (isEmbed && url.searchParams.get('list') === data.focusMediaData.listId);
            } else if (data.focusMediaData.type === 'video_playlist') {
                isAllowedVideo = (vParam === data.focusMediaData.videoId && listParam === data.focusMediaData.listId) ||
                    (isEmbed && url.pathname.includes(data.focusMediaData.videoId) && url.searchParams.get('list') === data.focusMediaData.listId);
            } else {
                isAllowedVideo = (url.pathname === '/watch' && vParam === data.focusMediaData.videoId) ||
                    (isEmbed && url.pathname.includes(data.focusMediaData.videoId));
            }

            if (!isAllowedVideo) {
                console.log('[Focus BG] ⛔ Blocking YouTube URL:', details.url);
                // Redirect to blocked page
                const idToPass = data.focusMediaData.videoId || 'list=' + data.focusMediaData.listId;
                const blockedUrl = chrome.runtime.getURL('blocked.html') + '?id=' + idToPass;
                chrome.tabs.update(details.tabId, { url: blockedUrl });
            } else {
                console.log('[Focus BG] ✅ Allowed YouTube URL:', details.url);
            }
        }
    }
}, { url: [{ hostContains: 'youtube.com' }] });
