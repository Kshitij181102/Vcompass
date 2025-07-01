import React, { useState, useEffect } from 'react';
import apis from '../../utils/apis'; // Adjust import path as needed
import Footer from "../ui/Footer";
import Navbar from '../ui/NavBar';
const NewsAndEvents = () => {
  const [news, setNews] = useState([]);
  const [posters, setPosters] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsPage, setNewsPage] = useState(1);
  const [postersPage, setPostersPage] = useState(1);

  const apiList = apis();

  // Fetch news
  const fetchNews = async (page = 1, category = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '6'
      });
      
      if (category && category !== 'all') {
        queryParams.append('category', category);
      }

      const response = await fetch(`${apiList.getNews}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setNews(data.data);
        } else {
          setNews(prev => [...prev, ...data.data]);
        }
      }
    } catch (err) {
      setError('Failed to fetch news');
      console.error('News fetch error:', err);
    }
  };

  // Fetch posters
  const fetchPosters = async (page = 1, category = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '6'
      });
      
      if (category && category !== 'all') {
        queryParams.append('category', category);
      }

      const response = await fetch(`${apiList.getPoster}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setPosters(data.data);
        } else {
          setPosters(prev => [...prev, ...data.data]);
        }
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Posters fetch error:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNews(1),
        fetchPosters(1)
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNewsPage(1);
    setPostersPage(1);
    fetchNews(1, tab);
    fetchPosters(1, tab);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-700 font-medium">Loading latest updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 relative overflow-hidden">
      {/* Floating Background Orbs */}
       <Navbar/>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-amber-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-300/20 to-orange-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Campus <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Updates</span>
          </h1>
          <p className="text-amber-700/80 text-lg max-w-2xl mx-auto">
            Stay connected with the latest news, events, and happenings around our college campus
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['all', 'academic', 'cultural', 'sports', 'placement', 'workshop'].map((category) => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 ${
                activeTab === category
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 text-amber-700 hover:bg-white/90 hover:text-amber-800'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Featured News Section */}
        {news.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-4"></div>
              Latest News
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div
                  key={item._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 transform hover:-translate-y-2"
                >
                  {item.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      <span className="text-amber-600/60 text-sm">
                        {formatDate(item.publishDate)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-amber-700/80 text-sm mb-4 line-clamp-3">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600/60 text-xs">
                        By {item.author} • {item.readTime} min read
                      </span>
                      <button className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events & Posters Section */}
        {posters.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-4"></div>
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster, index) => (
                <div
                  key={poster._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                        {poster.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        poster.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                        poster.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {poster.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-800 transition-colors">
                      {poster.title}
                    </h3>
                    <p className="text-amber-700/80 text-sm mb-4 line-clamp-2">
                      {poster.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-amber-600/60 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(poster.eventDate)} at {formatTime(poster.eventTime)}
                      </div>
                      <div className="flex items-center text-amber-600/60 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {poster.venue}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600/60 text-xs">
                        By {poster.organizer}
                      </span>
                      {poster.registrationLink && (
                        <a
                          href={poster.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                        >
                          Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {(news.length > 0 || posters.length > 0) && (
          <div className="text-center">
            <button
              onClick={() => {
                const newNewsPage = newsPage + 1;
                const newPostersPage = postersPage + 1;
                setNewsPage(newNewsPage);
                setPostersPage(newPostersPage);
                fetchNews(newNewsPage, activeTab);
                fetchPosters(newPostersPage, activeTab);
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Load More Updates
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && posters.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">No Updates Available</h3>
              <p className="text-amber-700/60">
                Check back later for the latest news and events from our campus.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default NewsAndEvents;