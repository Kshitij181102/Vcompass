const apis = () => {
    const local = 'http://localhost:5555/';
    
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
    };
    
    return list;
};

export default apis;