const apis = () => {
    const local = 'https://vcompass-backend-wahj.vercel.app/';
    //https://vcompass-backend-wahj.vercel.app/
    //vcompass-backend-wahj.vercel.app
    const list = {
        registerUser: `${local}user/register`,
        loginUser: `${local}user/login`,
        logoutUser: `${local}user/logout`,
        forgetPassword: `${local}user/forget/password`,
        otpVerify: `${local}user/otp/verify`,
        getOtpTime: `${local}user/otp/time`,
        updatePassword: `${local}user/password/update`,
        getAccess: `${local}user/get/access`,
        book: `${local}user/book`,
        cancelBooking: `${local}user/cancel`,
        getMentors: `${local}user/mentors`,
        getNews: `${local}user/news`,
        getPoster: `${local}user/poster`,
        getUserProfile: `${local}user/profile`,
        updateProfile: `${local}user/profile/update`,
        getUserBookings: `${local}user/bookings`,

        // Admin routes
        adminStats:          `${local}admin/stats`,
        adminUsers:          `${local}admin/users`,
        adminMentors:        `${local}admin/mentors`,
        adminNews:           `${local}admin/news`,
        adminPosters:        `${local}admin/posters`,
        adminBookings:       `${local}admin/bookings`,
        adminMentorApps:     `${local}admin/mentor-applications`,

        // Mentor portal routes
        mentorRegister:      `${local}mentor/register`,
        mentorProfile:       `${local}mentor/profile`,
        mentorBookings:      `${local}mentor/bookings`,
    };
    return list;
};

export default apis;
