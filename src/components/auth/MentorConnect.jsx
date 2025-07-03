import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X, User, BookOpen, Languages, Award, Eye, Mail, Linkedin, Github, Phone, MapPin, Code, Users, GraduationCap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apis from '../../utils/apis'

const MentorConnect = () => {
    const [data, setData] = useState([]);
    const [bookedMentorId, setBookedMentorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [userBookings, setUserBookings] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(true);
    const [bookingError, setBookingError] = useState(null);

    // Fetch user's current bookings on component mount
    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                setBookingLoading(true);
                setBookingError(null);
                
                const menteeId = localStorage.getItem('disId');
                console.log('=== FETCH USER BOOKINGS DEBUG ===');
                console.log('Retrieved menteeId from localStorage:', menteeId);
                
                if (!menteeId) {
                    console.log('No menteeId found in localStorage');
                    setBookingLoading(false);
                    return;
                }

                const apiUrl = `${apis().getUserBookings}/${menteeId}`;
                console.log('Making API call to:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        // Add any auth headers if needed
                    },
                });

                console.log('API Response status:', response.status);
                console.log('API Response ok:', response.ok);

                if (response.ok) {
                    const result = await response.json();
                    console.log('API Response data:', result);
                    
                    setUserBookings(result.bookings || []);
                    
                    // Set booked mentor ID if user has active bookings
                    if (result.hasActiveBookings && result.bookings.length > 0) {
                        const activeBooking = result.bookings[0]; // Get the first active booking
                        console.log('Active booking found:', activeBooking);
                        console.log('Setting booked mentor ID to:', activeBooking.mentorId);
                        
                        setBookedMentorId(activeBooking.mentorId);
                        
                        // Store in localStorage for consistency
                        localStorage.setItem('bookedMentorId', activeBooking.mentorId);
                        localStorage.setItem('bookingTime', Date.now().toString());
                        
                        console.log('Updated localStorage with booked mentor ID');
                    } else {
                        console.log('No active bookings found');
                        // Clear any stale booking data
                        localStorage.removeItem('bookedMentorId');
                        localStorage.removeItem('bookingTime');
                        setBookedMentorId(null);
                        console.log('Cleared stale booking data from localStorage');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('API Error response:', errorText);
                    const errorMessage = `Failed to fetch bookings: ${response.status}`;
                    setBookingError(errorMessage);
                    toast.error(errorMessage);
                }
            } catch (error) {
                console.error('Error fetching user bookings:', error);
                const errorMessage = `Network error: ${error.message}`;
                setBookingError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setBookingLoading(false);
            }
        };

        // Add a small delay to ensure localStorage is ready
        setTimeout(fetchUserBookings, 100);
    }, []); // Empty dependency array - only run once on mount

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
                toast.error('Failed to load mentors. Please try again.');
            }
        };

        fetchMentors();
        const intervalId = setInterval(fetchMentors, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Remove the localStorage check useEffect since we're now relying on server data
    useEffect(() => {
        console.log('=== BOOKING STATE DEBUG ===');
        console.log('Current bookedMentorId:', bookedMentorId);
        console.log('Current userBookings:', userBookings);
        console.log('Booking loading:', bookingLoading);
    }, [bookedMentorId, userBookings, bookingLoading]);

    const handleBookClick = async (id) => {
        if (!selectedTimeSlot && bookedMentorId !== id) {
            toast.warning('Please select a time slot before booking.');
            return;
        }

        const selectedMentor = data.find((mentor) => mentor.id === id);
        const mentorId = id;
        const menteeId = localStorage.getItem('disId');

        console.log('=== BOOKING ACTION DEBUG ===');
        console.log('Action for mentorId:', mentorId);
        console.log('Current bookedMentorId:', bookedMentorId);
        console.log('Selected time slot:', selectedTimeSlot);

        setLoading(true);

        if (bookedMentorId === null) {
            // Booking a new mentor
            console.log('Creating new booking...');
            
            try {
                const response = await fetch(apis().book, {
                    method: "POST",
                    body: JSON.stringify({ 
                        mentorId, 
                        menteeId, 
                        time: selectedTimeSlot
                    }),
                    headers: { "Content-Type": "application/json" },
                });

                const result = await response.json();
                console.log('Booking response:', result);

                if (!response.ok) {
                    throw new Error(result?.message);
                }

                if (result?.status || result?.message === 'Booking updated successfully!' || result?.message?.includes('Successfully')) {
                    setBookedMentorId(id);
                    const bookingTime = Date.now();
                    localStorage.setItem('bookedMentorId', id);
                    localStorage.setItem('bookingTime', bookingTime.toString());
                    
                    const scheduledIST = new Date(result.scheduledTimeIST);
                    const dateStr = scheduledIST.toLocaleDateString();
                    const timeStr = scheduledIST.toLocaleTimeString();
                    
                    let successMessage = `Booking successful for ${selectedTimeSlot}! Scheduled for: ${dateStr} at ${timeStr}`;
                    
                    if (!result.isNewBooking) {
                        successMessage += ` - You've joined a group session with ${result.totalMentees} total participants.`;
                    }
                    
                    toast.success(successMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });

                    localStorage.setItem("disId", result?.disId || menteeId);
                    setSelectedTimeSlot('');
                    
                    // Update userBookings state
                    const newBooking = {
                        bookingId: result.bookingId,
                        mentorId: mentorId,
                        scheduleTime: result.scheduledTimeUTC,
                        scheduleTimeIST: result.scheduledTimeIST,
                        totalMentees: result.totalMentees,
                        isActive: true
                    };
                    setUserBookings([newBooking]);
                    
                    console.log('Booking successful, updated state');
                }
            } catch (error) {
                console.error('Booking error:', error);
                toast.error(`Booking failed: ${error.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
            
        } else if (bookedMentorId === id) {
            // Canceling existing booking
            console.log('Canceling existing booking...');
            
            // Using a custom toast for confirmation
            const confirmCancel = window.confirm('Are you sure you want to cancel your booking?');
            
            if (!confirmCancel) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(apis().cancelBooking, {
                    method: "DELETE",
                    body: JSON.stringify({ mentorId, menteeId }),
                    headers: { "Content-Type": "application/json" },
                });

                const result = await response.json();
                console.log('Cancel response:', result);

                if (!response.ok) {
                    throw new Error(result?.message);
                }

                if (result?.status) {
                     window.location.reload();
                    setBookedMentorId(null);
                    localStorage.removeItem('bookedMentorId');
                    localStorage.removeItem('bookingTime');
                    
                    let successMessage = 'Booking cancelled successfully!';
                    
                    if (result.remainingMentees > 0) {
                        successMessage += ` ${result.remainingMentees} other participants remain in this session.`;
                    }
                    
                    toast.success(successMessage, {
                        position: "top-right",
                        autoClose: 4000,
                    });

                    setSelectedTimeSlot('');
                    setUserBookings([]);
                   
                    
                    console.log('Cancellation successful, updated state');
                 
                }
            } catch (error) {
              
                console.error('Cancellation error:', error);
                toast.error(`Cancellation failed: ${error.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                });
                   window.location.reload();
            }
        } else {
            toast.warning("You have already booked another mentor. Please cancel your current booking first.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
        
        setLoading(false);
    };

    const openMentorModal = (mentor) => {
        setSelectedMentor(mentor);
        setShowModal(true);
        setSelectedTimeSlot('');
    };

    const closeMentorModal = () => {
        setSelectedMentor(null);
        setShowModal(false);
        setSelectedTimeSlot('');
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

    // Helper function to get booking info for a mentor
    const getMentorBookingInfo = (mentorId) => {
        return userBookings.find(booking => booking.mentorId === mentorId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 font-inter">
            {/* Toast Container */}
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

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

            {/* Mentors Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Expert Mentors</h2>
                    <p className="text-amber-700/80 max-w-2xl mx-auto">
                        Choose from our carefully selected mentors, each bringing years of industry experience and expertise
                    </p>
                </div>

                {/* Loading state for bookings */}
                {bookingLoading && (
                    <div className="text-center mb-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                        <p className="text-amber-700 text-sm">Loading your bookings...</p>
                    </div>
                )}

                {/* Booking error state */}
                {bookingError && (
                    <div className="text-center mb-8">
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-red-700 text-sm">{bookingError}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="mt-2 text-red-600 underline text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {data.map((mentor) => {
                        const bookingInfo = getMentorBookingInfo(mentor.id);
                        const isBooked = bookedMentorId === mentor.id;
                        
                        return (
                            <div key={mentor.id} className="group">
                                <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden h-full flex flex-col min-h-[400px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Profile Image */}
                                        <div className="relative mb-4 flex-shrink-0">
                                            <img 
                                                src={mentor.img} 
                                                alt={mentor.name} 
                                                className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-amber-200/50 group-hover:ring-amber-300/70 transition-all duration-300"
                                            />
                                            {isBooked && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Mentor Info */}
                                        <div className="text-center mb-4 flex-grow">
                                            <h3 className="text-lg font-bold text-amber-900 mb-1">{mentor.name}</h3>
                                            <p className="text-amber-600 text-sm font-medium mb-2">{mentor.program} - {mentor.yearOfStudy}</p>
                                            <p className="text-amber-700/80 text-sm mb-3 leading-relaxed line-clamp-3">{mentor.shortDes}</p>

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

                                            {/* Booking Info */}
                                            {bookingInfo && (
                                                <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                                                    <p className="text-green-800 text-xs font-medium">Your Session</p>
                                                    <p className="text-green-700 text-xs">
                                                        {new Date(bookingInfo.scheduleTimeIST).toLocaleDateString()} at{' '}
                                                        {new Date(bookingInfo.scheduleTimeIST).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                    {bookingInfo.totalMentees > 1 && (
                                                        <p className="text-green-600 text-xs">
                                                            Group session ({bookingInfo.totalMentees} participants)
                                                        </p>
                                                    )}
                                                </div>
                                            )}
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
                                                    isBooked
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                                        : bookedMentorId && bookedMentorId !== mentor.id
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                                                } ${loading || bookingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => handleBookClick(mentor.id)}
                                                disabled={loading || bookingLoading || (bookedMentorId && bookedMentorId !== mentor.id)}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    {isBooked ? (
                                                        <>
                                                            <X className="w-4 h-4" />
                                                            Cancel
                                                        </>
                                                    ) : bookedMentorId && bookedMentorId !== mentor.id ? (
                                                        <>
                                                            <X className="w-4 h-4" />
                                                            Unavailable
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
                        );
                    })}
                </div>

                {/* Loading state or empty state */}
                {data.length === 0 && !bookingLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <p className="text-amber-700">Loading mentors...</p>
                    </div>
                )}
            </div>

            {/* Modal - Same as before but with toastify for button clicks */}
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

                            {/* Current Booking Status in Modal */}
                            {getMentorBookingInfo(selectedMentor.id) && (
                                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Your Current Booking</h3>
                                    <div className="text-green-700">
                                        <p><strong>Scheduled:</strong> {new Date(getMentorBookingInfo(selectedMentor.id).scheduleTimeIST).toLocaleString()}</p>
                                        <p><strong>Total Participants:</strong> {getMentorBookingInfo(selectedMentor.id).totalMentees}</p>
                                    </div>
                                </div>
                            )}

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
                                    {/* Time Slot Selection - Only show if not already booked with this mentor */}
                                    {!getMentorBookingInfo(selectedMentor.id) && selectedMentor.availabilitySlots && selectedMentor.availabilitySlots.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                Select Time Slot
                                            </h4>
                                            
                                            {/* Time Selection */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-amber-800 mb-2">Available Slots:</label>
                                                <div className="space-y-2">
                                                    {selectedMentor.availabilitySlots.map((slot, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedTimeSlot(slot)}
                                                            disabled={bookedMentorId && bookedMentorId !== selectedMentor.id}
                                                            className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                                                                selectedTimeSlot === slot
                                                                    ? 'bg-amber-500 text-white border-amber-500'
                                                                    : bookedMentorId && bookedMentorId !== selectedMentor.id
                                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium">{slot}</span>
                                                                <Clock className="w-4 h-4" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Selected Summary */}
                                            {selectedTimeSlot && (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <h5 className="font-medium text-green-800 mb-2">Selected Slot:</h5>
                                                    <p className="text-green-700">
                                                        <strong>{selectedTimeSlot}</strong>
                                                    </p>
                                                    <p className="text-green-600 text-sm mt-2">
                                                        System will book the next available {selectedTimeSlot}
                                                    </p>
                                                </div>
                                            )}
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
                                            : bookedMentorId && bookedMentorId !== selectedMentor.id
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : selectedTimeSlot
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } ${loading || bookingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        handleBookClick(selectedMentor.id);
                                        if (bookedMentorId !== selectedMentor.id) {
                                            closeMentorModal();
                                        }
                                    }}
                                    disabled={loading || bookingLoading || (!selectedTimeSlot && bookedMentorId !== selectedMentor.id) || (bookedMentorId && bookedMentorId !== selectedMentor.id)}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {bookedMentorId === selectedMentor.id ? (
                                            <>
                                                <X className="w-5 h-5" />
                                                Cancel Booking
                                            </>
                                        ) : bookedMentorId && bookedMentorId !== selectedMentor.id ? (
                                            <>
                                                <X className="w-5 h-5" />
                                                You have another booking
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-5 h-5" />
                                                {selectedTimeSlot 
                                                    ? `Book Session for ${selectedTimeSlot}`
                                                    : 'Select Time Slot to Book'
                                                }
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
