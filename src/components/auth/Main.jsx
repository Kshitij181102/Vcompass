import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Main = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>V-Compass</h1>
      <div style={styles.container}>
        {/* Left Section: Slider */}
        <section style={styles.sliderSection}>
          <Carousel style={styles.carousel}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/pic.webp"
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <video
                className="d-block w-100"
                
                autoPlay
                muted
                loop
              >
                <source src="/animation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Carousel.Item>
          </Carousel>
          <button style={styles.getStartedButton} onClick={handleGetStarted}>
            Get Started
          </button>
        </section>

        {/* Right Section: Content */}
        <section style={styles.contentSection}>
          <div style={styles.contentBlock}>
            <h2 className="font-extrabold">About Us</h2>
            <p>
              We provide an innovative platform for online mentorship and
              university FAQs to assist students in their academic journey.
            </p>
          </div>
          <div style={styles.contentBlock}>
            <h2 className="font-extrabold">How It Works</h2>
            <p>
              Our platform connects you with mentors, provides an FAQ chatbot for
              quick answers,daily university headlines and helps you make the most of your university
              experience.
            </p>
          </div>
          <div style={styles.contentBlock}>
            <h2 className="font-extrabold">Features</h2>
            <p>
              Access live mentorship, explore our knowledge base, and navigate
              your university journey with ease and confidence.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

// Styles
const styles = {
  pageContainer: {
    backgroundColor: "transparent", // Earthen-toned background color
    color: "#5B4636", // Dark brown text color for a natural feel
    padding: "20px",
    fontFamily: "'Arima', system-ui",
  },
  heading: {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "bold",
    fontFamily: "Lucida Handwriting, cursive",
    color: "#8B5E3C", // Darker shade for the heading
    marginBottom: "30px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  sliderSection: {
    width: "500px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: "20px",
    backgroundColor: "cream", // Light brown background for slider area
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  carousel: {
    width: "100%",
    height: "100%",
  },
  getStartedButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#8B5E3C", // Dark brown for button
    color: "#F4E3C1", // Lighter text color for contrast
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  contentSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#F4E3C1",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  contentBlock: {
    marginBottom: "20px",
  },
};

export default Main;
