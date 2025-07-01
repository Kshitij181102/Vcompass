import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';
import Footer from "../ui/Footer";
import Navbar from '../ui/NavBar';
import apis from "../../utils/apis";
import toast from "react-hot-toast";



const MentorConnect = () => {
    const [data, setData] = useState([]);
    const [bookedMentorId, setBookedMentorId] = useState(null);
    const [loading, setLoading] = useState(false);

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

        const intervalId = setInterval(fetchMentors, 10000);

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

    const handleBookClick = async (id) => {
        const selectedMentor = data.find((mentor) => mentor.id === id);
        const time = selectedMentor.time;
        const mentorId = id;
        const menteeId = localStorage.getItem('disId');

        setLoading(true);

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
            toast.error("You have already booked another mentor.");
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 font-inter">
            <Navbar />
            <div className="relative overflow-hidden">
                {/* Floating Orbs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-amber-300/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-amber-300/20 to-orange-200/30 rounded-full blur-xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
                            Connect with
                            <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Expert Mentors
                            </span>
                        </h1>
                        <p className="text-xl text-amber-700/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Accelerate your career growth with personalized guidance from industry leaders and experienced professionals
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-amber-700/60">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                                <span>1-on-1 Sessions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                                <span>Expert Guidance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                                <span>Flexible Scheduling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentors Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Expert Mentors</h2>
                    <p className="text-amber-700/80 max-w-2xl mx-auto">
                        Choose from our carefully selected mentors, each bringing years of industry experience and expertise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-amber-300/50 scrollbar-track-transparent">
                    {data.map((mentor) => (
                        <div key={mentor.id} className="group">
                            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative z-10">
                                    {/* Profile Image */}
                                    <div className="relative mb-4">
                                        <img 
                                            src={mentor.img} 
                                            alt={mentor.name} 
                                            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-200/50 group-hover:ring-amber-300/70 transition-all duration-300"
                                        />
                                        {bookedMentorId === mentor.id && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mentor Info */}
                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-bold text-amber-900 mb-2">{mentor.name}</h3>
                                        <p className="text-amber-700/80 text-sm mb-3 leading-relaxed">{mentor.shortDes}</p>

                                        {/* Availability */}
                                        <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-amber-50/70 rounded-lg">
                                            <Clock className="w-4 h-4 text-amber-600/60" />
                                            <span className="text-sm text-amber-700 font-medium">{mentor.time}</span>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400/20 ${
                                            bookedMentorId === mentor.id
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
                                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleBookClick(mentor.id)}
                                        disabled={loading}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {bookedMentorId === mentor.id ? (
                                                <>
                                                    <X className="w-4 h-4" />
                                                    Cancel Booking
                                                </>
                                            ) : (
                                                <>
                                                    <Calendar className="w-4 h-4" />
                                                    Book Session
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MentorConnect;