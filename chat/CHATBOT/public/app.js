const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('question');

function addMessage(text, who) {
  const wrap = document.createElement('div');
  wrap.className = `msg msg--${who}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg__bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Welcome message
addMessage("Hello! I'm V-Compass, your campus chatbot. I'm ready to answer campus-related queries.", 'bot');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = inputEl.value.trim();
  if (!q) return;
  addMessage(q, 'user');
  inputEl.value = '';

  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    addMessage(data.reply || "Sorry, I couldn't process that.", 'bot');
  } catch (e) {
    addMessage('Sorry, something went wrong. Please try again.', 'bot');
  }
});



