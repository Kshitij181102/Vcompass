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
    background: linear-gradient(to bottom right, #fff8e1, #fff3e0, #fffde7);
    min-height: 100vh;
    color: #78350f;
  }
`;

const PageContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff8e1, #fff3e0, #fffde7);
`;

const Heading = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #78350f;
  text-align: center;
  margin-bottom: 60px;
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(255, 193, 7, 0.2);
`;

const CarouselWrapper = styled.div`
  width: 100%;
  height: 350px;
  margin-bottom: 30px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);

  .carousel-item img,
  .carousel-item video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GetStartedButton = styled.button`
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);

  &:hover {
    background: linear-gradient(to right, #d97706, #ea580c);
    transform: translateY(-3px);
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
    color: #78350f;
    margin-bottom: 15px;
  }
  p {
    font-size: 1.1rem;
    color: rgba(120, 53, 15, 0.8);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 236, 179, 0.5);
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #78350f;
    margin-bottom: 8px;
  }
  p {
    font-size: 0.9rem;
    color: rgba(120, 53, 15, 0.75);
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
          <Section>
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
          </Section>

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
