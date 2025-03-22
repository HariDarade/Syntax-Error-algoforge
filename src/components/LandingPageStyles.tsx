import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  /* Wrapper for cosmic particles */
  .particles-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /* Behind all other content */
    pointer-events: none; /* Ensures the particles don't interfere with interactions */
  }

  /* Cosmic Particle Animation */
  .particle {
    position: absolute;
    background: radial-gradient(circle, rgba(52, 152, 219, 0.8) 20%, transparent 70%);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(52, 152, 219, 0.5); /* Glowing effect */
    animation: floatCosmic 10s linear infinite, swayCosmic 5s ease-in-out infinite, pulseCosmic 3s ease-in-out infinite, rotateCosmic 6s linear infinite;
  }

  /* Random positions, sizes, delays, and durations for each particle */
  .particle:nth-child(1) {
    left: 10%;
    width: 15px;
    height: 15px;
    bottom: -15px;
    --sway-offset: 8%;
    animation-duration: 8s, 4s, 2.5s, 5s; /* Float, sway, pulse, rotate durations */
    animation-delay: 0s, 0s, 0s, 0s;
    opacity: 0.6;
  }

  .particle:nth-child(2) {
    left: 25%;
    width: 20px;
    height: 20px;
    bottom: -20px;
    --sway-offset: 12%;
    animation-duration: 12s, 6s, 3s, 7s;
    animation-delay: 1s, 0.5s, 0.2s, 0s;
    opacity: 0.4;
  }

  .particle:nth-child(3) {
    left: 40%;
    width: 10px;
    height: 10px;
    bottom: -10px;
    --sway-offset: 15%;
    animation-duration: 9s, 5s, 2.8s, 6s;
    animation-delay: 2s, 1s, 0.4s, 0s;
    opacity: 0.7;
  }

  .particle:nth-child(4) {
    left: 55%;
    width: 18px;
    height: 18px;
    bottom: -18px;
    --sway-offset: 10%;
    animation-duration: 11s, 4.5s, 3.2s, 5.5s;
    animation-delay: 1.5s, 0.3s, 0.6s, 0s;
    opacity: 0.5;
  }

  .particle:nth-child(5) {
    left: 70%;
    width: 12px;
    height: 12px;
    bottom: -12px;
    --sway-offset: 14%;
    animation-duration: 10s, 5.5s, 2.7s, 6.5s;
    animation-delay: 0.5s, 0.8s, 0.1s, 0s;
    opacity: 0.6;
  }

  .particle:nth-child(6) {
    left: 85%;
    width: 16px;
    height: 16px;
    bottom: -16px;
    --sway-offset: 9%;
    animation-duration: 7s, 4.2s, 3.1s, 5.8s;
    animation-delay: 2.5s, 0.7s, 0.3s, 0s;
    opacity: 0.4;
  }

  /* Keyframes for floating upward */
  @keyframes floatCosmic {
    0% {
      transform: translateY(0);
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-100vh);
      opacity: 0.2;
    }
  }

  /* Keyframes for random horizontal swaying */
  @keyframes swayCosmic {
    0% {
      transform: translateX(calc(var(--sway-offset) * -1));
    }
    50% {
      transform: translateX(calc(var(--sway-offset) * 1));
    }
    100% {
      transform: translateX(calc(var(--sway-offset) * -1));
    }
  }

  /* Keyframes for pulsing effect */
  @keyframes pulseCosmic {
    0% {
      transform: scale(1);
      box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
    }
    50% {
      transform: scale(1.3);
      box-shadow: 0 0 25px rgba(52, 152, 219, 0.8);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
    }
  }

  /* Keyframes for random rotation */
  @keyframes rotateCosmic {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Ensure content is above the background animation */
  > * {
    position: relative;
    z-index: 1;
  }
`;

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

export const Logo = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: #3498db;
  font-weight: 600;
  font-size: 16px;
  transition: color 0.3s ease, transform 0.3s ease;
  &:hover {
    color: #2980b9;
    transform: translateY(-2px);
  }
`;

export const HeroWrapper = styled.section`
  text-align: center;
  padding: 100px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23e0f7fa" fill-opacity="0.5" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')
    bottom no-repeat;
  background-size: cover;
`;

export const HeroTitle = styled.h2`
  font-size: 60px;
  color: #2c3e50;
  margin: 0;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #7f8c8d;
  margin: 20px 0;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

export const Button = styled.button`
  padding: 12px 30px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px) rotateX(10deg);
    box-shadow: 0 10px 20px rgba(52, 152, 219, 0.6);
  }
`;

export const AboutWrapper = styled(motion.section)`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  position: relative;
  overflow: hidden;

  /* Wave animation at the bottom */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%; /* Double the width for smooth animation */
    height: 150px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23e0f7fa" fill-opacity="0.5" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')
      repeat-x bottom;
    background-size: 50% 100%; /* Adjust size for smooth repeating */
    animation: waveAnimation 15s linear infinite;
    z-index: 0; /* Behind the content */
  }

  /* Keyframes for wave animation */
  @keyframes waveAnimation {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%); /* Move to the left by half the width */
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 cards per row */
    gap: 40px 30px; /* Increased gap for better spacing */
    padding: 30px 0;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 1; /* Ensure content is above the wave */
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr; /* Stack cards on smaller screens */
      gap: 30px;
    }

    &::before {
      height: 100px; /* Reduce wave height on smaller screens */
      background-size: 70% 100%; /* Adjust wave size for smaller screens */
    }
  }
`;

export const AboutTitle = styled.h2`
  font-size: 40px;
  color: #2c3e50;
  margin-bottom: 25px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

export const AboutDescription = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
`;

export const FeatureCard = styled(motion.div)`
  text-align: left; /* Align text to the left for better readability */
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(52, 152, 219, 0.1);
  min-height: 200px; /* Ensure cards have a consistent height */
  position: relative;
  z-index: 1; /* Ensure cards are above the wave */

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 12px 20px rgba(52, 152, 219, 0.2);
    background: linear-gradient(45deg, rgba(52, 152, 219, 0.03), rgba(255, 255, 255, 1));
  }

  h3 {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 15px;
    font-weight: 600;
  }

  p {
    color: #7f8c8d;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 15px;
  }

  .additional-info {
    font-size: 15px;
    color: #5a6a7a;
    margin-bottom: 0;

    strong {
      color: #3498db;
      font-weight: 600;
    }
  }
`;

export const FeaturesWrapper = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 50px 0;
`;

export const FooterWrapper = styled.footer`
  text-align: center;
  padding: 20px 0;
  color: #7f8c8d;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
`;

export const PageContent = styled.div`
  padding: 50px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;