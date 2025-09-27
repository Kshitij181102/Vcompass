V-Compass – Campus Chatbot

Overview
V-Compass is a simple campus chatbot. It tokenizes queries, uses TF‑IDF + cosine similarity to search your JSON data, and responds politely. If no relevant info is found, it returns a courteous fallback.

Features
- Tokenization with unigrams + bigrams and stopword filtering
- TF‑IDF + cosine similarity for efficient matching
- White/light-brown UI with a brain favicon
- Welcome message introducing V-Compass
- Polite fallback when data is missing
- Reload endpoint to re-index data without restart

Structure
- public/ — Frontend (HTML/CSS/JS, favicon)
- server.js — Express server + tokenizer + TF‑IDF index + API
- data/campus_data.json — Your data file (sample included)
- package.json — Scripts and dependencies

Data format
- professors: { name, department?, cabinNumber? | cabin?, email? }
- offices: { name, location?, room?, floor?, email? }
- departments: { name, email?, phone?, location? }
- entries: { title? | key?, value? }

Example
{
  "professors": [
    { "name": "Dr. A. Sharma", "department": "Computer Science", "cabinNumber": "CS-210", "email": "a.sharma@university.edu" }
  ],
  "offices": [
    { "name": "Admissions Office", "location": "Main Building, Ground Floor", "room": "G-05", "email": "admissions@university.edu" }
  ],
  "departments": [
    { "name": "Placement Cell", "email": "placements@university.edu", "phone": "+91-98765-43210", "location": "Admin Block, 2nd Floor" }
  ]
}

Run locally
1) Install Node.js 18+
2) Install dependencies: npm install
3) Set your Gemini API key (optional, for verification/fallback):
   - PowerShell (current session only):
     $env:GEMINI_API_KEY="YOUR_KEY"
   - Or create a .env file at project root:
     GEMINI_API_KEY=YOUR_KEY
4) Start the server: npm start
4) Open http://localhost:3000

Embed on any website
Add this script tag to your website, just before </body>. It renders a floating button in the bottom-right; clicking it opens a chatbox iframe.

```html
<script>
  // Optional: if backend is on a different origin, set it here
  window.VCOMPASS_ORIGIN = 'http://localhost:3000';
  // Optional: custom icon
  // window.VCOMPASS_ICON_URL = 'https://your.cdn/icon.svg';
  // The script below loads the floating widget button and chatbox
</script>
<script src="http://localhost:3000/widget.js" defer></script>
```

If your site uses HTTPS and your bot runs elsewhere, host `widget.js` and `embed.html` on the same domain as your bot, and set `VCOMPASS_ORIGIN` to that domain.

Reload data without restart
Edit data/campus_data.json, then POST to /api/reload.

Tuning
- Adjust BEST_THRESHOLD in server.js to change match strictness.


