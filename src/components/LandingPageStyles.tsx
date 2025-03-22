import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

export const Logo = styled.h1`
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: #3498db;
  font-weight: bold;
  &:hover {
    color: #2980b9;
  }
`;

export const HeroWrapper = styled.section`
  text-align: center;
  padding: 50px 0;
`;

export const HeroTitle = styled.h2`
  font-size: 48px;
  color: #2c3e50;
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  margin: 20px 0;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

export const FeaturesWrapper = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 50px 0;
`;

export const FeatureCard = styled.div`
  width: 30%;
  text-align: center;
  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }
  p {
    color: #7f8c8d;
  }
`;

export const FooterWrapper = styled.footer`
  text-align: center;
  padding: 20px 0;
  color: #7f8c8d;
`;

export const PageContent = styled.div`
  padding: 50px;
  text-align: center;
`;