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
      className="w-full h-full object-contain drop-shadow-2xl -translate-x-12 translate-y-6 md:translate-y-0"
      style={{
        maxHeight: '700px', // Limite la hauteur pour rester dans la zone bleue
      }}
    />
  );
}