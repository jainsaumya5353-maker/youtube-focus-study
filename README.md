# YouTube Focus Study Player 🎯

A distraction-free "YouTube Focus Study Player" web app and Chrome Extension to help you watch ONLY one selected YouTube study video, while blocking all other YouTube content during focus sessions.

## Project Structure

1. `focus-study-player/`: The React Web App built with Vite and Tailwind CSS.
2. `focus-extension/`: The Manifest V3 Chrome Extension that enforces the focus mode.

## 🚀 How to Run Locally

### 1. Start the React Web App
1. Open a terminal and navigate to the web app directory:
   ```bash
   cd focus-study-player
   ```
2. Install dependencies (already installed if you rely on the environment setup):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided (default: `http://localhost:5173`).

### 2. Install the Chrome Extension
1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in the address bar.
3. Turn on **Developer mode** (toggle switch in the top right corner).
4. Click **Load unpacked** in the top left.
5. Select the `focus-extension` folder located in this repository.
6. The extension is now active!

## 🧪 How to use
1. Go to your local Web App (`http://localhost:5173`).
2. Type or paste any YouTube URL in the dashboard and click **Start Focus Session**.
3. A YouTube embedded player will appear with a draggable Pomodoro Timer overlay.
4. Try to open a new tab and go to `youtube.com` — the Chrome Extension will block the page and ask you to return to your study player as long as your focus session is active.
5. Click **End Focus Session** in the Web App to restore regular YouTube access.
