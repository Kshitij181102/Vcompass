import React, { useEffect, useRef, useState } from 'react';
import { Rss } from 'lucide-react';
import apis from '../../utils/apis';
import './NewsHeadlines.css';

const NewsHeadlines = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(apis().getNews, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch news');
        const news = await response.json();
        setData(news);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchNews();
    const id = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!data.length) return;
    const el = containerRef.current;
    if (!el) return;

    // Clone for seamless loop
    el.innerHTML = '';
    data.forEach(h => el.appendChild(makeItem(h)));
    data.forEach(h => el.appendChild(makeItem(h)));

    const step = () => {
      if (!isDragging && el) {
        el.scrollTop += 0.8;
        if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [data, isDragging]);

  const makeItem = (text) => {
    const div = document.createElement('div');
    div.className = 'vc-news__item';
    div.textContent = text;
    return div;
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setScrollTop(containerRef.current.scrollTop);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    containerRef.current.scrollTop = scrollTop - (e.clientY - startY);
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="vc-news">
      <div className="vc-news__label">
        <Rss size={14} strokeWidth={2} />
        Live Headlines
      </div>
      <div
        ref={containerRef}
        className="vc-news__feed"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
    </div>
  );
};

export default NewsHeadlines;
