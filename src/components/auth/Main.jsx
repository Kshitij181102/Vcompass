import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #ffffff;
  }
`;

const PageContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Heading = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 60px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 30px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const SliderSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  height: 350px;
  margin-bottom: 30px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  .carousel-item img,
  .carousel-item video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .carousel-control-prev {
    left: 15px;
  }
  
  .carousel-control-next {
    right: 15px;
  }
  
  .carousel-indicators {
    bottom: 15px;
  }
  
  .carousel-indicators [data-bs-target] {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    width: 12px;
    height: 12px;
  }
  
  @media (max-width: 768px) {
    height: 280px;
  }
  
  @media (max-width: 480px) {
    height: 220px;
  }
`;

const GetStartedButton = styled.button`
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(238, 90, 82, 0.3);
  font-family: 'Inter', sans-serif;

  &:hover {
    background: linear-gradient(135deg, #ff5252, #e53935);
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(238, 90, 82, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    padding: 12px 30px;
    font-size: 1rem;
  }
`;

const ContentSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContentBlock = styled.div`
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    
    @media (max-width: 480px) {
      font-size: 1rem;
      line-height: 1.6;
    }
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    
    h3 {
      font-size: 1rem;
    }
    
    p {
      font-size: 0.85rem;
    }
  }
`;

const Main = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Heading>V-Compass</Heading>
        <Container>
          {/* Left Section */}
          <SliderSection>
            <CarouselWrapper>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/pic.webp"
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <video autoPlay muted loop>
                    <source src="/animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Carousel.Item>
              </Carousel>
            </CarouselWrapper>
            <GetStartedButton onClick={handleGetStarted}>
              Get Started
            </GetStartedButton>
          </SliderSection>

          {/* Right Section */}
          <ContentSection>
            <ContentBlock>
              <h2>About Us</h2>
              <p>
                We provide an innovative platform for online mentorship and
                university FAQs to assist students in their academic journey.
              </p>
            </ContentBlock>
            <ContentBlock>
              <h2>How It Works</h2>
              <p>
                Our platform connects you with mentors, provides an FAQ chatbot
                for quick answers, daily university headlines, and helps you
                make the most of your university experience.
              </p>
            </ContentBlock>
            <ContentBlock>
              <h2>Features</h2>
              <p>
                Access live mentorship, explore our knowledge base, and navigate
                your university journey with ease and confidence.
              </p>
              <FeatureGrid>
                <FeatureCard>
                  <h3>Live Mentorship</h3>
                  <p>Connect with experienced mentors</p>
                </FeatureCard>
                <FeatureCard>
                  <h3>FAQ Chatbot</h3>
                  <p>Get instant answers to questions</p>
                </FeatureCard>
                <FeatureCard>
                  <h3>University News</h3>
                  <p>Stay updated with daily headlines</p>
                </FeatureCard>
              </FeatureGrid>
            </ContentBlock>
          </ContentSection>
        </Container>
      </PageContainer>
    </>
  );
};

export default Main;