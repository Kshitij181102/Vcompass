// Vercel serverless function for chatbot
const fs = require('fs');
const path = require('path');

// Simple TF-IDF implementation for chatbot
class SimpleTFIDF {
  constructor() {
    this.documents = [];
    this.vocabulary = new Set();
    this.idf = {};
    this.tfidf = [];
  }

  addDocument(doc) {
    const words = this.tokenize(doc.toLowerCase());
    this.documents.push({ words, original: doc });
    words.forEach(word => this.vocabulary.add(word));
  }

  tokenize(text) {
    return text.match(/\b\w+\b/g) || [];
  }

  computeIDF() {
    const docCount = this.documents.length;
    this.vocabulary.forEach(word => {
      const docsWithWord = this.documents.filter(doc => 
        doc.words.includes(word)
      ).length;
      this.idf[word] = Math.log(docCount / docsWithWord);
    });
  }

  computeTFIDF() {
    this.tfidf = this.documents.map(doc => {
      const tf = {};
      doc.words.forEach(word => {
        tf[word] = (tf[word] || 0) + 1;
      });
      
      const tfidfDoc = {};
      Object.keys(tf).forEach(word => {
        tfidfDoc[word] = (tf[word] / doc.words.length) * this.idf[word];
      });
      
      return tfidfDoc;
    });
  }

  search(query, limit = 5) {
    const queryWords = this.tokenize(query.toLowerCase());
    const queryTF = {};
    queryWords.forEach(word => {
      queryTF[word] = (queryTF[word] || 0) + 1;
    });

    const queryTFIDF = {};
    Object.keys(queryTF).forEach(word => {
      if (this.idf[word]) {
        queryTFIDF[word] = (queryTF[word] / queryWords.length) * this.idf[word];
      }
    });

    const scores = this.tfidf.map((docTFIDF, index) => {
      let score = 0;
      Object.keys(queryTFIDF).forEach(word => {
        if (docTFIDF[word]) {
          score += queryTFIDF[word] * docTFIDF[word];
        }
      });
      return { index, score };
    });

    return scores
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        document: this.documents[item.index].original,
        score: item.score
      }));
  }
}

// Sample campus data
const campusData = {
  "professors": [
    {
      "question": "Where is Dr. Smith's office?",
      "keywords": "dr smith, office, location",
      "response": "Dr. Smith's office is in Engineering Building, Room 201."
    },
    {
      "question": "What are the library hours?",
      "keywords": "library, hours, timing, open, close",
      "response": "The library is open Monday-Friday 8 AM to 10 PM, and weekends 10 AM to 6 PM."
    }
  ]
};

let searchEngine = null;

function initializeSearchEngine() {
  if (searchEngine) return searchEngine;
  
  searchEngine = new SimpleTFIDF();
  
  campusData.professors.forEach(item => {
    searchEngine.addDocument(item.keywords + ' ' + item.question);
  });
  
  searchEngine.computeIDF();
  searchEngine.computeTFIDF();
  
  return searchEngine;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'V-Compass Chatbot API is running',
      timestamp: new Date().toISOString()
    });
  }

  // Handle chat queries
  if (req.method === 'POST') {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const engine = initializeSearchEngine();
    const results = engine.search(query, 3);
    
    if (results.length > 0) {
      const bestMatch = campusData.professors.find(item => 
        results[0].document.includes(item.keywords)
      );
      
      return res.status(200).json({
        response: bestMatch ? bestMatch.response : "I found some information but couldn't provide a specific answer.",
        confidence: results[0].score
      });
    } else {
      return res.status(200).json({
        response: "I'm sorry, I don't have information about that. Could you try rephrasing your question?",
        confidence: 0
      });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}