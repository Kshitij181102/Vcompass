import React, { useEffect, useRef, useState } from 'react';
import apis from '../../utils/apis';

const NewsHeadlines = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(apis().getNews, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch News');
        }
        const news = await response.json();
        setData(news);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchNews();

    const intervalId = setInterval(fetchNews, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const headlines = data;

  useEffect(() => {
    const scrollContainer = containerRef.current;

    const cloneHeadlines = () => {
      scrollContainer.innerHTML += scrollContainer.innerHTML;
    };

    cloneHeadlines();

    const startScrolling = () => {
      const step = () => {
        if (!isDragging) {
          scrollContainer.scrollTop += 1;
          if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
            scrollContainer.scrollTop = 0;
          }
        }
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    startScrolling();
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY - scrollTop);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dy = e.clientY - startY;
      containerRef.current.scrollTop = scrollTop - dy;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold text-[#8B5E3C] mb-2">Headlines</div>

      <div
        ref={containerRef}
        className="relative w-[400px] h-96 overflow-hidden bg-[#FAF3E0] border-2 border-[#8B5E3C] mt-2 rounded-lg shadow-md"
        style={{ display: 'flex', flexDirection: 'column' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {headlines.map((headline, index) => (
          <div
            key={index}
            className="p-2 text-center text-[#4A2C12] bg-[#FFF5EB] border-b border-[#8B5E3C]"
            style={{ whiteSpace: 'normal' }}
          >
            {headline}
          </div>
        ))}
        {headlines.map((headline, index) => (
          <div
            key={index + headlines.length}
            className="p-2 text-center text-[#4A2C12] bg-[#FFF5EB] border-b border-[#8B5E3C]"
            style={{ whiteSpace: 'normal' }}
          >
            {headline}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsHeadlines;
