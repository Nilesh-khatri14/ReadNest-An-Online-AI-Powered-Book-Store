
import React from 'react';
import { Publisher } from '@/types';
import PublisherCard from './PublisherCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedPublishersProps {
  publishers: Publisher[];
}

const FeaturedPublishers: React.FC<FeaturedPublishersProps> = ({ publishers }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-readnest-teal">Featured Publishers</h2>
          <Link 
            to="/publishers" 
            className="text-readnest-teal hover:text-readnest-darkTeal flex items-center"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publishers.map(publisher => (
            <PublisherCard key={publisher.id} publisher={publisher} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPublishers;
