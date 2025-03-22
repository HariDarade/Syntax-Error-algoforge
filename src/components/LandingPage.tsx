import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Container,
  HeaderWrapper,
  Logo,
  Nav,
  NavLink,
  HeroWrapper,
  HeroTitle,
  HeroSubtitle,
  Button,
  FeaturesWrapper,
  FeatureCard,
  FooterWrapper,
  PageContent,
} from './LandingPageStyles';

// Import the logo
import MediQueueLogo from '../assets/mediqueue-logo.png';

// Landing Page Component with Routing
const LandingPage: React.FC = () => {
  // Header Component
  const Header = () => (
    <HeaderWrapper>
      <Logo>
        <img
          src={MediQueueLogo}
          alt="MediQueue Logo"
          style={{ height: '30px', marginRight: '10px', verticalAlign: 'middle' }}
        />
        MediQueue
      </Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/about">About</NavLink>
      </Nav>
    </HeaderWrapper>
  );

  // Hero Component
  const Hero = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleGetStarted = () => {
      navigate('/get-started'); // Navigate to the Get Started page
    };

    return (
      <HeroWrapper>
        <HeroTitle>Revolutionizing HealthCare Sector</HeroTitle>
        <HeroSubtitle>
          Manage appointments and patient queues effortlessly with MediQueue.
        </HeroSubtitle>
        <Button onClick={handleGetStarted}>Get Started</Button>
      </HeroWrapper>
    );
  };

  // Features Component (used only on the Features page)
  const Features = () => (
    <FeaturesWrapper>
      <FeatureCard>
        <h3>Easy Scheduling</h3>
        <p>Book appointments in seconds.</p>
      </FeatureCard>
      <FeatureCard>
        <h3>Real-Time Updates</h3>
        <p>Get live queue status.</p>
      </FeatureCard>
      <FeatureCard>
        <h3>Patient-Friendly</h3>
        <p>Designed for ease of use.</p>
      </FeatureCard>
    </FeaturesWrapper>
  );

  // Footer Component
  const Footer = () => (
    <FooterWrapper>
      <p>© 2025 MediQueue. All rights reserved.</p>
    </FooterWrapper>
  );

  // Page Components
  const HomePage = () => (
    <Container>
      <Header />
      <Hero />
      <Footer />
    </Container>
  );

  const FeaturesPage = () => (
    <Container>
      <Header />
      <PageContent>
        <h2>Features</h2>
        <p>Explore the powerful features of MediQueue.</p>
        <Features />
      </PageContent>
      <Footer />
    </Container>
  );

  const AboutPage = () => (
    <Container>
      <Header />
      <PageContent>
        <h2>About Us</h2>
        <p>Learn more about MediQueue and our mission to improve healthcare efficiency.</p>
      </PageContent>
      <Footer />
    </Container>
  );

  const GetStartedPage = () => (
    <Container>
      <Header />
      <PageContent>
        <h2>Get Started with MediQueue</h2>
        <p>Welcome! Sign up or log in to start managing your healthcare queues efficiently.</p>
        {/* Add more content like a form here if needed */}
      </PageContent>
      <Footer />
    </Container>
  );

  // Router Setup
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Routes>
    </Router>
  );
};

export default LandingPage;