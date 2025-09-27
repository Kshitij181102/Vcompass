require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------
// Tokenization utilities
// -----------------------
const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','by','for','from','has','he','in','is','it','its','of','on','that','the','to','was','were','will','with','this','these','those','your','you','me','we','our','us'
]);

// Valid 3-letter terms that should be allowed
const VALID_THREE_LETTER_TERMS = new Set([
  'cdc', 'coe', 'srs', 'pe', 'lor', 'api', 'url', 'pdf', 'doc', 'txt', 'csv', 'xml', 'json'
]);

// Valid faculty names (3+ letters) that should be allowed as single words
const VALID_FACULTY_NAMES = new Set([
  'naveen', 'mahesh', 'ramesh', 'suresh', 'vinod', 'ashok', 'deepak', 'manikandan', 'saravanan',
  'venkatesh', 'balaji', 'gopal', 'kannan', 'murugan', 'perumal', 'rajendran', 'shanmugam',
  'thangavel', 'velmurugan', 'yogesh', 'aravind', 'bharath', 'chandru', 'dinesh', 'elango',
  'farooq', 'ganesan', 'hari', 'ilango', 'jagan', 'karthik', 'lokesh', 'anitha', 'bhavani',
  'kiran', 'rajeshwari', 'santhosh', 'prakash', 'poonkuzhali', 'gayathri', 'arun', 'sudha',
  'priya', 'radhika', 'karthikeyan', 'lavanya', 'sowmya', 'sriram', 'hussain', 'deepasikha',
  'saroj', 'asish', 'ravi', 'hari', 'nandha', 'sibi', 'sudhakar', 'aravapalli', 'devarakonda',
  'gopikrishnan', 'jonnadula', 'prabha', 'sandipan', 'ganesh', 'kumar', 'somya', 'vikash',
  'sanket', 'senthil', 'lalitha', 'chittipireddi', 'karthika', 'sheela', 'udit', 'kuppusamy',
  'divya', 'rohit', 'monali', 'manomita', 'reeja', 'muneeswari', 'dasari', 'atul', 'arindam',
  'bolem', 'rajesh', 'beebi', 'eswaraiah', 'nagendra', 'siddique', 'selva', 'jagadeesh', 'naga',
  'prashanth', 'rahul'
]);

// Incomplete query patterns
const INCOMPLETE_PATTERNS = [
  /^[a-z]{1,2}$/i,           // 1-2 letter words
  /^(hi|hey|hello|bye|ok|yes|no)$/i,  // Common short responses
  /^[^a-z]*$/i,              // Non-alphabetic only
  /^.{1,3}$/                 // Very short queries (1-3 characters)
];

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isIncompleteQuery(query) {
  const normalized = normalize(query);
  
  // Check if query is too short (1-2 characters)
  if (normalized.length <= 2) return true;
  
  // Check for 3-letter queries - allow only valid terms
  if (normalized.length === 3) {
    // Allow valid 3-letter terms
    if (VALID_THREE_LETTER_TERMS.has(normalized)) return false;
    // Allow valid faculty names that are 3 letters
    if (VALID_FACULTY_NAMES.has(normalized)) return false;
    // Reject other 3-letter queries
    return true;
  }
  
  // Check against incomplete patterns
  for (const pattern of INCOMPLETE_PATTERNS) {
    if (pattern.test(normalized)) return true;
  }
  
  // For single word queries, check if it's a valid faculty name
  const words = normalized.split(' ').filter(w => w.length > 0 && !STOPWORDS.has(w));
  if (words.length === 1) {
    // Allow single faculty names
    if (VALID_FACULTY_NAMES.has(words[0])) return false;
    // Allow single words that are 4+ characters (might be valid queries)
    if (words[0].length >= 4) return false;
    // Reject short single words that aren't faculty names
    return true;
  }
  
  return false;
}

function getPoliteResponse(query) {
  const responses = [
    "I'd be happy to help! Could you please provide more details about what you're looking for?",
    "I'm here to assist with campus-related questions. Could you please elaborate on your query?",
    "I'd love to help you find information! Could you please provide more specific details?",
    "I'm ready to help with campus information. Could you please give me more details about what you need?",
    "I can help you with campus-related questions. Could you please provide more context about your query?"
  ];
  
  // Return a random polite response
  return responses[Math.floor(Math.random() * responses.length)];
}

function tokenize(text) {
  const tokens = normalize(text)
    .split(' ')
    .filter(t => t && !STOPWORDS.has(t));
  // build unigrams + bigrams for better disambiguation
  const ngrams = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    ngrams.push(tokens[i] + ' ' + tokens[i + 1]);
  }
  return ngrams;
}

// -----------------------
// TF-IDF Index
// -----------------------
let documents = []; // { id, type, title, text, payload, tf: Map, len: number }
let df = new Map(); // term -> doc freq
let idf = new Map(); // term -> idf

function buildDocTF(tokens) {
  const tf = new Map();
  for (const tok of tokens) tf.set(tok, (tf.get(tok) || 0) + 1);
  // convert term counts to term frequency
  const total = Array.from(tf.values()).reduce((a, b) => a + b, 0) || 1;
  for (const [k, v] of tf.entries()) tf.set(k, v / total);
  return tf;
}

function dot(a, b) {
  let sum = 0;
  const [shorter, longer] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, va] of shorter.entries()) {
    const vb = longer.get(k);
    if (vb) sum += va * vb;
  }
  return sum;
}

function vectorLen(vec) {
  let s = 0;
  for (const v of vec.values()) s += v * v;
  return Math.sqrt(s) || 1;
}

function applyIDF(tfMap) {
  const weighted = new Map();
  for (const [term, tf] of tfMap.entries()) {
    const w = tf * (idf.get(term) || 0);
    if (w > 0) weighted.set(term, w);
  }
  return weighted;
}

function computeIDF() {
  idf = new Map();
  const N = documents.length || 1;
  for (const [term, dfi] of df.entries()) {
    // standard idf with smoothing
    idf.set(term, Math.log((1 + N) / (1 + dfi)) + 1);
  }
}

function indexDocuments(rawDocs) {
  documents = [];
  df = new Map();

  for (let i = 0; i < rawDocs.length; i++) {
    const d = rawDocs[i];
    const tokens = tokenize(d.text);
    const tf = buildDocTF(tokens);
    for (const term of tf.keys()) {
      df.set(term, (df.get(term) || 0) + 1);
    }
    const weighted = applyIDF(tf); // temporary, idf not ready yet; will recompute len later
    const len = vectorLen(weighted);
    documents.push({ id: i, ...d, tf, len });
  }
  computeIDF();
  // Recompute vector lengths with final IDF
  for (const d of documents) {
    const weighted = applyIDF(d.tf);
    d.len = vectorLen(weighted);
  }
}

function buildAnswerFromPayload(doc) {
  // Construct a concise, polite answer based on document type
  const p = doc.payload || {};
  // If a direct response is provided (Q&A style), prefer it
  if (typeof p.response === 'string' && p.response.trim()) {
    return p.response.trim();
  }
  switch (doc.type) {
    case 'professor': {
      const parts = [];
      if (p.name) parts.push(`${p.name}`);
      if (p.cabin || p.cabinNumber) parts.push(`Cabin: ${p.cabin || p.cabinNumber}`);
      if (p.department) parts.push(`Department: ${p.department}`);
      if (p.email) parts.push(`Email: ${p.email}`);
      return parts.join(' | ') || doc.text;
    }
    case 'office': {
      const parts = [];
      if (p.name) parts.push(`${p.name}`);
      if (p.location) parts.push(`Location: ${p.location}`);
      if (p.floor) parts.push(`Floor: ${p.floor}`);
      if (p.room) parts.push(`Room: ${p.room}`);
      if (p.email) parts.push(`Email: ${p.email}`);
      return parts.join(' | ') || doc.text;
    }
    case 'department': {
      const parts = [];
      if (p.name) parts.push(`${p.name}`);
      if (p.email) parts.push(`Email: ${p.email}`);
      if (p.phone) parts.push(`Phone: ${p.phone}`);
      if (p.location) parts.push(`Location: ${p.location}`);
      return parts.join(' | ') || doc.text;
    }
    default:
      return doc.text;
  }
}

function search(query, topK = 1) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const qtf = buildDocTF(qTokens);
  // apply idf
  const qWeighted = new Map();
  for (const [term, tfv] of qtf.entries()) {
    const w = tfv * (idf.get(term) || 0);
    if (w > 0) qWeighted.set(term, w);
  }
  const qLen = vectorLen(qWeighted);

  const scored = [];
  for (const d of documents) {
    const dWeighted = applyIDF(d.tf);
    const sim = dot(qWeighted, dWeighted) / (qLen * d.len || 1);
    if (sim > 0) {
      scored.push({ doc: d, score: sim });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

// -----------------------
// Gemini integration (optional)
// -----------------------
async function askGemini(prompt) {
  if (!GEMINI_API_KEY) {
    return null;
  }
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return text;
  } catch (_) {
    return null;
  }
}

// -----------------------
// Data loading
// -----------------------
const DATA_PATH = path.join(__dirname, 'data', 'campus_data.json');

function coalesceText(values) {
  return values.filter(Boolean).join(' ').trim();
}

function loadData() {
  let raw;
  try {
    raw = fs.readFileSync(DATA_PATH, 'utf-8');
  } catch (_) {
    console.warn('No campus_data.json found. Starting with empty dataset.');
    indexDocuments([]);
    return;
  }
  let json;
  try { json = JSON.parse(raw); } catch (e) {
    console.error('Failed to parse campus_data.json:', e.message);
    json = {};
  }

  const rawDocs = [];

  // Professors: either structured or Q&A style
  if (Array.isArray(json.professors)) {
    for (const p of json.professors) {
      if (p && (p.question || p.response)) {
        const title = p.question || 'Professor';
        const text = coalesceText([p.question, p.keywords, p.response]);
        rawDocs.push({ type: 'professor', title, text, payload: p });
      } else {
        const title = p.name || 'Professor';
        const text = coalesceText([
          p.name,
          p.department,
          p.cabin || p.cabinNumber,
          p.email
        ]);
        rawDocs.push({ type: 'professor', title, text, payload: p });
      }
    }
  }

  // Offices: either structured or Q&A style
  if (Array.isArray(json.offices)) {
    for (const o of json.offices) {
      if (o && (o.question || o.response)) {
        const title = o.question || 'Office';
        const text = coalesceText([o.question, o.keywords, o.response]);
        rawDocs.push({ type: 'office', title, text, payload: o });
      } else {
        const title = o.name || 'Office';
        const text = coalesceText([
          o.name,
          o.location,
          o.room,
          o.floor,
          o.email
        ]);
        rawDocs.push({ type: 'office', title, text, payload: o });
      }
    }
  }

  // Departments (e.g., placement): [{ name, email, phone, location }]
  if (Array.isArray(json.departments)) {
    for (const d of json.departments) {
      if (d && (d.question || d.response)) {
        const title = d.question || 'Department';
        const text = coalesceText([d.question, d.keywords, d.response]);
        rawDocs.push({ type: 'department', title, text, payload: d });
      } else {
        const title = d.name || 'Department';
        const text = coalesceText([
          d.name,
          d.location,
          d.email,
          d.phone
        ]);
        rawDocs.push({ type: 'department', title, text, payload: d });
      }
    }
  }

  // Placement/Training Q&A style arrays (e.g., placement_training)
  if (Array.isArray(json.placement_training)) {
    for (const e of json.placement_training) {
      const title = e.question || 'Placement/Training';
      const text = coalesceText([e.question, e.keywords, e.response]);
      rawDocs.push({ type: 'placement_training', title, text, payload: e });
    }
  }

  // Generic entries (key-value) if provided
  if (Array.isArray(json.entries)) {
    for (const e of json.entries) {
      const title = e.title || e.key || 'Entry';
      const value = e.value || '';
      const text = coalesceText([title, value]);
      rawDocs.push({ type: 'entry', title, text, payload: e });
    }
  }

  // Catch-all: any other top-level arrays with Q&A items
  for (const [key, value] of Object.entries(json)) {
    if (Array.isArray(value) && !['professors','offices','departments','placement_training','entries'].includes(key)) {
      for (const e of value) {
        if (e && (e.question || e.response)) {
          const title = e.question || key;
          const text = coalesceText([e.question, e.keywords, e.response]);
          rawDocs.push({ type: key, title, text, payload: e });
        }
      }
    }
  }

  indexDocuments(rawDocs);
}

loadData();

// -----------------------
// API
// -----------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'V-Compass', hasGemini: Boolean(GEMINI_API_KEY) });
});

app.post('/api/query', (req, res) => {
  const question = (req.body && req.body.question) || '';
  if (!question.trim()) {
    return res.json({
      reply: "Hello! I'm V-Compass. Please type a campus-related question.",
      found: false
    });
  }

  // Check for incomplete queries first
  if (isIncompleteQuery(question)) {
    return res.json({
      reply: getPoliteResponse(question),
      found: false,
      meta: { type: 'incomplete_query' }
    });
  }

  const results = search(question, 1);
  const BEST_THRESHOLD = 0.12; // tuned for small datasets

  // Keyword fallback: if similarity is low, try explicit keywords matching
  let hit = results[0];
  if (!hit || hit.score < BEST_THRESHOLD) {
    const qNorm = normalize(question);
    const qTokens = new Set(tokenize(question));
    for (const d of documents) {
      const kw = (d.payload && typeof d.payload.keywords === 'string') ? d.payload.keywords.toLowerCase() : '';
      if (!kw) continue;
      if (kw.includes(qNorm) || qNorm.includes(kw)) { hit = { doc: d, score: BEST_THRESHOLD }; break; }
      const kwTokens = new Set(kw.split(/[\s,]+/).filter(Boolean));
      const overlap = Array.from(qTokens).some(t => kwTokens.has(t));
      if (overlap) { hit = { doc: d, score: BEST_THRESHOLD }; break; }
    }
  }

  // If we have a local hit, build an answer and optionally verify/clarify via Gemini
  if (hit && hit.score >= BEST_THRESHOLD) {
    const localAnswer = buildAnswerFromPayload(hit.doc);
    const maybeUseGemini = async () => {
      const prompt = `You are V-Compass, a polite campus assistant. The user asked: "${question}". Based on campus records: "${localAnswer}". If this directly answers the question, respond concisely confirming it. If you can add a short helpful clarification, do so briefly. Never contradict the campus records.`;
      const g = await askGemini(prompt);
      return g || localAnswer;
    };
    return Promise.resolve(maybeUseGemini()).then(finalText => {
      res.json({ reply: finalText, found: true, meta: { type: hit.doc.type, title: hit.doc.title, verified: Boolean(GEMINI_API_KEY) } });
    });
  }

  // No local hit → optionally ask Gemini directly, else polite fallback
  const askDirect = async () => {
    const prompt = `You are V-Compass, a polite campus assistant. The user asked: "${question}". Our local records do not contain an exact match. Provide a concise, helpful answer if you can. If uncertain, say you may not have precise campus-specific info and suggest contacting relevant offices.`;
    const g = await askGemini(prompt);
    return g || "I'm sorry, I don't have that information in my records. Please try rephrasing or ask about professors, offices, or placement contacts.";
  };
  return Promise.resolve(askDirect()).then(text => {
    res.json({ reply: text, found: false, meta: { usedGemini: Boolean(GEMINI_API_KEY) } });
  });
});

// Optional: Reload data without restart
app.post('/api/reload', (req, res) => {
  try {
    loadData();
    res.json({ ok: true, count: documents.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`V-Compass running at http://localhost:${PORT}`);
});


