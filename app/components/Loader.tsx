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

/**
 * Interface for Loader component props
 *
 * @interface LoaderProps
 * @property {number} [size=100] - Size of the loading spinner in pixels
 * @property {string} [color="red"] - Color of the loading spinner (CSS color value)
 */
interface LoaderProps {
  size?: number;
  color?: string;
}

/**
 * Loader Component
 *
 * A centralized loading spinner component used throughout the application to indicate
 * background processing, data fetching, or transitions. The component uses react-spinners'
 * PuffLoader for a consistent loading experience.
 *
 * The loader is centered vertically and horizontally within its container using
 * styled-components for consistent positioning.
 *
 * Used in scenarios like:
 * - Initial page loading
 * - Data fetching operations
 * - Form submissions
 * - Image loading in ListingHead
 *
 * @component
 * @param {LoaderProps} props - Component props
 * @returns {JSX.Element} Centered loading spinner
 */
const Loader: React.FC<LoaderProps> = ({ size = 100, color = "red" }) => {
  return (
    <LoaderContainer>
      <PuffLoader size={size} color={color} />
    </LoaderContainer>
  );
};

export default Loader;
