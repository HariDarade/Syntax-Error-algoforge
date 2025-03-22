import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  HeroWrapper,
  HeroTitle,
  HeroSubtitle,
  Button,
  AboutWrapper,
  AboutTitle,
  AboutDescription,
  FeatureCard,
} from './LandingPageStyles';
import ThreeBackground from './ThreeBackground';

// Animation Variants
const heroTitleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const heroSubtitleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3, ease: 'easeOut' } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.6, ease: 'easeOut' } },
};

const aboutVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Hero Component (with navigation)
const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <HeroWrapper>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroTitleVariants}
      >
        <HeroTitle>Revolutionizing Healthcare Sector</HeroTitle>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroSubtitleVariants}
      >
        <HeroSubtitle>
          Manage appointments and patient queues effortlessly with MediQueue.
        </HeroSubtitle>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
      >
        <Button onClick={handleGetStarted}>Get Started</Button>
      </motion.div>
    </HeroWrapper>
  );
};

// About MediQueue Component
const AboutMediQueue: React.FC = () => (
  <AboutWrapper
    initial="hidden"
    animate="visible"
    variants={aboutVariants}
  >
    <AboutTitle>About MediQueue</AboutTitle>
    <AboutDescription>
      MediQueue is a cutting-edge management system designed to streamline patient management for both hospitals and patients. With advanced predictive analytics, MediQueue helps hospitals anticipate patient inflow, ensuring efficient resource allocation and reduced waiting times.
    </AboutDescription>
    <motion.div
      className="features-grid"
      initial="hidden"
      animate="visible"
      variants={cardContainerVariants}
    >
      <FeatureCard variants={cardVariants}>
        <h3>Live Patient Queue</h3>
        <p>
          Patients can view real-time queue updates, making their hospital visits smoother and more predictable. Get instant notifications about your position in the queue and estimated wait times.
        </p>
        <p className="additional-info">
          <strong>Additional Benefit:</strong> Reduces patient anxiety by providing transparency and allows for better time management during hospital visits.
        </p>
      </FeatureCard>
      <FeatureCard variants={cardVariants}>
        <h3>Inventory Management for Hospitals</h3>
        <p>
          Hospital staff gain access to detailed inventory insights, ensuring critical supplies are always available. Track stock levels, expiration dates, and usage patterns in real-time.
        </p>
        <p className="additional-info">
          <strong>Additional Benefit:</strong> Prevents shortages of essential medical supplies and optimizes procurement processes for cost efficiency.
        </p>
      </FeatureCard>
      <FeatureCard variants={cardVariants}>
        <h3>Inter-Hospital Communication</h3>
        <p>
          MediQueue enables various hospitals to communicate and collaborate, sharing resources and fulfilling requirements seamlessly. Request or offer equipment, staff, or beds during emergencies.
        </p>
        <p className="additional-info">
          <strong>Additional Benefit:</strong> Enhances regional healthcare coordination and ensures no hospital is overwhelmed during peak times.
        </p>
      </FeatureCard>
      <FeatureCard variants={cardVariants}>
        <h3>Focused on Both Hospitals and Patients</h3>
        <p>
          Whether you're a healthcare provider or a patient, MediQueue is designed to enhance your experience with intuitive features. Hospitals benefit from streamlined operations, while patients enjoy a hassle-free experience.
        </p>
        <p className="additional-info">
          <strong>Additional Benefit:</strong> Bridges the gap between healthcare providers and patients, fostering trust and improving overall satisfaction.
        </p>
      </FeatureCard>
    </motion.div>
  </AboutWrapper>
);

// Home Page Component (for the "/" route)
export const HomePage: React.FC = () => {
  console.log('HomePage rendering'); // Debug log
  return (
    <Container>
      <ThreeBackground />
      <Hero />
      <AboutMediQueue />
    </Container>
  );
};