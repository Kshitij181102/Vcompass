import React, { useState, useEffect } from 'react';
import Navbar from '../ui/NavBar';
import apis from "../../utils/apis";
import toast from "react-hot-toast";
import './card.css';
import Footer from "../ui/Footer";

const MentorConnect = () => {
    const [data, setData] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [bookedMentorId, setBookedMentorId] = useState(null);
    const cardsToShow = 3;

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch(apis().getMentors, {
                    method: "GET", 
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch mentors');
                }
                const mentors = await response.json();
                setData(mentors);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchMentors();

        // Set up interval to fetch every 10 seconds
        const intervalId = setInterval(fetchMentors, 10000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const storedMentorId = localStorage.getItem('bookedMentorId');
        const bookingTime = localStorage.getItem('bookingTime');

        if (storedMentorId && bookingTime) {
            const currentTime = Date.now();
            const timeDifference = currentTime - parseInt(bookingTime, 10);

            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (timeDifference >= twentyFourHours) {
                localStorage.removeItem('bookedMentorId');
                localStorage.removeItem('bookingTime');
            } else {
                setBookedMentorId(storedMentorId);
            }
        }
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) =>
            (prevSlide + cardsToShow) % data.length
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide - cardsToShow < 0 ? data.length - cardsToShow : prevSlide - cardsToShow
        );
    };

    const handleBookClick = async (id) => {
        const selectedMentor = data.find((mentor) => mentor.id === id);
        const time = selectedMentor.time;
        const mentorId = id;
        const menteeId = localStorage.getItem('disId');

        if (bookedMentorId === null) {
            setBookedMentorId(id);
            const bookingTime = Date.now();
            localStorage.setItem('bookedMentorId', id);
            localStorage.setItem('bookingTime', bookingTime.toString());

            try {
                const response = await fetch(apis().book, {
                    method: "POST",
                    body: JSON.stringify({ mentorId, menteeId, time }),
                    headers: { "Content-Type": "application/json" },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.message);
                }

                if (result?.status) {
                    toast.success(result?.message);
                    localStorage.setItem("disId", result?.disId);
                }
            } catch (error) {
                toast.error(error.message);
            }
            
        } else if (bookedMentorId === id) {
            // Cancel the booking
            setBookedMentorId(null);
            localStorage.removeItem('bookedMentorId');
            localStorage.removeItem('bookingTime');

            try {
                const response = await fetch(apis().cancelBooking, {
                    method: "DELETE",
                    body: JSON.stringify({ mentorId, menteeId }),
                    headers: { "Content-Type": "application/json" },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.message);
                }

                if (result?.status) {
                    toast.success(result?.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error("Error: You have already booked another mentor.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <h1 className="text-4xl font-bold text-center text-brown-800 my-8">Mentor Connect</h1>
            <div className="w-3/4 m-auto mt-10 relative flex-grow">
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800 text-white flex justify-center items-center hover:bg-gray-700 transition duration-200 z-10"
                    onClick={prevSlide}
                >
                    &#8592;
                </button>

                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500"
                        style={{
                            transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)`,
                        }}
                    >
                        {data.map((mentor) => (
                            <div key={mentor.id} className="w-1/3 flex-shrink-0 p-2">
                                <div className="bg-white/80 backdrop-blur-md shadow-lg border border-brown-700 rounded-lg p-4 transition-transform duration-500 transform hover:scale-105">
                                    <img src={mentor.img} alt={mentor.name} className="card1 w-24 h-24 rounded-full mx-auto" />
                                    <h3 className="mt-2 text-lg font-bold text-center text-brown-800">{mentor.name}</h3>
                                    <p className="text-brown-600 text-center">{mentor.shortDes}</p>
                                    <p className="mt-2 font-semibold text-center text-brown-700">{mentor.time}</p>
                                    <button
                                        className={`mt-4 px-4 py-2 rounded border border-brown-700 ${
                                            bookedMentorId === mentor.id
                                                ? 'bg-brown-800 text-red'
                                                : 'bg-transparent text-brown-700 hover:bg-brown-100'
                                        } mx-auto block`}
                                        onClick={() => handleBookClick(mentor.id)}
                                    >
                                        {bookedMentorId === mentor.id ? 'Cancel Booking ' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-gray-800 text-white flex justify-center items-center hover:bg-gray-700 transition duration-200 z-10"
                    onClick={nextSlide}
                >
                    &#8594;
                </button>
            </div>
        
            <Footer />
        </div>
    );
};

export default MentorConnect;
