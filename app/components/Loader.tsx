"use client";

import React from "react";
import styled from "styled-components";
import { PuffLoader } from "react-spinners";

const LoaderContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 100, color = "red" }) => {
  return (
    <LoaderContainer>
      <PuffLoader size={size} color={color} />
    </LoaderContainer>
  );
};

export default Loader;
