import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  min-height: 100vh;
  background: #1a1a40; /* Deep space blue */
  position: relative;
  overflow: hidden;
`;

export const HeroWrapper = styled.section`
  text-align: center;
  padding: 120px 20px;
  color: #ffffff;
  position: relative;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  color: #ffffff;
  letter-spacing: 2px;
`;

export const HeroSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.9;
  color: #d1d5db;
`;

export const Button = styled.button`
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  padding: 14px 40px;
  border: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.8);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const AboutWrapper = styled(motion.section)`
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 50px;
  }
`;

export const AboutTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
`;

export const AboutDescription = styled.p`
  font-size: 18px;
  color: #d1d5db;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  color: #d1d5db;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #00d4ff;
    transition: color 0.3s ease;
  }

  &:hover h3 {
    color: #ff00ff;
  }

  p {
    font-size: 16px;
    opacity: 0.9;
    line-height: 1.5;
    color: #d1d5db;
  }

  .additional-info {
    margin-top: 15px;
    font-size: 14px;
    color: #a1a1aa;
  }
`;