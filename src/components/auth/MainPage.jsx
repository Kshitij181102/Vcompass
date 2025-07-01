import Navbar from '../ui/NavBar';
import NewsHeadlines from '../ui/NewsHeadLines';
import ImageSlider from '../ui/Carousel';
import Footer from '../ui/Footer';
import { useState,useEffect } from 'react';
import apis from '../../utils/apis';
const MainPage=()=> {
const [Poster, setData] = useState([]);
  
  useEffect(() => {
    const fetchPoster = async () => {
        try {
            const response = await fetch(apis().getPoster, {
                method: "GET", 
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Poster');
            }
            const Poster = await response.json();
            setData(Poster);
        } catch (error) {
            console.error(error.message);
        }
    };

    fetchPoster();
    // Set up interval to fetch every 1hr
    const intervalId = setInterval(fetchPoster, 60*60*10000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);

   
}, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-4">
        {/* Bold Headline */}
        <h2 className="text-2xl font-bold mb-4">News and Events</h2>

        <div className="flex justify-center items-start w-full">
          {/* Left-aligned NewsHeadlines with 5px from the left */}
          <div className="ml-[40px] w-1/4">
            <NewsHeadlines />
          </div>

          {/* Center for ImageSlider */}
          <div className="w-1/2 max-w-lg mx-auto mr-[50px]">
            <ImageSlider autoSlide>
              {Poster.map((s, index) => (
                <img key={index} src={s} alt="" />
              ))}
            </ImageSlider>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default MainPage;