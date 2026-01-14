"use client";
import { useState, useEffect } from 'react';

const carImages = [
  '/assets/image.png',
  '/assets/car5.png',
];


export default function AnimatedCarImage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <img
      src={carImages[current]}
      alt="Car"
      style={{
        width: '600px',
        maxWidth: '90vw',
        height: 'auto',
        borderRadius: '1.5rem'
      }}
    />
  );
}