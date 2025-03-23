import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;

  .particles-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: float 15s infinite linear;
  }

  .particle:nth-child(1) {
    width: 20px;
    height: 20px;
    top: 20%;
    left: 10%;
    animation-duration: 10s;
  }

  .particle:nth-child(2) {
    width: 15px;
    height: 15px;
    top: 50%;
    left: 80%;
    animation-duration: 12s;
  }

  .particle:nth-child(3) {
    width: 25px;
    height: 25px;
    top: 70%;
    left: 30%;
    animation-duration: 8s;
  }

  .particle:nth-child(4) {
    width: 10px;
    height: 10px;
    top: 30%;
    left: 60%;
    animation-duration: 14s;
  }

  .particle:nth-child(5) {
    width: 18px;
    height: 18px;
    top: 90%;
    left: 50%;
    animation-duration: 9s;
  }

  .particle:nth-child(6) {
    width: 12px;
    height: 12px;
    top: 40%;
    left: 20%;
    animation-duration: 11s;
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export const HeroWrapper = styled.section`
  text-align: center;
  padding: 100px 20px;
  color: #333; /* Changed from #fff to #333 for visibility */
`;

export const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: #333; /* Added for visibility */
`;

export const HeroSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.9;
  color: #555; /* Changed from implicit #fff to #555 for visibility */
`;

export const Button = styled.button`
  background: #ff6f61;
  color: #fff;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    background: #e65b50;
    transform: scale(1.05);
  }
`;

export const AboutWrapper = styled(motion.section)`
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  margin: 20px 40px;
  backdrop-filter: blur(5px);

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 40px;
  }
`;

export const AboutTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: #333; /* Changed from #fff to #333 for visibility */
  text-align: center;
  margin-bottom: 20px;
`;

export const AboutDescription = styled.p`
  font-size: 18px;
  color: #555; /* Changed from #ddd to #555 for visibility */
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: #333; /* Changed from #fff to #333 for visibility */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #333; /* Added for visibility */
  }

  p {
    font-size: 16px;
    opacity: 0.8;
    line-height: 1.5;
    color: #555; /* Changed from implicit #fff to #555 for visibility */
  }

  .additional-info {
    margin-top: 10px;
    font-size: 14px;
    color: #666; /* Changed from #f0f0f0 to #666 for visibility */
  }
`;

export const PageContent = styled.div`
  padding: 60px 40px;
  color: #333; /* Changed from #fff to #333 for visibility */
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333; /* Added for visibility */
  }

  p {
    font-size: 18px;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    color: #555; /* Changed from implicit #fff to #555 for visibility */
  }
`;