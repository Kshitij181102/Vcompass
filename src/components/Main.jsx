import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './Main.css';

const FEATURES = [
  {
    icon: "✦",
    title: "Live Mentorship",
    desc: "Connect with experienced mentors in real time for career and personal guidance.",
  },
  {
    icon: "◈",
    title: "FAQ Chatbot",
    desc: "Get instant answers to your university and career questions, 24/7.",
  },
  {
    icon: "◎",
    title: "University News",
    desc: "Stay informed with curated daily headlines from your campus.",
  },
];

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="vc-main">
      {/* Hero Section */}
      <section className="vc-main__hero">
        <div className="vc-main__hero-bg" aria-hidden="true">
          <div className="vc-main__hero-orb vc-main__hero-orb--1" />
          <div className="vc-main__hero-orb vc-main__hero-orb--2" />
          <div className="vc-main__hero-orb vc-main__hero-orb--3" />
          <div className="vc-main__hero-grid" />
        </div>

        <div className="vc-main__hero-content">
          {/* Left text */}
          <div className="vc-main__hero-text">
            <div className="vc-main__eyebrow">
              <span className="vc-main__eyebrow-dot" />
              Mentorship · Guidance · Growth
            </div>
            <h1 className="vc-main__hero-headline">
              Navigate Your <em>Journey</em> with Confidence
            </h1>
            <p className="vc-main__hero-body">
              V-Compass connects ambitious learners with world-class mentors, empowering you to make bold decisions and shape your future.
            </p>

            <div className="vc-main__hero-cta">
              <button className="vc-main__cta-btn vc-main__cta-btn--primary" onClick={() => navigate("/login")}>
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="vc-main__cta-btn vc-main__cta-btn--ghost" onClick={() => navigate("/mentor/connect")}>
                Meet Mentors
              </button>
            </div>

            <div className="vc-main__stats-row">
              {[["2.4k+","Mentors"],["18k+","Sessions"],["96%","Satisfaction"]].map(([n,l]) => (
                <div key={l} className="vc-main__stat">
                  <span className="vc-main__stat-num">{n}</span>
                  <span className="vc-main__stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right carousel */}
          <div className="vc-main__hero-visual">
            <div className="vc-main__carousel-frame">
              <Carousel indicators={false} interval={4000} className="vc-carousel">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/pic.webp"
                    alt="Mentorship in action"
                    style={{ height: '360px', objectFit: 'cover', borderRadius: '20px' }}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <video
                    autoPlay muted loop playsInline
                    style={{ width:'100%', height:'360px', objectFit:'cover', borderRadius:'20px', display:'block' }}
                  >
                    <source src="/animation.mp4" type="video/mp4" />
                  </video>
                </Carousel.Item>
              </Carousel>

              {/* Floating badge */}
              <div className="vc-main__floating-badge">
                <span className="vc-main__floating-badge-icon">🎯</span>
                <div>
                  <div className="vc-main__floating-badge-title">Goal Achieved</div>
                  <div className="vc-main__floating-badge-sub">3 milestones this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="vc-main__about">
        <div className="vc-main__section-wrap">
          <div className="vc-main__section-label">About V-Compass</div>
          <h2 className="vc-main__section-title">
            More than a platform —<br />a <em>compass</em> for life.
          </h2>
          <p className="vc-main__section-body">
            We provide an innovative platform for online mentorship and university FAQs to assist students in their academic and professional journey. Our platform connects you with mentors, provides an FAQ chatbot for quick answers, daily university headlines, and helps you make the most of your experience.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="vc-main__features">
        <div className="vc-main__features-wrap">
          <div className="vc-main__features-header">
            <div className="vc-main__section-label">What We Offer</div>
            <h2 className="vc-main__section-title">
              Everything you need to <em>thrive</em>.
            </h2>
          </div>

          <div className="vc-main__features-grid">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div className="vc-main__feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="vc-main__feature-icon">{icon}</div>
                <h3 className="vc-main__feature-title">{title}</h3>
                <p className="vc-main__feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="vc-main__cta-banner">
        <div className="vc-main__cta-banner-wrap">
          <h2 className="vc-main__cta-banner-title">
            Ready to find your direction?
          </h2>
          <p className="vc-main__cta-banner-sub">
            Join thousands of learners already navigating with confidence.
          </p>
          <button
            className="vc-main__cta-btn vc-main__cta-btn--white"
            onClick={() => navigate("/login")}
          >
            Start Your Journey
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Main;
