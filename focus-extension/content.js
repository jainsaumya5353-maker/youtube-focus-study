// This content script runs on the Focus Study Player web app
// (https://youtube-focus-study-private.vercel.app)
//
// It reads localStorage (shared with the React app) and syncs
// focus session state to chrome.storage.local for the background
// script to use when blocking YouTube.

const SYNC_INTERVAL = 1000; // Check every 1 second
let lastSyncedState = null;

function syncFocusState() {
    try {
        // Guard: make sure the extension context is still valid
        if (!chrome || !chrome.runtime || !chrome.runtime.id) {
            return;
        }

        // Read directly from localStorage (shared with the React app)
        const isFocusActive = localStorage.getItem('isFocusActive') === 'true';
        const focusMediaRaw = localStorage.getItem('focusMedia');

        let focusMedia = null;
        if (focusMediaRaw) {
            try {
                focusMedia = JSON.parse(focusMediaRaw);
            } catch (e) {
                // Invalid JSON, treat as no media
            }
        }

        // Build a state fingerprint to avoid redundant messages
        const stateKey = JSON.stringify({ isFocusActive, focusMedia });
        if (stateKey === lastSyncedState) {
            return; // Nothing changed
        }
        lastSyncedState = stateKey;

        // Sync to chrome.storage.local (used by background.js for blocking)
        if (isFocusActive && focusMedia) {
            chrome.storage.local.set({
                isFocusActive: true,
                focusMediaData: focusMedia
            }, () => {
                console.log('[Focus Extension] ✅ Focus session synced — blocking enabled');
            });
        } else {
            chrome.storage.local.set({
                isFocusActive: false,
                focusMediaData: null
            }, () => {
                console.log('[Focus Extension] ⏹ Focus session ended — blocking disabled');
            });
        }
    } catch (err) {
        console.warn('[Focus Extension] Sync error:', err.message);
    }
}

// Sync immediately on page load
syncFocusState();

// Poll every second to catch state changes
setInterval(syncFocusState, SYNC_INTERVAL);

// Also sync on localStorage changes from other tabs
window.addEventListener('storage', syncFocusState);
