// File: components/Footer.tsx
"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const FooterContainer = styled.footer`
  background: linear-gradient(45deg, #ec3e5e, #ff6f91);
  color: #fff;
  padding: 3rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-family: "Arial", sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  animation: ${fadeIn} 1s ease-out;
`;

const FooterText = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  animation: ${fadeIn} 1.2s ease-out;

  @media (min-width: 640px) {
    font-size: 1.2rem;
  }
`;

const SmallFooterText = styled.p`
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1.4s ease-out;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 1.6s ease-out;
`;

const IconLink = styled.a`
  color: #fff;
  margin: 0 1rem;
  font-size: 1.5rem;
  transition:
    color 0.3s,
    transform 0.3s;

  &:hover {
    color: #ffdeeb;
    transform: scale(1.2);
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: #fff;
  color: #ec3e5e;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
  animation: ${fadeIn} 1.8s ease-out;

  &:hover {
    background-color: #ffdeeb;
    color: #ec3e5e;
    transform: scale(1.05);
  }
`;

const Footer = () => (
  <FooterContainer>
    <FooterText>© 2023 جولتنا. جميع الحقوق محفوظة.</FooterText>
    <SmallFooterText>تطبيقنا سيكون متاحًا قريبًا في السوق</SmallFooterText>
    <SocialIcons>
      <IconLink
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook />
      </IconLink>
      <IconLink
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter />
      </IconLink>
      <IconLink
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram />
      </IconLink>
    </SocialIcons>
    <CTAButton href="#download">تحميل التطبيق</CTAButton>
  </FooterContainer>
);

export default Footer;
