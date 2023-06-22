// File: components/Footer.tsx
'use client';
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #ec3e5e;
  color: #fff;
  padding: 1rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-family: Arial, sans-serif;
`;

const FooterText = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const SmallFooterText = styled(FooterText)`
  font-size: 0.75rem;
  color: #fff;

  @media (min-width: 640px) {
    font-size: 0.85rem;
  }
`;

const Footer = () => (
    <FooterContainer>
        <FooterText>© 2023 جولتنا. جميع الحقوق محفوظة.</FooterText>
        <SmallFooterText>تطبيقنا سيكون متاحًا قريبًا في السوق</SmallFooterText>
    </FooterContainer>
);

export default Footer;
