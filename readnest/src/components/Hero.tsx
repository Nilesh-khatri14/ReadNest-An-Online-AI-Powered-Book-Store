
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Darker gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      <img 
        src="/lovable-uploads/bb52d365-97d6-455f-bdb3-ba6d8663c4e7.png" 
        alt="ReadNest Hero" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-0">
        <div className="max-w-xl backdrop-blur-sm bg-black/20 p-6 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Your Next Great Read
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Welcome to ReadNest, where books meet community and innovation. Explore our AI-powered recommendations and connect with a community of book lovers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
