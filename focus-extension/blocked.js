const FOCUS_PLAYER_URL = 'https://youtube-focus-study-private.vercel.app';

document.getElementById('return-btn').addEventListener('click', async () => {
    // Try to find an existing Focus Player tab and switch to it
    const tabs = await chrome.tabs.query({ url: FOCUS_PLAYER_URL + '/*' });

    if (tabs.length > 0) {
        // Focus the existing tab
        await chrome.tabs.update(tabs[0].id, { active: true });
        await chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
        // Open a new tab with the Focus Player
        await chrome.tabs.create({ url: FOCUS_PLAYER_URL });
    }
});
