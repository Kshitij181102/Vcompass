const apis = () => {
    const local = 'http://localhost:5555/';
    //https://vcompass-backend-wahj.vercel.app/
    const list = {
        registerUser: `${local}user/register`,
        loginUser: `${local}user/login`,
        forgetPassword: `${local}user/forget/password`,
        otpVerify: `${local}user/otp/verify`,
        getOtpTime: `${local}user/otp/time`,
        updatePassword: `${local}user/password/update`,
        getAccess: `${local}user/get/Access`,
        book: `${local}user/book`,
        cancelBooking: `${local}user/cancel`,
        getMentors: `${local}user/mentors`,
        getNews: `${local}user/news`,
        getPoster: `${local}user/poster`,
      
        // Profile routes
        getUserProfile: `${local}user/profile`,
        updateProfile: `${local}user/profile/update`,
        
        // Booking management route
        getUserBookings: `${local}user/bookings`,
    };
    
    return list;
};

export default apis;