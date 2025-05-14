import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

export default function Carousel({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  });

  return (
    <div className="relative overflow-hidden" style={{ width: "400px", height: "600px" }}>
      <div
        className="flex transition-transform ease-out duration-500"
        style={{
          transform: `translateX(-${curr * 100}%)`,
          width: "100%",
          height: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: "400px", height: "700px" }}
          >
            {slide}

          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button
          onClick={prev}
          className="p-2 rounded-full shadow bg-white/70 text-gray-800 hover:bg-white"
          style={{ width: "2.5rem", height: "2.5rem" }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full shadow bg-white/70 text-gray-800 hover:bg-white"
          style={{ width: "2.5rem", height: "2.5rem" }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      
    </div>
  );
}
