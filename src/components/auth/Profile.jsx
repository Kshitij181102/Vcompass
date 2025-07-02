import React, { useState, useEffect } from 'react';
import { User, BookOpen, Phone, Mail, Lock, GraduationCap, Calendar, Users, Save, Eye, EyeOff } from 'lucide-react';

import apis from '../../utils/apis';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        disId: '',
        academicInfo: {
            studentId: '',
            program: '',
            department: '',
            yearOfStudy: '',
            section: ''
        }
    });

    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(apis().getUserProfile, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    name: data.user.name || '',
                    email: data.user.email || '',
                    phoneNumber: data.user.phoneNumber || '',
                    password: '',
                    confirmPassword: '',
                    disId: data.user.disId || '',
                    academicInfo: {
                        studentId: data.user.academicInfo?.studentId || '',
                        program: data.user.academicInfo?.program || '',
                        department: data.user.academicInfo?.department || '',
                        yearOfStudy: data.user.academicInfo?.yearOfStudy || '',
                        section: data.user.academicInfo?.section || ''
                    }
                };
                setFormData(userData);
                setOriginalData(userData);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setErrorMessage('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('academicInfo.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                academicInfo: {
                    ...prev.academicInfo,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const updateData = { ...formData };

            // Remove confirmPassword and empty password from request
            delete updateData.confirmPassword;
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(apis().updateProfile, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Profile updated successfully!');
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'Post Graduate'];

    const programOptions = [
        'B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech CE', 'B.Tech EE',
        'MBA', 'MCA', 'M.Tech', 'BBA', 'BCA', 'B.Com', 'B.Sc', 'M.Sc',
        'BA', 'MA', 'Ph.D', 'Other'
    ];

    if (loading && !formData.name) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
                
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
            

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <User className="w-8 h-8 mr-3" />
                            Profile Settings
                        </h1>
                        <p className="text-amber-100 mt-2">Update your personal and academic information</p>
                    </div>

                    {/* Messages */}
                    {successMessage && (
                        <div className="mx-8 mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mx-8 mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                            {errorMessage}
                        </div>
                    )}

                    {/* Form */}
                    <div className="p-8 space-y-8">
                        {/* Account Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 pb-4 border-b border-amber-200">
                                <Lock className="w-6 h-6 text-amber-600" />
                                <h2 className="text-xl font-semibold text-amber-900">Account Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Discord ID
                                    </label>
                                    <input
                                        type="text"
                                        name="disId"
                                        value={formData.disId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white/50"
                                        placeholder="Enter your Discord ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-12 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {formData.password && (
                                    <div>
                                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                                placeholder="Confirm your new password"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Academic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 pb-4 border-b border-amber-200">
                                <GraduationCap className="w-6 h-6 text-amber-600" />
                                <h2 className="text-xl font-semibold text-amber-900">Academic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Student ID / Roll Number
                                    </label>
                                    <input
                                        type="text"
                                        name="academicInfo.studentId"
                                        value={formData.academicInfo.studentId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                        placeholder="Enter your student ID"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Program / Course
                                    </label>
                                    <select
                                        name="academicInfo.program"
                                        value={formData.academicInfo.program}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                    >
                                        <option value="">Select your program</option>
                                        {programOptions.map(program => (
                                            <option key={program} value={program}>{program}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="academicInfo.department"
                                        value={formData.academicInfo.department}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                        placeholder="Enter your department"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Year of Study
                                    </label>
                                    <select
                                        name="academicInfo.yearOfStudy"
                                        value={formData.academicInfo.yearOfStudy}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                    >
                                        <option value="">Select year of study</option>
                                        {yearOptions.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                                        Section / Batch
                                    </label>
                                    <input
                                        type="text"
                                        name="academicInfo.section"
                                        value={formData.academicInfo.section}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                        placeholder="Enter your section or batch"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-amber-200">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="group flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                ) : (
                                    <Save className="w-5 h-5 mr-3" />
                                )}
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;