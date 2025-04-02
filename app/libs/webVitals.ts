import { NextWebVitalsMetric } from 'next/app';

/**
 * Sends web vitals metrics to your analytics service
 * 
 * This function handles reporting Core Web Vitals metrics to your 
 * chosen analytics platform. It currently logs metrics to the console
 * but should be updated to send data to your actual analytics service.
 * 
 * Metrics reported:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 * 
 * @param {NextWebVitalsMetric} metric - The web vitals metric object
 */
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  // Log metrics to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vitals: ${metric.name}`, metric);
  }

  // Example implementation to send metrics to an analytics endpoint
  // In production, you'd want to collect these metrics
  const body = JSON.stringify({
    name: metric.name,
    id: metric.id,
    startTime: metric.startTime,
    value: metric.value,
    label: metric.label,
  });
  
  // Uncomment and modify to send data to your analytics
  /*
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
  */
}

/**
 * Types of Web Vital measurements
 */
export type WebVitalName = 
  | 'FCP'   // First Contentful Paint
  | 'LCP'   // Largest Contentful Paint
  | 'CLS'   // Cumulative Layout Shift
  | 'FID'   // First Input Delay
  | 'TTFB'  // Time to First Byte
  | 'INP';  // Interaction to Next Paint 