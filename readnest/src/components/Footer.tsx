
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-readnest-teal text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/readnest-logo.svg" alt="ReadNest Logo" className="w-8 h-8 filter brightness-0 invert" />
              <span className="text-xl font-bold">ReadNest</span>
            </div>
            <p className="text-sm text-gray-200">
              Where books meet community and innovation.
              Discover, connect, and explore with ReadNest.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-gray-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-200 hover:text-white">Home</Link></li>
              <li><Link to="/browse" className="text-gray-200 hover:text-white">Browse Books</Link></li>
              <li><Link to="/publishers" className="text-gray-200 hover:text-white">Publishers</Link></li>
              <li><Link to="/bestsellers" className="text-gray-200 hover:text-white">Bestsellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/publish" className="text-gray-200 hover:text-white">Publish with Us</Link></li>
              <li><Link to="/feedback" className="text-gray-200 hover:text-white">Give Feedback</Link></li>
              <li><Link to="/blog" className="text-gray-200 hover:text-white">Blog</Link></li>
              <li><Link to="/events" className="text-gray-200 hover:text-white">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-200 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-200 hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-200 hover:text-white">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-200 hover:text-white">Returns</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-sm text-gray-300">
          <div className="flex flex-col md:flex-row justify-between">
            <p>&copy; {new Date().getFullYear()} ReadNest. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
