
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, RocketIcon, LayoutDashboard } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-readnest-teal" />,
      title: "Extensive Book Collection",
      description: "Access a vast library of digital books across various genres and topics."
    },
    {
      icon: <Star className="h-8 w-8 text-readnest-teal" />,
      title: "AI-Powered Recommendations",
      description: "Get personalized book recommendations based on your reading preferences."
    },
    {
      icon: <RocketIcon className="h-8 w-8 text-readnest-teal" />,
      title: "Publish Your Work",
      description: "Self-publish your books and reach readers worldwide with our publishing platform."
    },
    {
      icon: <LayoutDashboard className="h-8 w-8 text-readnest-teal" />,
      title: "User-Friendly Interface",
      description: "Enjoy a seamless reading experience with our intuitive interface."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Logo */}
      <div className="bg-gradient-to-b from-readnest-cream to-white relative overflow-hidden">
        <img 
          src="/readnest-logo.svg" 
          alt="ReadNest Logo" 
          className="absolute w-[800px] h-[800px] opacity-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-readnest-teal mb-6">
              Welcome to ReadNest
            </h1>
            <p className="text-xl text-readnest-gray mb-8">
              Your AI-powered digital bookstore for discovering, reading, and publishing books
            </p>
            <Button 
              onClick={() => navigate('/home')} 
              className="btn-primary text-lg px-8 py-6"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section with Grid Layout */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-readnest-teal mb-12">
            Why Choose ReadNest?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 bg-readnest-cream rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-readnest-teal mb-3">
                  {feature.title}
                </h3>
                <p className="text-readnest-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-readnest-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of readers and writers. Discover new books, share your stories, and connect with fellow book lovers.
          </p>
          <Button 
            onClick={() => navigate('/home')} 
            variant="secondary"
            className="text-readnest-teal bg-white hover:bg-white/90"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
