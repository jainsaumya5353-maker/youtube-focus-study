document.getElementById('return-btn').addEventListener('click', () => {
    // Let the background script or default behavior handle it, or just close the tab if opened in new tab.
    // Actually, if they navigate to a blocked page, they might want to go back to the react app.
    // If the React app is at localhost:5173, we can redirect there.
    window.location.href = 'http://localhost:5173/';
});
