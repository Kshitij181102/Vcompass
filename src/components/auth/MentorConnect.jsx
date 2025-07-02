import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X, User, BookOpen, Languages, Award, Eye, Mail, Linkedin, Github, Phone, MapPin, Code, Users, GraduationCap } from 'lucide-react';
import apis from '../../utils/apis'
const MentorConnect = () => {
    const [data, setData] = useState([]);
    const [bookedMentorId, setBookedMentorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showModal, setShowModal] = useState(false);


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
                console.error('Error fetching mentors:', error);
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
                    alert('Booking successful!');
                    localStorage.setItem("disId", result?.disId);
                }
            } catch (error) {
                alert('Error: ' + error.message);
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
                    alert('Booking cancelled successfully!');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        } else {
            alert("You have already booked another mentor.");
        }
        
        setLoading(false);
    };

    const openMentorModal = (mentor) => {
        setSelectedMentor(mentor);
        setShowModal(true);
    };

    const closeMentorModal = () => {
        setSelectedMentor(null);
        setShowModal(false);
    };

    const SpecializationTag = ({ tag }) => (
        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            {tag}
        </span>
    );

    const SupportAreaTag = ({ area }) => (
        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            {area}
        </span>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 font-inter">
            {/* Header Section */}
            <div className="relative overflow-hidden">
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
                        <div key={mentor.id} className="group h-96">
                            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Profile Image */}
                                    <div className="relative mb-4 flex-shrink-0">
                                        <img 
                                            src={mentor.img} 
                                            alt={mentor.name} 
                                            className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-amber-200/50 group-hover:ring-amber-300/70 transition-all duration-300"
                                        />
                                        {bookedMentorId === mentor.id && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mentor Info */}
                                    <div className="text-center mb-4 flex-grow">
                                        <h3 className="text-lg font-bold text-amber-900 mb-1">{mentor.name}</h3>
                                        <p className="text-amber-600 text-sm font-medium mb-2">{mentor.program} - {mentor.yearOfStudy}</p>
                                        <p className="text-amber-700/80 text-sm mb-3 leading-relaxed line-clamp-2">{mentor.shortDes}</p>

                                        {/* Quick Tags */}
                                        <div className="flex flex-wrap justify-center gap-1 mb-3">
                                            {mentor.specialization?.slice(0, 2).map((spec, index) => (
                                                <SpecializationTag key={index} tag={spec} />
                                            ))}
                                            {mentor.specialization?.length > 2 && (
                                                <span className="text-xs text-amber-600">+{mentor.specialization.length - 2} more</span>
                                            )}
                                        </div>

                                        {/* Availability */}
                                        <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-amber-50/70 rounded-lg">
                                            <Clock className="w-4 h-4 text-amber-600/60" />
                                            <span className="text-sm text-amber-700 font-medium">{mentor.time}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => openMentorModal(mentor)}
                                            className="flex-1 py-2 px-3 bg-amber-100 text-amber-700 rounded-lg font-medium transition-all duration-300 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400/20 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button
                                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/20 ${
                                                bookedMentorId === mentor.id
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => handleBookClick(mentor.id)}
                                            disabled={loading}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                {bookedMentorId === mentor.id ? (
                                                    <>
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-4 h-4" />
                                                        Book
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedMentor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                        {/* Close Button */}
                        <button
                            onClick={closeMentorModal}
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Modal Content */}
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start gap-6 mb-8">
                                <img 
                                    src={selectedMentor.img} 
                                    alt={selectedMentor.name} 
                                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-amber-200/50"
                                />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-amber-900 mb-2">{selectedMentor.name}</h2>
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-5 h-5 text-amber-600" />
                                        <span className="text-amber-700 font-medium">{selectedMentor.program} - {selectedMentor.yearOfStudy}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-amber-600" />
                                        <span className="text-amber-700">{selectedMentor.department}</span>
                                    </div>
                                    <p className="text-amber-800 font-medium text-lg">{selectedMentor.shortDes}</p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-amber-900 mb-3">About Me</h3>
                                <p className="text-amber-700 leading-relaxed">{selectedMentor.bio}</p>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Specializations */}
                                    {selectedMentor.specialization && selectedMentor.specialization.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Code className="w-5 h-5" />
                                                Specializations
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMentor.specialization.map((spec, index) => (
                                                    <SpecializationTag key={index} tag={spec} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Support Areas */}
                                    {selectedMentor.supportAreas && selectedMentor.supportAreas.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                Support Areas
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMentor.supportAreas.map((area, index) => (
                                                    <SupportAreaTag key={index} area={area} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {selectedMentor.languagesSpoken && selectedMentor.languagesSpoken.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Languages className="w-5 h-5" />
                                                Languages Spoken
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMentor.languagesSpoken.map((lang, index) => (
                                                    <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Availability Slots */}
                                    {selectedMentor.availabilitySlots && selectedMentor.availabilitySlots.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Clock className="w-5 h-5" />
                                                Available Slots
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedMentor.availabilitySlots.map((slot, index) => (
                                                    <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                                        <span className="text-amber-800 font-medium">{slot}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {selectedMentor.achievements && selectedMentor.achievements.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Award className="w-5 h-5" />
                                                Achievements
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedMentor.achievements.map((achievement, index) => (
                                                    <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                        <span className="text-green-800">{achievement}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Info */}
                                    {selectedMentor.contactInfo && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3">Contact Information</h4>
                                            <div className="space-y-2">
                                                {selectedMentor.contactInfo.email && (
                                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                        <Mail className="w-4 h-4 text-gray-600" />
                                                        <span className="text-gray-700">{selectedMentor.contactInfo.email}</span>
                                                    </div>
                                                )}
                                                {selectedMentor.contactInfo.linkedin && (
                                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                        <Linkedin className="w-4 h-4 text-gray-600" />
                                                        <span className="text-gray-700">{selectedMentor.contactInfo.linkedin}</span>
                                                    </div>
                                                )}
                                                {selectedMentor.contactInfo.github && (
                                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                        <Github className="w-4 h-4 text-gray-600" />
                                                        <span className="text-gray-700">{selectedMentor.contactInfo.github}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Book Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-400/20 ${
                                        bookedMentorId === selectedMentor.id
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
                                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        handleBookClick(selectedMentor.id);
                                        closeMentorModal();
                                    }}
                                    disabled={loading}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {bookedMentorId === selectedMentor.id ? (
                                            <>
                                                <X className="w-5 h-5" />
                                                Cancel Booking
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-5 h-5" />
                                                Book Session with {selectedMentor.name}
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorConnect;